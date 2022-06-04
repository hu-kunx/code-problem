// 发布订阅
class EventHub {
  eventList = new Map()

  emit( name, value ) {
    if ( !this.eventList.has( name ) ) {
      return
    }
    this.eventList.get( name ).forEach( v => v( value ) )
  }

  on( name, callback ) {
    let callbackList = [];
    if ( this.eventList.has( name ) ) {
      callbackList = this.eventList.get( name )
    }
    callbackList.push( callback )
    this.eventList.set( name, callbackList )
  }

  off( name, callback ) {
    if ( !this.eventList.has( name ) ) {
      return
    }
    const list = this.eventList.get( name )
    const nextValue = list.filter( v => v !== callback )
    if ( nextValue.length === 0 ) {
      this.eventList.delete( name )
    } else {
      this.eventList.set( name, nextValue )
    }
  }

  once( name, callback ) {
    const callbackWrap = ( value ) => {
      callback( value )
      this.remove( name, callbackWrap )
    }
    this.on( name, callbackWrap )
  }
}


// 观察者
class Observer {
  update() {
  }
}

class Subject {
  observerList = []

  subscribe( observe ) {
    if ( !observe instanceof Observer ) {
      throw new TypeError( "Need to be a Subject object!" )
    }
    if ( this.observerList.includes( observe ) ) {
      this.observerList.push( observe )
    }
    return () => this.unSubscribe( observe )
  }

  unSubscribe( observe ) {
    const index = this.observerList.indexOf( observe )
    if ( index !== -1 ) {
      this.observerList.splice( index, 1 )
    }
  }

  notify() {
    const list = this.observerList.slice()
    list.forEach( observe => observe.update() )
  }
}


function testObserve() {
  const subject = new Subject()
  const observe = new Observer()
  subject.subscribe( observe )
  subject.notify()
}

function testEvent() {
  const event = new EventHub()
  event.on( "create", function ( value ) {
    console.log( "create: %s", value )
  } )
  event.once( "update", function ( value ) {
    console.log( "update: %s", value )
  } )
  event.on( "create", function ( value ) {
    console.log( "create2: %s", value )
  } )
  event.once( "update", function ( value ) {
    console.log( "update2: %s", value )
  } )
  event.on( "update", function ( value ) {
    console.log( "update3: %s", value )
  } )


  event.emit( "create", "1" )
  event.emit( "update", "2" )
  event.emit( "create", "3" )
  event.emit( "update", "4" )
  event.emit( "update", "4" )
  event.emit( "update", "4" )
  event.emit( "update", "4" )
  event.emit( "create", "4" )
}





