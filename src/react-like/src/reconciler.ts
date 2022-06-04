import { scheduleCallback } from "./schedule";
import { FC, Fiber, XxElement, XxFiberNode } from "./type";
import { resetHookIndex } from "./hook";
import { isStrOrNum } from "./util";
import { createText } from "./h";

let currentFiber: Fiber;
let cur: Fiber
const updateQueue: Fiber[] = []
const commitQueue: Fiber[] = []

export const getCurrentFiber = (): Fiber => currentFiber
type EContainer = Element | Document | DocumentFragment

export function render ( vnode: XxElement, element: EContainer, done?: () => void ) {
  const rootFiber = { node: element, props: { children: vnode }, done } as Fiber
  scheduleWork( rootFiber )
}

function scheduleWork ( fiber: Fiber ) {
  if ( !fiber.dirty ) {
    fiber.dirty = true
    updateQueue.push( fiber )
  }
  scheduleCallback( reconcileWork )
}

function reconcileWork ( timeout: boolean ) {
  if ( !cur ) cur = updateQueue.shift() as Fiber
  while ( cur && timeout ) {
    cur = reconcile( cur ) as Fiber
  }
}

function reconcile ( fiber: Fiber ): Fiber | undefined {

}

function updateHooks ( fiber: Fiber ) {
  currentFiber = fiber;
  resetHookIndex()
  let children = (fiber.type as FC<any>)( fiber.props )
  if ( isStrOrNum( children ) ) createText( children as unknown as string )
  reconcileChildren( fiber, children )
}

// diff
function reconcileChildren ( fiber: Fiber, children: XxFiberNode ) {

}

function commitWork () {

}

function commit () {

}
