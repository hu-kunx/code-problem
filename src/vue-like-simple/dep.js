export class Dep {
  static target = null;
  subs = new Set()

  depend() {
    if ( Dep.target ) {
      this.addSub( Dep.target )
    }
  }

  addSub( dep ) {
    this.subs.add( dep )
  }

  notify() {
    for ( let watcher of this.subs.values() ) {
      watcher.update()
    }
  }
}

const targetStack = []

export function pushTarget( _target ) {
  if ( Dep.target ) targetStack.push( Dep.target )
  Dep.target = _target
  console.log("targetStack length %d",targetStack.length)
}

export function popTarget() {
  Dep.target = targetStack.pop()
}


