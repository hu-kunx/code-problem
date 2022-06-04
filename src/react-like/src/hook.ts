import { getCurrentFiber } from "./reconciler";
import { DependencyList, Fiber, Hooks } from "./type";
import { scheduleWork } from "./schedule";

let hookIndex = 0;

export function resetHookIndex () {
  hookIndex = 0;
}

function getHook<S = Function | undefined, D = any> (cursor:number): [ [ S, D ], Fiber<any> ] {
  const fiber = getCurrentFiber();
  const hooks = fiber.hooks || (fiber.hooks = { list: [], effect: [] })
  if ( cursor >= hooks.list.length ) {
    hooks.list.push( [] )
  }
  return [ hooks.list[ cursor ] as unknown as [ S, D ], fiber ]
}

type SetterFun<S> = ( value: S ) => S
type Setter<S> = ( value: S | SetterFun<S> ) => void

export function useState<T> ( defaultValue: T ): [ T, Setter<T> ] {
  const [ hook, fiber ] = getHook<T>(hookIndex++);

  const setter: Setter<T> = ( value ) => {
    const newValue = typeof value === "function" ? (value as SetterFun<T>)( hook[ 0 ] ) : value;
    if ( newValue !== hook[ 0 ] ) {
      hook[ 0 ] = newValue
      scheduleWork( fiber )
    }
  }

  if ( hook.length ) {
    return [ hook[ 0 ] as T, setter ]
  }
  hook[ 0 ] = defaultValue as T
  return [ defaultValue, setter ]
}
