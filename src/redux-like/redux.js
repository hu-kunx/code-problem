/**
 * @name unSubscribe
 * @function
 */

/**
 * @name dispatch
 * @function
 * @param action
 */
/**
 * @param reducer
 * @param preloadedState
 * @param enhancer
 * @return {{replaceReducer: replaceReducer, getState: (function(): *), dispatch: dispatch, subscribe: (function(*=): unSubscribe)}|*}
 */
export function createStore( reducer, preloadedState, enhancer ) {
  if ( typeof reducer !== "function" ) {
    throw new TypeError( "The reducer needs to be a function!" )
  }
  if ( typeof preloadedState === "function" ) {
    enhancer = preloadedState
    preloadedState = undefined
  }
  if ( typeof enhancer === "function" ) {
    return enhancer( createStore )( reducer, preloadedState )
  }

  let state = undefined;
  const listeners = [];
  let currentReducer = reducer;

  function getState() {
    return state
  }

  function dispatch( action ) {
    if ( typeof action !== "object" || action === null ) {
      throw TypeError( "Action need a plain object!" )
    }
    if ( typeof action.type === "undefined" ) {
      throw new TypeError( "Actions may not have an undefined \"type\" property. " )
    }
    const prevState = state;
    state = currentReducer( prevState, action )
    if ( prevState !== state ) {
      const observes = listeners.slice()
      observes.forEach( listener => listener() )
    }
    return action
  }

  function subscribe( listener ) {
    if ( typeof listener !== "function" ) {
      throw TypeError( "callback is a function!" )
    }
    if ( !listeners.includes( listener ) ) {
      listeners.push( listener )
    }
    return function unSubscribe() {
      const index = listeners.indexOf( listener )
      if ( index !== -1 ) {
        listeners.splice( index, 1 )
      }
    }
  }

  function replaceReducer( nextReducer ) {
    if ( typeof nextReducer !== "function" ) {
      throw TypeError( "reducer is a function!" )
    }
    dispatch( { type: "@@REPLACE_REDUCER" } )
    currentReducer = nextReducer
  }

  dispatch( { type: "@@INIT_DATA" } )
  return {
    getState,
    dispatch,
    subscribe,
    replaceReducer
  }
}

/**
 * @param reducers
 * @return {function(*=, *=): {}}
 * 对于 reducers 有几个限制
 * 1. 无法识别 action 时需要返回 传进来的 state
 * 2. 不能返回 undefined
 * 3. 如果 state 为 undefined 即初始数据, 需要给他一个默认值
 */
export function combineReducers( reducers ) {
  if ( typeof reducers !== "object" || reducers === null ) {
    throw new TypeError( 'invalid reducers object!' );
  }
  const reducerKeys = Object.keys( reducers )
  if ( reducerKeys.length === 0 ) {
    throw new TypeError( 'reducers object can not empty' );
  }
  if ( reducerKeys.some( key => typeof reducers[ key ] !== "function" ) ) {
    throw new TypeError( 'invalid reducers object!' );
  }
  const finalReducers = {}
  for ( let key of reducerKeys ) {
    if ( typeof finalReducers[ key ] === "undefined" ) {
      throw new TypeError( `No reducer provided for key "${ key }"` )
    }
    if ( typeof finalReducers[ key ] === "function" ) {
      finalReducers[ key ] = reducers[ key ]
    }
  }
  return function ( state = {}, action ) {
    const nextState = {}
    let hasChanged = false;
    for ( let key of reducerKeys ) {
      const prevState = state[ key ];
      const nextStateForKey = finalReducers[ key ]( prevState, action )
      if ( nextStateForKey === undefined ) {
        throw new TypeError( "The reducer return value cannot be undefined " )
      }
      nextState[ key ] = nextStateForKey
      // 当 action 不是初始化数据且值已被改变, 就认为可以结束
      if ( action.type !== "@@INIT_DATA" && prevState !== nextStateForKey ) {
        hasChanged = true
        break
      }
    }
    return hasChanged ? nextState : state
  }
}

/**
 * @name Middleware
 * @function
 * @param getState
 * @param dispatch
 */
/**
 *
 * @param {function} middlewares
 */
export function applyMiddleware( ...middlewares ) {
  return createStore => ( reducer, preloadedState ) => {
    const store = createStore( reducer, preloadedState )
    let dispatch = () => undefined
    const middlewareParam = {
      getState: store.getState,
      dispatch: ( action, ...args ) => dispatch( action, ...args )
    }
    const chains = middlewares.map( middleware => middleware( middlewareParam ) );
    dispatch = compose( ...chains )( store.dispatch )
    return {
      ...store,
      dispatch
    }
  }
}

/**
 * @param {function()}fns
 * @return {*|(function(...[*]): *)}
 */
export function compose( ...fns ) {
  if ( fns.some( fn => typeof fn !== "function" ) ) {
    throw new Error( 'invalid params' );
  }
  if ( fns.length === 1 ) {
    return fns[ 0 ]
  }
  return fns.reduce( ( a, b ) => ( ...args ) => a( b( ...args ) ) )
}

/**
 * @param getState
 * @param dispatch
 */
export function loggerMiddleware( { getState, dispatch } ) {
  return next => action => {
    console.log( 'will dispatch', action )
    const returnValue = next( action )
    console.log( 'state after dispatch', getState() )
    return returnValue
  }
}

/**
 * @param {{getState:function(), dispatch:function(action)}} params
 * @return {function(*): function(...[*]=)}
 */
export function thunkMiddleware( params ) {
  return next => action => {
    if ( typeof action === "function" ) {
      return next( params )
    }
    return next( action )
  }
}

function bindActionCreator( actionCreator, dispatch ) {
  if ( typeof actionCreator !== 'function' || typeof dispatch !== 'function' ) {
    throw new Error( 'invalid params' );
  }
  return function ( ...args ) {
    return dispatch( actionCreator.apply( this, args ) )
  }
}

export function binActionCreators( actionCreators, dispatch ) {
  if ( typeof actionCreators === 'function' ) {
    return bindActionCreator( actionCreators, dispatch );
  }
  if ( typeof actionCreators !== "object" || actionCreators === null || typeof dispatch !== "function" ) {
    throw new TypeError( 'invalid params' );
  }
  const boundActionCreators = {};
  Object.keys( actionCreators ).forEach( key => {
    if ( actionCreators.hasOwnProperty( key ) ) {
      boundActionCreators[ key ] = bindActionCreator( actionCreators[ key ], dispatch );
    }
  } );
  return boundActionCreators;
}
