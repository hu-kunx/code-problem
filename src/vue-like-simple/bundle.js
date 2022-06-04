'use strict';

function callHooks( vm, hookName ) {
  if ( vm._options[ hookName ] && typeof vm._options[hookName] === "function") {
    vm._options[ hookName ].call( vm );
  }
}

class Dep {
  static target = null;
  subs = new Set()

  depend() {
    if ( Dep.target ) {
      this.addSub( Dep.target );
    }
  }

  addSub( dep ) {
    this.subs.add( dep );
  }

  notify() {
    for ( let watcher of this.subs.values() ) {
      watcher.update();
    }
  }
}

const targetStack = [];

function pushTarget( _target ) {
  if ( Dep.target ) targetStack.push( Dep.target );
  Dep.target = _target;
  console.log("targetStack length %d",targetStack.length);
}

function popTarget() {
  Dep.target = targetStack.pop();
}

const updateQueue = [];

function nextTick( callback ) {
  Promise.resolve().then( callback );
}

function queueWatcher( watcher ) {
  updateQueue.push( watcher );
  nextTick( flushSchedulerQueue );
}

function flushSchedulerQueue() {
  const queue = updateQueue.slice();
  updateQueue.length = 0;
  queue.forEach( watcher => {
    callHooks( watcher.vm, "beforeUpdate" );
    watcher.run();
    callHooks( watcher.vm, "updated" );
  } );
}


class Watcher {
  constructor( vm, getter ) {
    this.vm = vm;
    this.getter = getter;
    this.value = this.get();
  }

  get() {
    pushTarget( this );
    const value = this.getter.call( this.vm, this.vm );
    popTarget();
    return value
  }


  update() {
    queueWatcher( this );
  }

  run() {
    const value = this.get();
    const oldValue = this.value;
    if ( value !== oldValue ) {
      this.value = value;
    }
  }
}

class Observer {
  constructor( value ) {
    this.value = value;
    this.dep = new Dep();
    def( value, "__ob__", this );
    console.log( "add observe", value );
    this.walk( value );
  }

  walk( target ) {
    for ( let key of Object.keys( target ) ) {
      defineReactive( target, key, target[ key ] );
    }
  }
}

function defineReactive( target, key, value ) {
  const dep = new Dep();
  const property = Object.getOwnPropertyDescriptor( target, key );
  if ( property && property.configurable === false ) {
    return
  }
  const getter = property && property.get;
  const setter = property && property.set;
  const childObserve = value && observe( value );
  Object.defineProperty( target, key, {
    configurable: true,
    enumerable: true,
    get() {
      if ( Dep.target ) {
        dep.depend();
        if ( childObserve ) {
          childObserve.dep.depend();
        }
      }
      return getter ? getter.call( target ) : value
    },
    set( newValue ) {
      const val = getter ? getter.call( target ) : value;
      if ( val === newValue || (newValue !== newValue && val !== val) ) {
        return
      }
      if ( setter ) {
        setter.call( target, newValue );
      } else {
        value = newValue;
      }
      observe( newValue );
      dep.notify();
    },
  } );
}

function observe( value ) {
  if ( typeof value !== "object" ) return
  let ob;
  if ( value.__ob__ && value.__ob__ instanceof Observer ) {
    ob = value.__ob__;
  } else {
    ob = new Observer( value );
  }
  return ob
}

function def( o, k, v ) {
  Object.defineProperty( o, k, {
    enumerable: false,
    configurable: true,
    value: v
  } );
}

function getData( data, vm ) {
  pushTarget();
  let result = data.call( vm, vm );
  popTarget();
  return result
}

function proxy( target, sourceKey, key ) {
  Object.defineProperty( target, key, {
    enumerable: true,
    configurable: true,
    get() {
      return this[ sourceKey ][ key ]
    },
    set( v ) {
      this[ sourceKey ][ key ] = v;
    }
  } );
}

function initData( vm, options ) {
  let data = getData( options.data );
  vm._data = data;
  for ( let key of Object.keys( data ) ) {
    proxy( vm, "_data", key );
  }
  defineReactive( vm, "data", {
    enumerable: true,
    configurable: true,
    get() {
      return vm._data
    }
  } );
  observe( data );
}

function initMethod( vm, options ) {
  for ( let key of Object.keys( options.method ) ) {
    vm[ key ] = options.method[ key ];
  }
}

function App( options ) {
  if ( new.target !== App ) {
    throw new TypeError( "need new call" )
  }
  if ( typeof options !== "object" || options === null ) {
    throw new TypeError( "need options is a object" )
  }
  this._options = options;
  this._init( options );
}

App.prototype._update = function ( html ) {
  document.getElementById( "root" ).innerHTML = html;
};
App.prototype._render = function () {
  return this._options.render.call(this)
};

App.prototype._mount = function () {
  const vm = this;
  callHooks( vm, "beforeMount" );
  vm._watcher = new Watcher( vm, function ( vm ) {
    vm._update( vm._render() );
  } );
  vm._warchers = [];
  callHooks( vm, "mounted" );
};
App.prototype._init = function ( options ) {
  callHooks( this, "beforeCreate" );
  initData( this, options );
  initMethod( this, options );
  callHooks( this, "created" );
  this._mount();
};

const vm = new App( {
  render() {
    const { title, userInfo, num } = this;
    return `
    <div>
      <h2>title: ${ title } times ${ num }</h2>
      <p>userName: ${ userInfo.name }</p>
      <p>phone: ${ userInfo.phone }</p>
      <p>age: ${ userInfo.age }</p>
      <button id="add-times">add</button>
      <button id="reduce-times">reduce</button>
      <button id="add-age">add age</button>
    </div> 
    `;
  },
  data: () => ({
    title: 'test',
    num: 0,
    userInfo: {
      name: "Hu Kun",
      age: 10,
      phone: '17665233936'
    }
  }),
  beforeCreate() {
    console.log( "beforeCreate" );
  },
  created() {
    console.log( "created" );
  },
  beforeMount() {
    console.log( "beforeMount" );
  },
  mounted() {
    this.mountTestEvent();
    console.log( "mounted" );
  },
  beforeUpdate() {
    console.log( "beforeUpdate" );
  },
  updated() {
    this.mountTestEvent();
    console.log( "updated" );
  },
  beforeDestroy() {
    console.log( "beforeDestroy" );
  },
  method: {
    mountTestEvent() {
      const that = this;
      document.getElementById( "add-times" ).onclick = function () {
        console.log("call add times");
        that.addTimes();
      };
      document.getElementById( "reduce-times" ).onclick = function () {
        that.reduceTimes();
      };
      document.getElementById( "add-age" ).onclick = function () {
        that.addAge();
      };
    },
    addTimes() {
      this.num += 1;
    },
    addAge() {
      this.userInfo.age++;
    },
    reduceTimes() {
      this.num -= 1;
    }
  }
} );
