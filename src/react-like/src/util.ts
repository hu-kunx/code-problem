export const isArray = Array.isArray;

export function isSomeText( target:any ) {
  return target === null || target === true || target === false
}

export function isStrOrNum( target:any ) {
  return typeof target === "number" || typeof target === "string"
}

