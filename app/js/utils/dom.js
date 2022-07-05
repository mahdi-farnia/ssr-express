/**
 * @param {Element} el
 * @param {Element[]} children
 */
export function setChildren(el, children) {
  el.innerHTML = '';
  el.append(...children);
}
