import { expect } from "../utils/buildTree.mjs";

/**
 * 大整数加法
 * @param {string} num1
 * @param {string} num2
 */
function bigNumSum( num1, num2 ) {
  let res = ""
  let s = nusrcm1
  let l = num2
  if ( num1.length > num2.length ) {
    s = num2
    l = num1
  }
  let i = s.length - 1
  let y = l.length - s.length
  let k = 0;
  let v = 0;
  while ( i >= 0 ) {
    v = Number( l[ i + y ] ) + Number( s[ i ] ) + k
    k = v >= 10 ? 1 : 0
    res = v % 10 + res
    i--
  }
  if ( k === 1 ) {
    while ( y > 0 && k === 1 ) {
      v = Number( l[ y - 1 ] ) + k
      k = v >= 10 ? 1 : 0
      res = v % 10 + res
      y--
    }
    res = k === 1 ? 1 + res : res
  } else {
    res = l.substring( 0, y ) + res
  }
  return res
}

function testBigNumSum() {
  expect( bigNumSum( "86", "79" ), (86 + 79).toString(), "86+79" )
  expect( bigNumSum( "986", "79" ), (986 + 79).toString(), "986+79" )
  expect( bigNumSum( "999", "1" ), (999 + 1).toString(), "999+1" )
  expect(
    BigInt( bigNumSum( "23423415623467893", "2343247673" ) ),
    (BigInt( "23423415623467893" ) + BigInt( "2343247673" ))
  )
}

testBigNumSum()
