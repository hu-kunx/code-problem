/**
 * 函数柯里化
 * @param {function} fn
 * @return {c}
 */
function curry( fn ) {
  let args = [];
  return function c( ...arg ) {
    let i = 0, l = arg.length, length = args.length;
    while ( i < l ) {
      args[ length + i ] = arg[ i++ ]
    }
    if ( length + l >= fn.length ) {
      const res = fn( ...args.slice( 0, length+l ) )
      args.length = 0
      return res
    }
    return c
  }
}

function abc( a, b, c, d, e ) {
  return [ a, b, c, d, e ]
}

const c = curry( abc )
console.log( c( 1 )( 2 )( 3 )( 4 )( 5 ) )
console.log( c( 1, 2 )( 3, 4 )( 5 ) )
console.log( c( 1, 2, 3, 4, 5 ) )
