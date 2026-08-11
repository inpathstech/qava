/**
 * Multi-direction Club nav logo flip.
 * Cycles through up / down / left / right in a reshuffled order.
 */
(function (w, d) {
  var FLIP_CLASSES = ["is-flip-up", "is-flip-down", "is-flip-left", "is-flip-right"];
  var AXIS_CLASSES = ["is-axis-x", "is-axis-y"];
  var DIR_FLIP = {
    up: "is-flip-up",
    down: "is-flip-down",
    left: "is-flip-left",
    right: "is-flip-right",
  };
  var DIR_AXIS = {
    up: "is-axis-x",
    down: "is-axis-x",
    left: "is-axis-y",
    right: "is-axis-y",
  };
  var DIRS = ["up", "down", "left", "right"];

  function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;
    }
    return arr;
  }

  function clearFlipClasses(inner) {
    for (var i = 0; i < FLIP_CLASSES.length; i++) {
      inner.classList.remove(FLIP_CLASSES[i]);
    }
    inner.classList.remove("is-flipped");
  }

  function setAxis(back, axisClass) {
    for (var i = 0; i < AXIS_CLASSES.length; i++) {
      back.classList.remove(AXIS_CLASSES[i]);
    }
    back.classList.add(axisClass);
  }

  function startNavLogoFlip(inner) {
    if (!inner || inner.getAttribute("data-qava-flip-bound") === "1") return null;
    var back = inner.querySelector(".qava-nav-logo-back");
    if (!back) return null;

    inner.setAttribute("data-qava-flip-bound", "1");
    setAxis(back, "is-axis-x");

    var queue = [];
    var busy = false;

    function nextDir() {
      if (!queue.length) queue = shuffle(DIRS.slice());
      return queue.shift();
    }

    function flip() {
      if (busy || !inner.isConnected) return;
      busy = true;
      var dir = nextDir();
      var flipClass = DIR_FLIP[dir];
      var axisClass = DIR_AXIS[dir];

      clearFlipClasses(inner);
      setAxis(back, axisClass);

      w.requestAnimationFrame(function () {
        w.requestAnimationFrame(function () {
          inner.classList.add(flipClass);
        });
      });

      function onEnd(e) {
        if (e.target !== inner || e.propertyName !== "transform") return;
        inner.removeEventListener("transitionend", onEnd);
        var prev = inner.style.transition;
        inner.style.transition = "none";
        clearFlipClasses(inner);
        setAxis(back, "is-axis-x");
        void inner.offsetWidth;
        inner.style.transition = prev;
        busy = false;
      }
      inner.addEventListener("transitionend", onEnd);
    }

    var timer = w.setInterval(flip, 5000);
    return timer;
  }

  function boot() {
    var nodes = d.querySelectorAll(".qava-nav-logo-inner");
    for (var i = 0; i < nodes.length; i++) {
      startNavLogoFlip(nodes[i]);
    }
  }

  w.qavaStartNavLogoFlip = startNavLogoFlip;

  if (d.readyState === "loading") {
    d.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})(window, document);
