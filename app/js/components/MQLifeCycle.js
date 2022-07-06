import { on } from '../utils/event.js';

/**
 * @typedef {{ [key: string]: VoidFunction[] }} MQEventCache
 */

/** Media Query Life Cycle */
class MQLifeCycle {
  /** @private @type {MQEventCache}*/
  evCache = {};

  constructor(query, ...args) {
    const mq = window.matchMedia(query);

    this.__mqHandler(mq.matches, args);
    mq.addEventListener('change', () => this.__mqHandler(mq.matches, args));
  }

  /** @private */
  __mqHandler = (matches, args) => (matches ? this.init(...args) : this.deInit());

  /** @virtual @protected */
  init() {}
  /** @virtual @protected */
  deInit() {
    for (const ev in this.evCache) {
      for (const off of this.evCache[ev]) off();
      delete this.evCache[ev];
    }
  }

  /** @protected */
  onEvent(el, type, handler) {
    const cache = this.evCache[type] || (this.evCache[type] = []);
    cache.push(on(el, type, handler));
  }
}

export default MQLifeCycle;
