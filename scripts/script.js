(() => {
  "use strict";

  const screen = document.getElementById("screen");
  const pct = document.getElementById("pct");
  const lines = [...document.querySelectorAll(".line")];
  let timers = [];
  let raf = 0;

  const at = (ms, fn) => timers.push(setTimeout(fn, ms));
  const add = (cls) => () => screen.classList.add(cls);
  const easeInOutCubic = (p) =>
    p < 0.5 ? 4 * p ** 3 : 1 - (-2 * p + 2) ** 3 / 2;

  function countTo100(duration) {
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      pct.textContent = Math.round(easeInOutCubic(p) * 100) + "%";
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  }

  function play() {
    timers.forEach(clearTimeout);
    timers = [];
    cancelAnimationFrame(raf);

    screen.className = "screen";
    lines.forEach((l) => l.classList.remove("show", "ok"));
    pct.textContent = "0%";
    void screen.offsetWidth; // restart CSS animations

    at(200, add("on"));
    at(900, add("booting"));

    lines.forEach((line, i) => {
      const t = 1100 + i * 520; // 1.1s -> 4.2s
      at(t, () => line.classList.add("show"));
      at(t + 220, () => line.classList.add("ok"));
    });

    at(5000, () => {
      screen.classList.add("loading");
      countTo100(1200);
    });
    at(6300, add("done-boot"));
    at(6400, add("reveal"));
    at(7900, add("online"));
    at(10000, () => console.log("REBOOT complete: system online."));
  }

  document.addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() === "r") play();
  });
  screen.addEventListener("click", play);

  (document.fonts ? document.fonts.ready : Promise.resolve()).then(play);
})();
