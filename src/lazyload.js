function setup() {
  function getOffsetTop(element) {
    let top = 0;
    let node = element;
    while (node) {
      top += node.offsetTop;
      node = node.offsetParent;
    }
    return top;
  }

  function throttle(callback, threshhold) {
    let timeout = null;
    // 保证第一次就会被调用
    let lastTime = 0;
    return function (...args) {
      let curr = new Date().getTime();
      const context = this;
      if (timeout !== null) clearTimeout(timeout);
      if (curr - lastTime >= threshhold) {
        callback.apply(context, args);
        lastTime = curr;
      } else {
        timeout = setTimeout(() => {
          callback.apply(context, args);
        }, threshhold);
      }
    };
  }

  function onLazyLoadImage() {
    const clientHeight = document.documentElement.clientHeight;
    // 图片会被 js 插入需要重新查找
    const images = document.querySelectorAll("img[data-src]");
    const scrollTop =
      document.documentElement.scrollTop || document.body.scrollTop;
    images.forEach((element, index) => {
      if (element.dataset.load !== "True") {
        const elementOffsetTop = getOffsetTop(element) - scrollTop;
        const height = element.clientHeight;
        // top 是否在视口
        if (elementOffsetTop > 0 && elementOffsetTop < clientHeight) {
          element.src = element.dataset.src;
          element.dataset.load = "True";
        }
        // body 是否出现在视口
        if (
          elementOffsetTop + height > 0 &&
          elementOffsetTop + 200 < clientHeight
        ) {
          element.src = element.dataset.src;
          element.dataset.load = "True";
        }
      }
    });
  }

  window.onscroll = throttle(onLazyLoadImage, 300);
  window.onresize = throttle(onLazyLoadImage, 300);
  onLazyLoadImage();
}

function setupLazyLoadImage() {
  const images = document.querySelectorAll("img[data-src]");
  const options = {};
  const io = new IntersectionObserver(function (entries, observe) {
    entries.forEach((change) => {
      const target = change.target;
      target.src = target.dataset.src;
      target.dataset.load = "True";
      observe.unobserve(target);
    });
  }, options);
  images.forEach((element) => {
    io.observe(element);
  });
}
