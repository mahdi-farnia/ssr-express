import '../styles/global.css';
import '../styles/login.css';
import { on } from './utils/event.js';

// Live Background ======================
const bgColor = { light: 0x0a965e, dark: 0x005f39 },
  mq = window.matchMedia('(prefers-color-scheme: dark)'),
  __getBgColor = () => (mq.matches ? bgColor.dark : bgColor.light);

const live = VANTA.WAVES({
  el: '#root',
  mouseControls: true,
  touchControls: true,
  gyroControls: false,
  minHeight: 200.0,
  minWidth: 200.0,
  scale: 1.0,
  scaleMobile: 1.0,
  color: __getBgColor(),
  shininess: 41.0,
  waveHeight: 10.0,
  waveSpeed: 0.5,
  zoom: 0.97
});

mq.addEventListener('change', () => {
  live.options.color = __getBgColor();
  live.restart();
});

// Show Password =======================
const input = document.getElementById('password');
on(
  document.getElementById('show-password'),
  'click',
  () => (input.type = input.type === 'password' ? 'text' : 'password')
);
