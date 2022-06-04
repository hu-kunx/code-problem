import { Attributes, Fiber, FiberTag } from "./type";

export function createElement ( fiber: Fiber ) {
  if ( fiber.type === "text" ) {
    return document.createTextNode( fiber.props.nodeValue );
  }
  let element =
    fiber.tag === FiberTag.svg
      ? document.createAttributeNS( "http://www.w3.org/2000/svg", fiber.type as string )
      : document.createElement( fiber.type as string );
  updateElement( element as HTMLElement, {}, fiber.props );
  return element;
}

export function updateElement<T extends Attributes> ( element: HTMLElement, props: T, nextProps: T ) {
  let oldValue = null;
  let newValue = null;
  for ( let key of Object.keys( props ).concat( Object.keys( nextProps ) ) ) {
    oldValue = props[ key ];
    newValue = nextProps[ key ];
    if ( oldValue === newValue || key === "children" ) {
      continue;
    }
    if ( key[ 0 ] === "o" && key[ 1 ] === "n" ) {
      const eventName = key.slice( 2 ).toLowerCase();
      if ( oldValue ) element.removeEventListener( eventName, oldValue );
      element.addEventListener( eventName, newValue );
      continue;
    }
    if ( key === "style" ) {
      for ( const k of Object.keys( oldValue ).concat( Object.keys( newValue ) ) ) {
        if ( !(newValue && oldValue && newValue[ key ] === oldValue[ k ]) ) {
          // @ts-ignore
          element[ key ][ k ] = (newValue && newValue[ key ]) || "";
        }
      }
      continue;
    }
    if ( key in element && !(element instanceof SVGElement) ) {
      // @ts-ignore
      element[ key ] = newValue === null ? "" : newValue;
      continue;
    }
    if ( newValue === null || newValue === false ) {
      element.removeAttribute( key );
      continue;
    }
    element.setAttribute( key, newValue );
  }
}
