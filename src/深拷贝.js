class DeepClone {
  cache = new WeakMap()

  clone( source ) {
    if ( source instanceof Object ) {
      if ( this.cache.has( source ) ) {
        return this.cache.get( source )
      }
      let target = {};
      if ( source instanceof Function ) {
        // 函数的静态方法和属性,以及原型上的方法属性
        target = function () {
          return source.apply( this, arguments )
        }
      } else if ( source instanceof Array ) {
        target = source.map( v => this.clone( v ) )
      } else if ( source instanceof Date ) {
        target = new Date( source.getTime() )
      } else if ( source instanceof RegExp ) {
        target = new RegExp( source.source, source.flags )
        target.lastIndex = source.lastIndex;
      } else if ( source instanceof String || source instanceof Boolean || source instanceof Number ) {
        target = source.valueOf()
      } else if ( source instanceof Map ) {
        target = new Map( source.entries() )
      } else if ( source instanceof Set ) {
        target = new Set( source.values() )
      }
      this.cache.set( source, target )
      for ( const sourceKey of Reflect.ownKeys( source ) ) {
        target[ sourceKey ] = this.clone( source[ sourceKey ] )
      }
      return target
    }
    // null undefined number string bigint symbol
    return source
  }
}

function test() {
  var a = {
    name: "muyiy",
    book: {
      title: "You Don't Know JS",
      price: "45"
    },
    a0: [ 1, 2, false, null, undefined ],
    a1: undefined,
    a2: null,
    a3: 123,
    a4: Symbol( 2 ),
    a5: /rdfs/g,
    a6: new Date(),
    [ Symbol() ]: 2,
    a7: new Set( [ 1, 2 ] ),
    a8: new Map( [ [ 1, 3 ] ] )
  }
  a.a9 = a;
  const b = new DeepClone().clone( a )
  console.log( a, b )
  console.log( a.a9 === b.a9 )
}


test()
