function newLike( fn, ...args ) {
  const that = {};
  that.__proto__ = fn.prototype;
  const result = fn.apply( that, args );
  if (
    (typeof result === "object" && result !== null) ||
    typeof result === "function"
  ) {
    return result;
  }
  return that;
}

function inherit( A, B ) {
  inheritPrototype( A, B )
  inheritStaticProperty( A, B )
}

function inheritPrototype( A, B ) {
  A.prototype = Object.create( B.prototype )
  A.prototype.constructor = A;
}

function inheritStaticProperty( A, B ) {
  for ( const bKey in B ) {
    if ( B.hasOwnProperty( bKey ) ) {
      A[ bKey ] = B[ bKey ]
    }
  }
}


function createObject( prop ) {
  function F() {

  }

  F.prototype = prop
  return new F()
}
