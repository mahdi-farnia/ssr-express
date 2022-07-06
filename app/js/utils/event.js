export function on(el, ev, handler) {
  el.addEventListener(ev, handler);
  return () => el.removeEventListener(ev, handler);
}

export function once(el, event) {
  return new Promise((res) => el.addEventListener(event, res, { once: true }));
}
