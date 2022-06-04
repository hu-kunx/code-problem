function Node(value) {
  this.value = value;
}

function MaxHeap() {
  this.heap = [];
}

MaxHeap.prototype.add = function (value) {
  this.heap.push(value);
  up(this.heap);
};

function arraySwap(list, i, j) {
  let t = list[i];
  list[i] = list[j];
  list[j] = t;
}

function up(heap) {
  let i = heap.length;
  while (i >= 0) {
    const parent = Math.floor(i / 2);
    if (heap[i] > heap[parent]) {
      arraySwap(heap, i, parent);
    } else {
      break;
    }
  }
}
function del() {}

const PENDING = "PENDING";
const FULFILLED = "FULFILLED";
const REJECTED = "REJECTED";

function Promise(exec) {
  if (!(this instanceof Promise)) {
    throw new TypeError("need new call!");
  }
  this.status = PENDING;
  this.value = void 0;
  this.reason = void 0;
  this.valueCallbackList = [];
  this.reasonCallbackList = [];
  const that = this;

  function resolve(value) {
    if (that.status === PENDING) {
      that.value = value;
      that.valueCallbackList.forEach((v) => v());
    }
  }

  function reject(reason) {
    if (that.status === PENDING) {
      that.reason = reason;
      that.reasonCallbackList.forEach((v) => v());
    }
  }

  try {
    exec(resolve, reject);
  } catch (e) {
    reject(e);
  }
}

const nextTick = setTimeout;

function resolvePromise(x, promise, resolve, reject) {
  if (x === promise) {
    throw new TypeError("");
  }
  if (x !== null && (typeof x === "object" || typeof x === "function")) {
    let isCall = false;
    try {
      const then = x.then;
      if (typeof then === "function") {
        then.call(
          x,
          (v) => {
            if (isCall) return;
            isCall = true;
            resolvePromise(v, promise, resolve, reject);
          },
          (err) => {
            if (isCall) return;
            isCall = true;
            reject(err);
          }
        );
      } else {
        resolve(x);
      }
    } catch (err) {
      if (isCall) return;
      isCall = true;
      reject(err);
    }
  } else {
    resolve(x);
  }
}

Promise.prototype.then = function (onFulFilled, onRejected) {
  onFulFilled =
    onFulFilled ||
    function (value) {
      return value;
    };
  onRejected =
    onRejected ||
    function (reason) {
      throw reason;
    };
  const promise = new Promise((resolve, reject) => {
    if (this.status === PENDING) {
      this.valueCallbackList.push(() => {
        try {
          const value = onFulFilled(this.value);
          resolvePromise(value, promise, resolve, reject);
        } catch (e) {
          reject(e);
        }
      });
      this.reasonCallbackList.push(() => {
        try {
          const value = onRejected(this.reason);
          resolvePromise(value, promise, resolve, reject);
        } catch (e) {
          reject(e);
        }
      });
    }

    if (this.status === FULFILLED) {
      try {
        const value = onFulFilled(this.value);
        resolvePromise(value, promise, resolve, reject);
      } catch (e) {
        reject(e);
      }
    }
    if (this.status === REJECTED) {
      try {
        const value = onRejected(this.reason);
        resolvePromise(value, promise, resolve, reject);
      } catch (e) {
        reject(e);
      }
    }
  });
  return promise;
};
