import { callHooks } from "./hook";
import { Watcher } from "./watcher";
import { initMethod, initData } from "./Reactive";

export function App( options ) {
  if ( new.target !== App ) {
    throw new TypeError( "need new call" )
  }
  if ( typeof options !== "object" || options === null ) {
    throw new TypeError( "need options is a object" )
  }
  this._options = options;
  this._init( options )
}

App.prototype._update = function ( html ) {
  document.getElementById( "root" ).innerHTML = html
}
App.prototype._render = function () {
  return this._options.render.call(this)
}

App.prototype._mount = function () {
  const vm = this;
  callHooks( vm, "beforeMount" )
  vm._watcher = new Watcher( vm, function ( vm ) {
    vm._update( vm._render() )
  } )
  vm._warchers = []
  callHooks( vm, "mounted" )
}
App.prototype._init = function ( options ) {
  callHooks( this, "beforeCreate" )
  initData( this, options )
  initMethod( this, options )
  callHooks( this, "created" )
  this._mount()
}


