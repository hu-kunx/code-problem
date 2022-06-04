/**
 * @param {number} num
 * @constructor
 */
function Node( num ) {
  this.val = num;
  this.left = null;
  this.right = null;
}

/**
 * @param {Node} root
 * @return {[]|number[]}
 * 使用变量计数,避免对.length 的不断计算
 * 使用变量计数避免对数组的头部的删除(数组头部删除很影响性能), 但是空间复杂度变成了稳定 O(N)
 */
function bfs( root ) {
  if ( !root ) return []
  const queue = [ root ];
  const output = [];
  let level = 0;
  let i = 0, len = 1, siz = 1, nSiz = 1;
  while ( i < len ) {
    output[ level ] = [];
    siz = i + nSiz;
    nSiz = 0
    while ( i < siz ) {
      const node = queue.shift();
      if ( node.left !== null ) {
        queue.push( node.left );
        len++
        nSiz++
      }
      if ( node.right !== null ) {
        queue.push( node.right );
        len++
        nSiz++
      }
      output[ level ].push( node.val );
      i++
    }
    level++
  }
  return output;
}

/**
 * @param {Node} root
 * @return {[]|number[]}
 */
function dfs( root ) {
  if ( !root ) return []
  const stack = [ root ];
  const output = [];
  let size = 1;
  while ( size > 0 ) {
    const node = stack.pop();
    if ( node.right !== null ) {
      stack.push( node.right );
      size++
    }
    if ( node.left !== null ) {
      stack.push( node.left );
      size++
    }
    output.push( node.val );
    size--
  }
  return output;
}

/**
 * 中序遍历
 * @param {Node} root
 * @return {[]|number[]}
 */
var inorderTraversal = function ( root ) {
  if ( !root ) return [];
  const result = [];
  const stack = [];
  while ( root !== null || stack.length > 0 ) {
    while ( root !== null ) {
      stack.push( root );
      root = root.left;
    }
    root = stack.pop();
    result.push( root.val );
    root = root.right;
  }
  return result;
};

/**
 * 前序遍历
 * @param {Node} root
 * @return {[]|number[]}
 */
function preorderTraverse( root ) {
  const stack = [ root ];
  const output = [];
  let size = 1;
  while ( size > 0 ) {
    const node = stack.pop();
    if ( node.right !== null ) {
      stack.push( node.right );
      size++
    }
    if ( node.left !== null ) {
      stack.push( node.left );
      size++
    }
    output.push( node.val );
    size--
  }
  return output;
}

/**
 * 后序遍历
 * @param {Node} root
 * @return {[]|number[]}
 */
function postorderTraversal( root ) {
  if ( !root ) return []
  const stack = [ root ]
  const result = []
  let pre = null;
  let size = 1;
  while ( size > 0 ) {
    root = stack[ size - 1 ]
    if ( root.left === null && root.right === null || (pre !== null && (root.left === pre || root.right === pre)) ) {
      result.push( stack.pop().val )
      pre = root
      size--
    } else {
      if ( root.right ) {
        stack.push( root.right )
        size++
      }
      if ( root.left ) {
        stack.push( root.left )
        size++
      }
    }
  }
  return result
}

/**
 * 从后序和中序遍历还原二叉树
 * @param before
 * @param center
 * @return {Node|null}
 */
function tree( before, center ) {
  if ( center.length === 0 ) return null;
  const rootValue = before.shift();
  const root = new Node( rootValue );
  const midIndex = center.indexOf( rootValue );
  const left = center.slice( 0, midIndex );
  const right = center.slice( midIndex + 1 );
  root.left = tree( before, left );
  root.right = tree( before, right );
  return root;
}


function TestBuildTreeByResult() {
  const o = tree( "GDAFEMHZ".split( "" ), "ADEFGHMZ".split( "" ) );
  console.log( preorderTraverse( o ).join( "" ) === "GDAFEMHZ" );
  console.log( middleOrder( o ).join( "" ) === "ADEFGHMZ" );
}

function buildTree( array ) {
  if ( array.length === 0 || array[ 0 ] === null || array[ 0 ] === undefined ) return
  const nodes = array.map( v => new Node( v ) )
  for ( let i = 0, len = Math.floor( array.length / 2 ); i < len; i++ ) {
    let l = 2 * i + 1, r = 2 * i + 2;
    if ( nodes[ i ].val !== null ) {
      nodes[ i ].left = nodes[ l ].val === null ? null : nodes[ l ]
      nodes[ i ].right = nodes[ r ].val === null ? null : nodes[ r ]
    }
  }
  return nodes[ 0 ];
}

function fs( root, result = [] ) {
  if ( !root ) return result
  if ( root.left ) fs( root.left, result )
  result.push( root.val )
  if ( root.right ) fs( root.right, result )
  return result
}
