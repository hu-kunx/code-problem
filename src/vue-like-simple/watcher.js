import {callHooks} from "./hook";
import {pushTarget, popTarget} from "./dep";

const updateQueue = [];

function nextTick( callback ) {
  Promise.resolve().then( callback )
}

function queueWatcher( watcher ) {
  updateQueue.push( watcher )
  nextTick( flushSchedulerQueue )
}

function flushSchedulerQueue() {
  const queue = updateQueue.slice()
  updateQueue.length = 0
  queue.forEach( watcher => {
    callHooks( watcher.vm, "beforeUpdate" )
    watcher.run()
    callHooks( watcher.vm, "updated" )
  } )
}


export class Watcher {
  constructor( vm, getter ) {
    this.vm = vm
    this.getter = getter
    this.value = this.get()
  }

  get() {
    pushTarget( this )
    const value = this.getter.call( this.vm, this.vm )
    popTarget()
    return value
  }


  update() {
    queueWatcher( this )
  }

  run() {
    const value = this.get()
    const oldValue = this.value
    if ( value !== oldValue ) {
      this.value = value;
    }
  }
}

