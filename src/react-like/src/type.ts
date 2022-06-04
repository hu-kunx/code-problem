export interface FiberProps {
  children: Fiber | Fiber[]
  nodeValue?: string
}

export type Key = string | number
export type DependencyList = ReadonlyArray<any>;

export interface RefObject<T> {
  current: T
}

export type RefCallback<T> = {
  bivarianceHack ( instance: T | null ): void
}['bivarianceHack']
export type Ref<T = any> = RefCallback<T> | RefObject<T> | null
export type XxFiberNode = Key | XxElement | XxFiberNode[] | boolean | null | undefined
export type HTMLElementEx = HTMLElement & { last: Fiber | null }

export interface Hooks {
  list: [ Function?, DependencyList?][],
  effect: [ Function?, DependencyList?][]
}

export interface Attributes extends Record<string, any> {
  key?: string,
  children?: Fiber
  ref?: Ref
}

export interface XxElement<P extends Attributes = any, T = string> {
  type: T
  props: P
}

export interface FC<P extends Attributes = {}> {
  fiber?: Fiber
  tag?: number
  type?: string

  ( props: P ): XxElement<P> | null
}

export interface Fiber<P extends Attributes = any> {
  key?: string
  tag: FiberTag
  dirty?: boolean
  op?: FiberOP
  type: string | FC<P>
  node: HTMLElementEx
  done?: () => void
  ref: HTMLElement & { current?: HTMLElement },
  hooks: Hooks,
  props: P,
}

export enum FiberOP {
  UPDATE,
  DELETE,

}

export enum FiberTag {
  svg = 0,
}
