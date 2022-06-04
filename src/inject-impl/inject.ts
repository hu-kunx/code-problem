import 'reflect-metadata';

const singletonList = new WeakMap() as WeakMap<Function, object>;
const providerSymbol = Symbol('reflect:metadata:provider');

interface ClassType {
  new (...args: any[]): any;
}

function structure(target: ClassType): any {
  if (!Reflect.hasOwnMetadata('design:paramtypes', target)) {
    if (singletonList.has(target)) {
      return target;
    }
    const instance = new target();
    singletonList.set(target, instance);
    return instance;
  }
  const params = Reflect.getOwnMetadata('design:paramtypes', target);
  const newParams: any[] = [];
  for (let i = 0, len = params.length; i < len; i++) {
    // 这里面是类型数组, 会有 String Number 这种成员
    // 所以需要判断参数是否是可以被注入的
    const param = params[i];
    if (!Reflect.getMetadata(providerSymbol, param)) {
      newParams.push(null);
      continue;
    }
    // 先查找类有没有被实例化
    if (singletonList.has(param)) {
      newParams.push(singletonList.get(param));
    } else {
      const instance = structure(param);
      newParams.push(instance);
      singletonList.set(param, instance);
    }
  }
  return new target(...newParams);
}

function provider(target: any) {
  Reflect.defineMetadata(providerSymbol, true, target);
}

function injectable(target: any): any {
  let i2n = structure(target);
  return function () {
    return i2n;
  };
}

/**
 * 2
 */

const singleRegistry = new Map() as Map<any, any>;
const MetaDataSymbolSingle = Symbol('reflect:metadata:single');
const MetaDataSymbolImmediately = Symbol('reflect:metadata:immediately');
const MetaDataSymbolDeps = Symbol('reflect:metadata:deps');
const MetaDataSymbolProvider = Symbol('reflect:metadata:provider');

interface RegistryParams {
  // TODO:是否立即初始化
  immediately?: boolean;
  //  是否为单例
  single?: boolean;
  //  依赖项
  deps?: { key: string; value: Function }[];
}

// 注册服务
function registry(
  params: RegistryParams = { deps: [], immediately: true, single: true }
) {
  return function (target: any) {
    Reflect.defineMetadata(MetaDataSymbolSingle, params.single, target);
    Reflect.defineMetadata(
      MetaDataSymbolImmediately,
      params.immediately,
      target
    );
    Reflect.defineMetadata(MetaDataSymbolDeps, params.deps, target);
    Reflect.defineMetadata(MetaDataSymbolProvider, true, target);
  };
}

function locator<T extends ClassType>(target: T): InstanceType<T> {
  if (singleRegistry.has(target)) {
    return singleRegistry.get(target);
  }
  return getIt(target);
}

function getIt(target: any): any {
  const protoDeps = [];
  if (Reflect.hasOwnMetadata(MetaDataSymbolDeps, target)) {
    const deps = Reflect.getOwnMetadata(MetaDataSymbolDeps, target);
    for (let i = 0; i < deps.length; i++) {
      const { key, value } = deps[i];
      if (singleRegistry.has(value)) {
        protoDeps.push({ key, value: singleRegistry.get(value) });
      } else {
        if (!Reflect.getOwnMetadata(MetaDataSymbolProvider, value)) {
          protoDeps.push({ key, value: null });
        } else {
          const val = getIt(value);
          if (Reflect.getOwnMetadata(MetaDataSymbolSingle, value)) {
            singleRegistry.set(value, val);
          }
          protoDeps.push({ key, value: val });
        }
      }
    }
  }
  const nParams = [];
  if (Reflect.hasOwnMetadata('design:paramtypes', target)) {
    const params = Reflect.getOwnMetadata('design:paramtypes', target);
    for (let i = 0; i < params.length; i++) {
      if (singleRegistry.has(params[i])) {
        nParams.push(singleRegistry.get(params[i]));
      } else {
        if (!Reflect.getOwnMetadata(MetaDataSymbolProvider, params[i])) {
          nParams.push(null);
        } else {
          const val = getIt(params[i]);
          if (Reflect.getOwnMetadata(MetaDataSymbolSingle, params[i])) {
            singleRegistry.set(params[i], val);
          }
          nParams.push(singleRegistry.get(params[i]));
        }
      }
    }
  }

  const instance = new target(...nParams);
  protoDeps.forEach(e => {
    instance[e.key] = e.value;
  });
  return instance;
}


