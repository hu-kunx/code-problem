function callLike( that, ...args ) {
  if ( typeof that !== "object" || that === null ) {
    throw new TypeError( "that is need a Object!" )
  }
  const name = "__fn";
  let copy = that[ name ]
  that[ name ] = this;
  const a = []
  for ( let i = 1, l = arguments.length; i < l; i++ ) {
    a.push( arguments[ i ] )
  }
  let result = eval( `that.__fn(${ a.join( "," ) })` )
  delete that[ name ]
  if ( copy ) {
    that[ name ] = copy
  }
  return result
}


function applyLike( that, ...args ) {
  if ( typeof that !== "object" || that === null ) {
    throw new TypeError( "that is need a Object!" )
  }
  return this.call( that, ...args )
}

function bindLike( that, ...args ) {
  const fn = this;
  return function ( ...args2 ) {
    return fn.apply( that, [ ...args, ...args ] )
  }
}

