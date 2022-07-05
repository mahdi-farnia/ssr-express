import { setChildren } from '../utils/dom.js';
import { once } from '../utils/event.js';
import MQLifeCycle from './MQLifeCycle.js';

/**
 * @typedef ISlideInfo
 * @property {string} img
 * @property {string} text
 */

class Slider extends MQLifeCycle {
  /** @param {ISlideInfo[]} infos */
  constructor(infos) {
    super('(min-width: 1024px)', infos);
  }

  /** @override @param {ISlideInfo[]} infos */
  init(infos) {
    super.init();

    const slidesContainer = document.getElementById('slides'),
      [pre, main, post] = [...slidesContainer.querySelectorAll('li')].slice(-3),
      descContainer = document.getElementById('slide-description'),
      [first, last] = descContainer.querySelectorAll('span');

    this.slides = [];
    this.pos = 3;
    this.elements = {
      slides: { container: slidesContainer, pre, main, post },
      description: { container: descContainer, first, last },
      dots: []
    };

    infos.forEach((info, i) => {
      this.slides.push(Slider.createSlide(info));
      this.elements.dots.push(Slider.createDot(i));
    });

    this.initSlider();
    this.initDots();
    this.registerListeners();
  }

  /** @private */
  initSlider() {
    const { elements } = this,
      slide = this.slides[this.pos];
    // place first image to DOM
    setChildren(elements.slides.main, [slide]);
    elements.description.first.textContent = slide.alt;
  }

  /** @private */
  initDots() {
    const dotsParent = document.getElementById('slide-dots');

    this.elements.dots[this.pos].classList.add('on');
    setChildren(dotsParent, this.elements.dots);

    this.onEvent(dotsParent, 'click', ({ target }) => {
      if (target.dataset.id == null) return;

      const dotPos = parseInt(target.dataset.id);

      this.moveSlide(dotPos - this.pos);
    });
  }

  /** @private */
  registerListeners() {
    this.onEvent(document.getElementById('slide-next'), () => this.moveSlide(1));
    this.onEvent(document.getElementById('slide-prev'), () => this.moveSlide(-1));
  }

  moveSlide(delta) {
    if (delta === 0) return;

    const lastPos = this.pos;
    this.elements.dots[lastPos].classList.remove('on');
    this.elements.dots[this.modifyPosition(delta)].classList.add('on');

    this.animate(lastPos, delta > 0);
  }

  /** @private */
  async animate(lastPos, isForwardAnimation) {
    const { container, post, pre, main } = this.elements.slides,
      prevSlide = this.slides[lastPos],
      nextSlide = this.slides[this.pos];
    let clsName = '';

    if (isForwardAnimation) {
      setChildren(post, [prevSlide]);
      setChildren(pre, [nextSlide]);
      clsName = 'move-forward';
    } else {
      setChildren(post, [nextSlide]);
      setChildren(pre, [prevSlide]);
      clsName = 'move-backward';
    }

    container.classList.add(clsName);
    this.changeDescription(nextSlide.alt);
    await once(post, 'animationend'); // NOTE all animations have same duration
    setChildren(main, [nextSlide]);
    container.classList.remove(clsName);

    pre.innerHTML = post.innerHTML = '';
  }

  /** @private */
  changeDescription(next) {
    const { container, first, last } = this.elements.description;

    if (container.classList.contains('first-to-last')) {
      container.classList.replace('first-to-last', 'last-to-first');
      first.textContent = next;
    } else {
      container.classList.replace('last-to-first', 'first-to-last');
      last.textContent = next;
    }
  }

  /** @private */
  modifyPosition(delta) {
    const max = this.slides.length;
    let result = this.pos + delta;

    if (delta === 0 || Math.abs(delta) >= max) {
      if (process.env.NODE_ENV === 'development')
        console.error('[RegisterSlider.js]modifyPosition: delta is not valid!');
      return this.pos;
    }

    while (result < 0) result += max;
    while (result >= max) result -= max;

    return (this.pos = result);
  }

  /** @override */
  deInit() {
    super.deInit();
    this.slides = this.pos = this.elements = null;
  }

  static createSlide(info) {
    const { img: src, text: alt } = info,
      img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    img.className = 'slide-img';

    return img;
  }

  static createDot(id) {
    const dot = document.createElement('span');
    dot.className = 'dot';
    dot.dataset.id = id;
    dot.setAttribute('role', 'button');
    return dot;
  }
}

export default Slider;
