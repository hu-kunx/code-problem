import {pushTarget, popTarget} from "./dep";
import {defineReactive, observe} from "./observer";

function getData( data, vm ) {
  pushTarget()
  let result = data.call( vm, vm )
  popTarget()
  return result
}

function proxy( target, sourceKey, key ) {
  Object.defineProperty( target, key, {
    enumerable: true,
    configurable: true,
    get() {
      return this[ sourceKey ][ key ]
    },
    set( v ) {
      this[ sourceKey ][ key ] = v
    }
  } )
}

export function initData( vm, options ) {
  let data = getData( options.data );
  vm._data = data;
  for ( let key of Object.keys( data ) ) {
    proxy( vm, "_data", key )
  }
  defineReactive( vm, "data", {
    enumerable: true,
    configurable: true,
    get() {
      return vm._data
    }
  } )
  observe( data )
}

export function initMethod( vm, options ) {
  for ( let key of Object.keys( options.method ) ) {
    vm[ key ] = options.method[ key ]
  }
}

