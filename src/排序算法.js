/**
 * 快排
 * @param {number[]} array
 * @return {number[]}
 */
function quickSort( array ) {
  /**
   * @param {number[]} array
   * @param {number} start
   * @param {number} end
   */
  function sort( array, start, end ) {
    if ( start >= end ) return;
    let i = start,
      j = end;
    const mid = array[ i ];
    while ( i < j ) {
      while ( i < j && array[ j ] >= mid ) {
        j--;
      }
      array[ i ] = array[ j ];
      while ( i < j && array[ i ] <= mid ) {
        i++;
      }
      array[ j ] = array[ i ];
    }
    array[ i ] = mid;
    sort( array, start, i );
    sort( array, i + 1, end );
  }

  sort( array, 0, array.length - 1 );
  return array
}

/**
 * 归并排序
 * @param {number[]} array
 * @return {number[]}
 */
function mergeSort( array ) {
  const tmp = [];

  /**
   * @param {number[]} array
   * @param {number} s
   * @param {number} m
   * @param {number} e
   */
  function merge( array, s, m, e ) {
    let i = s,
      j = m + 1,
      k = 0;
    while ( i <= m && j <= e ) {
      if ( array[ i ] < array[ j ] ) {
        tmp[ k++ ] = array[ i++ ];
      } else {
        tmp[ k++ ] = array[ j++ ];
      }
    }
    while ( i <= m ) {
      tmp[ k++ ] = array[ i++ ];
    }
    while ( j <= e ) {
      tmp[ k++ ] = array[ j++ ];
    }
    for ( let l = 0; l < k; l++ ) {
      array[ s + l ] = tmp[ l ];
    }
  }

  /**
   * @param {number[]} array
   * @param {number} start
   * @param {number} end
   */
  function sort( array, start, end ) {
    if ( start >= end ) return;
    const midIndex = Math.floor( (end + start) / 2 );
    sort( array, start, midIndex );
    sort( array, midIndex + 1, end );
    merge( array, start, midIndex, end );
  }

  sort( array, 0, array.length - 1 );
  return array;
}

function radixSort( array ) {
  const getRadix = ( num, n ) => Math.floor( num / Math.pow( 10, n ) ) % 10;
  let radix = 0,
    length = array.length;
  const bucket = new Array( 10 ).fill( [] ).map( ( v ) => [] );
  const maxRadix = array.reduce( ( p, c ) => {
    let l = c.toString().length;
    return l > p ? l : p;
  }, 0 );
  while ( radix < maxRadix ) {
    for ( let i = 0; i < length; i++ ) {
      bucket[ getRadix( array[ i ], radix ) ].push( array[ i ] );
    }
    let j = 0,
      l = 0;
    while ( j < 10 ) {
      for ( let k = 0; k < bucket[ j ].length; k++, l++ ) {
        array[ l ] = bucket[ j ][ k ];
      }
      j++;
    }
    bucket.forEach( ( v ) => (v.length = 0) );
    radix++;
  }
  return array;
}

function test( fn ) {
  const array1 = outOfOrder( buildArray( 23 ) );
  console.log( fn( array1 ) );
}

function buildArray( size ) {
  return new Array( size ).fill( 0 ).map( ( _, i ) => i );
}

function outOfOrder( arr ) {
  let i = arr.length - 1;
  while ( i > 0 ) {
    swap( arr, i, Math.floor( Math.random() * i ) );
    i--;
  }
  return arr;
}

function swap( arr, i, j ) {
  let t = arr[ i ];
  arr[ i ] = arr[ j ];
  arr[ j ] = t;
}

//// 排序

function MergeSort( list ) {
  if ( !(Array.isArray( list ) && list.length > 0) ) return list;
  const arr = [];
  sort( list, 0, list.length - 1, arr );
  list = arr;
  return list;

  function sort( list, low, high, temp ) {
    if ( low < high ) {
      const mid = Math.floor( (high + low) / 2 );
      sort( list, low, mid, temp );
      sort( list, mid + 1, high, temp );
      mergeArray( temp, list, low, mid, high );
    }
  }

  function mergeArray( now, origin, low, mid, high ) {
    let l = low,
      h = mid + 1,
      k = 0;
    const m = mid,
      j = high;
    while ( l <= m && h <= j ) {
      if ( origin[ l ] < origin[ h ] ) {
        now[ k++ ] = origin[ l++ ];
      } else {
        now[ k++ ] = origin[ h++ ];
      }
    }

    while ( l <= m ) {
      now[ k++ ] = origin[ l++ ];
    }
    while ( h <= j ) {
      now[ k++ ] = origin[ h++ ];
    }

    for ( let i = 0; i < k; i++ ) {
      origin[ low + i ] = now[ i ];
    }
  }
}

// test(MergeSort)
