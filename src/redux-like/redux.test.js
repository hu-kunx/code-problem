import { createStore, binActionCreators, applyMiddleware, combineReducers, loggerMiddleware } from "./redux.js";

function todos( state = [], action ) {
  switch ( action.type ) {
    case 'ADD_TODO':
      return state.concat( [ action.text ] )
    default:
      return state
  }
}

function counter( state = 0, action ) {
  switch ( action.type ) {
    case 'INCREMENT':
      return state + 1
    case 'DECREMENT':
      return state - 1
    default:
      return state
  }
}

function testSubscribe() {
  const store = createStore( todos, [ 'Use Redux' ] )
  let updateTimes = 0;
  const unsubscribe = store.subscribe( function () {
    updateTimes++
  } )

  store.dispatch( addTodo( 'Read the docs' ) )
  console.log( store.getState()[ 1 ] === "Read the docs" )
  console.log( updateTimes === 1 )
  unsubscribe()
  store.dispatch( { type: 'ADD_TODO', text: 'Read the docs2' } )
  console.log( store.getState()[ 2 ] === "Read the docs2" )
  console.log( updateTimes === 1 )

  function addTodo( text ) {
    return { type: 'ADD_TODO', text }
  }
}


function testCombineReducers() {
  const store = createStore( combineReducers( { todos, counter } ) )
  console.log( store.getState().counter === 0 )
  store.dispatch( { type: 'ADD_TODO', text: 'Use Redux' } )
  console.log( store.getState().todos[ 0 ] === "Use Redux" )
}

function testMiddleware() {
  const store = createStore( todos, [ 'Use Redux' ], applyMiddleware(loggerMiddleware) )
  store.dispatch( { type: 'ADD_TODO', text: 'Read the docs' } )
  store.dispatch( { type: 'ADD_TODO', text: 'Read the docs' } )
}

