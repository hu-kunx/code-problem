/**
 * @param {TreeNode} root
 * @return {*[]}
 * 使用一个 pre 变量记录上一个输出的节点
 * 判断 cur 的左右子节点是否已经输出 (cur.left===pre || cur.right===pre)
 */
function postorderTraversal(root) {
  if (root === null) return [];
  let pre = null;
  const result = [];
  const stack = [root];
  while (stack.length !== 0) {
    const cur = stack[stack.length - 1];
    // 在当前节点没有左右子节点时 表示到了最底层输出 并将该节点出栈
    // 判断当前节点的左右子节点是否被遍历过 遍历过表示已经输出了 输出并出栈
    if (
      (cur.left === null && cur.right === null) ||
      (pre !== null && (cur.left === pre || cur.right === pre))
    ) {
      result.push(cur.val);
      pre = cur;
      stack.pop();
    } else {
      if (cur.right) stack.push(cur.right);
      if (cur.left) stack.push(cur.left);
    }
  }
  return result;
}
