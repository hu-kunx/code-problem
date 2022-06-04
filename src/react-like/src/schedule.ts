interface Task {
  callback: any
  dueTime: number
}

let taskQueue: Task[] = [];
let frameDeadline: number = 0;
const frameLength: number = 5;
let currentCallback: (( n: number ) => boolean) | null = null
const getTime = () => performance.now();

export function scheduleCallback ( callback: Function ): void {
  const startTime = getTime()
  const timeout = 3000;
  const dueTime = startTime + timeout
  taskQueue.push( { callback, dueTime } )
  currentCallback = flush
  planWork( null )
}

function flush ( iniTime: number ) {
  let currentTime = iniTime;
  let currentTask = peek( taskQueue );

  while ( currentTask ) {
    const timeout = currentTask.dueTime <= currentTime;
    if ( !timeout && getTime() >= frameDeadline ) break;

    let callback = currentTask.callback;
    currentTask.callback = null;

    let next = typeof (callback) === "function" && callback( timeout );
    next ? (currentTask.callback = next) : taskQueue.shift();

    currentTask = peek( taskQueue );
    currentTime = getTime();
  }

  return !!currentTask;
}

function peek ( queue: Task[] ) {
  queue.sort( ( a, b ) => a.dueTime - b.dueTime );
  return taskQueue[ 0 ]
}

function flushWork () {
  if ( typeof currentCallback === "function" ) {
    let currentTime = getTime();
    frameDeadline = currentTime + frameLength;
    currentCallback( currentTime ) ? planWork( null ) : (currentCallback = null)
  }
}

function planWork ( callback: Function | null ) {
  return () => setTimeout( callback || flushWork )
}
