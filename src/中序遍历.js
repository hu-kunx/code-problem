/**
 * @param {TreeNode} root
 * @return {number[]}
 */
function centerTraversal(root) {
  function each(node, result) {
    if (node === null) return result;
    if (node.left) each(node.left, result);
    result.push(node.val);
    if (node.right) each(node.right, result);
    return result;
  }

  return each(root, []);
}
