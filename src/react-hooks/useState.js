const fiber = {
  component: null,
  mount() {
    this.component()
    this.stateHooksIndex = 0
    this.state = 1
  },
  update() {
    const fns = this.effectHooksList.map( v => v.callback( v.deps ) )
    this.component()
    this.stateHooksIndex = 0
    fns.forEach( v => typeof v === "function" && v() )
  },
  state: 0,
  stateHooksList: [],
  effectHooksList: [],
  stateHooksIndex: 0
}

function getCurrentFiber() {
  return fiber
}

function useState( initialState ) {
  const fiber = getCurrentFiber()
  if ( fiber.state === 0 ) {
    fiber.stateHooksList.push( initialState )
  }
  const index = fiber.stateHooksIndex
  const state = fiber.stateHooksList[ index ]
  fiber.stateHooksIndex++

  function setState( newState ) {
    if ( typeof newState === "function" ) {
      newState = newState( fiber.stateHooksList[ index ] )
    }
    fiber.stateHooksList[ index ] = newState
    Promise.resolve().then( () => fiber.update() )
  }

  return [ state, setState ]
}

function useEffect( callback, deps ) {
  const fiber = getCurrentFiber()
  if ( fiber.state === 0 ) {
    fiber.effectHooksList.push( { callback, deps } )
  }
}

function render( component ) {
  fiber.component = component
  fiber.mount()
  fiber.update()
}


render( function () {
  const [ state, setState ] = useState( 0 )
  console.log( state )
  useEffect( function () {
    setTimeout( () => setState( s => s + 1 ), 500 )
  }, [ state ] )
} )
