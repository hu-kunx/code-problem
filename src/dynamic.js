function dp(n) {
  const f = new Array(n + 1).fill(0);
  const mod = 1000000007;
  f[0] = 1;
  for (let i = 1; i < n + 1; i++) {
    f[i] = f[i - 1];
    if (i >= 2) f[i] = (f[i] + f[i - 2]) % mod;
    if (i >= 3) f[i] = (f[i] + f[i - 3]) % mod;
  }
  console.log(f);
  return f[n];
}
// 后缀数组, 是后缀树的升级它时间效率高，而且代码简单，不易写错。空间大概是后缀树的五分之一到三分之一

function longestDupSubstring(S) {
  S += "$";
  let sa = [],
    rank = [];
  for (let i = 0; i < S.length; i++) {
    sa.push(S.substring(i));
  }
  sa.sort();
}

console.log(dp(5));
