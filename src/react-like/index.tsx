// @ts-ignore
import { render, h, useState } from "./lib/bundle.esm.js";

function ShowValue ( props: any ) {
  return (<span>{ props.value }</span>)
}

function App () {
  const [ count, setCount ] = useState( 0 )
  return (
    <div>
      <ShowValue value={ count }/>
      <button onClick={ () => setCount( count + 1 ) }>add</button>
    </div>
  )
}


const a = render( App, document.body )
console.log(a)
