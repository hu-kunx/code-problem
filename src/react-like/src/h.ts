import { isArray, isStrOrNum, isSomeText } from "./util";
import { Attributes, Fiber, FiberProps, XxElement, XxFiberNode } from "./type";

export function Fragment ( props: { children?:XxFiberNode } ): XxElement {
  return props.children as XxElement
}

export function createText ( value: string ): Fiber {
  return { type: "text", props: { nodeValue: value } } as Fiber
}

function copyAttrsToProps<T extends {}> ( target: T ): T {
  const result: any = {}
  for ( const key in target ) {
    if ( key !== "key" && key !== "ref" && target.hasOwnProperty( key ) ) {
      result[ key ] = target[ key ]
    }
  }
  return result
}

export function h<P extends Attributes = {}> ( type: string, attrs: P, ...args: Fiber[] ): Partial<Fiber> {
  attrs = attrs || {}
  const key = attrs.key || null;
  const ref = attrs.ref || null;
  const children = [];
  let single = "", vnode, child, isTextChild;
  for ( let i = 0, len = args.length; i < len; i++ ) {
    child = args[ i ];
    while ( isArray( child ) && child.some( v => isArray( v ) ) ) {
      child = (child as any).flat();
    }
    vnode = isSomeText( child ) ? "" : child
    isTextChild = isStrOrNum( vnode )
    if ( isTextChild ) single += vnode
    if ( single && ( !isTextChild || len - 1 === i) ) {
      children.push( createText( single ) );
      single = ""
    }
    if ( !isTextChild ) children.push( vnode )
  }
  const props = copyAttrsToProps( attrs )
  props.children = children.length === 1 ? children[ 0 ] : children
  return { type, props, key, ref } as Partial<Fiber>
}

