import {Dep} from "./dep"

export class Observer {
  constructor( value ) {
    this.value = value
    this.dep = new Dep()
    def( value, "__ob__", this )
    console.log( "add observe", value )
    this.walk( value )
  }

  walk( target ) {
    for ( let key of Object.keys( target ) ) {
      defineReactive( target, key, target[ key ] )
    }
  }
}

export function defineReactive( target, key, value ) {
  const dep = new Dep()
  const property = Object.getOwnPropertyDescriptor( target, key )
  if ( property && property.configurable === false ) {
    return
  }
  const getter = property && property.get
  const setter = property && property.set
  const childObserve = value && observe( value )
  Object.defineProperty( target, key, {
    configurable: true,
    enumerable: true,
    get() {
      if ( Dep.target ) {
        dep.depend()
        if ( childObserve ) {
          childObserve.dep.depend()
        }
      }
      return getter ? getter.call( target ) : value
    },
    set( newValue ) {
      const val = getter ? getter.call( target ) : value
      if ( val === newValue || (newValue !== newValue && val !== val) ) {
        return
      }
      if ( setter ) {
        setter.call( target, newValue )
      } else {
        value = newValue
      }
      observe( newValue )
      dep.notify()
    },
  } )
}

export function observe( value ) {
  if ( typeof value !== "object" ) return
  let ob;
  if ( value.__ob__ && value.__ob__ instanceof Observer ) {
    ob = value.__ob__
  } else {
    ob = new Observer( value )
  }
  return ob
}

function def( o, k, v ) {
  Object.defineProperty( o, k, {
    enumerable: false,
    configurable: true,
    value: v
  } )
}
