/**
 * 数字添加分隔符
 * @param {number} num
 * @param {number} bit
 * @param {string} symbol
 * @return {string}
 */
function formatNum( num, symbol = ",", bit = 3 ) {
  const s = num.toString();
  if ( bit <= 0 ) return s;
  if ( bit >= s.length - 1 ) return s;
  const hasDot = (0 < num % 10) && (num % 10 < 1)
  let i = hasDot ? s.indexOf( "." ) - 1 : s.length - 1;
  let j = i + 1;
  let result = hasDot ? s.substring( i + 1 ) : ""
  while ( i >= 0 ) {
    result = s[ i ] + result
    if ( j - i === bit && i !== 0 ) {
      result = symbol + result
      j = i;
    }
    i--
  }
  return result
}


console.log(formatNum(100000)==="100,000")
console.log(formatNum(100000.5)==="100,000.5")
console.log(formatNum(10000000.5,"_")==="10_000_000.5")
console.log(formatNum(10000000.5,"_",4)==="1000_0000.5")
