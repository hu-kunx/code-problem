const isArray = Array.isArray;
function isSomeText(target) {
    return target === null || target === true || target === false;
}
function isStrOrNum(target) {
    return typeof target === "number" || typeof target === "string";
}

function Fragment(props) {
    return props.children;
}
function createText(value) {
    return { type: "text", props: { nodeValue: value } };
}
function copyAttrsToProps(target) {
    const result = {};
    for (const key in target) {
        if (key !== "key" && key !== "ref" && target.hasOwnProperty(key)) {
            result[key] = target[key];
        }
    }
    return result;
}
function h(type, attrs, ...args) {
    attrs = attrs || {};
    const key = attrs.key || null;
    const ref = attrs.ref || null;
    const children = [];
    let single = "", vnode, child, isTextChild;
    for (let i = 0, len = args.length; i < len; i++) {
        child = args[i];
        while (isArray(child) && child.some(v => isArray(v))) {
            child = child.flat();
        }
        vnode = isSomeText(child) ? "" : child;
        isTextChild = isStrOrNum(vnode);
        if (isTextChild)
            single += vnode;
        if (single && (!isTextChild || len - 1 === i)) {
            children.push(createText(single));
            single = "";
        }
        if (!isTextChild)
            children.push(vnode);
    }
    const props = copyAttrsToProps(attrs);
    props.children = children.length === 1 ? children[0] : children;
    return { type, props, key, ref };
}

function useState() {
}

function render(vnode, element, done) {
}

export { Fragment, h, render, useState };
