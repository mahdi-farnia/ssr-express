import '../styles/global.css';
import '../styles/register.css';
import { on } from './utils/event.js';
import Slider from './components/RegisterSlider.js';

new Slider([
  {
    img: 'https://i.picsum.photos/id/257/1080/720.jpg?hmac=91D3NF9ILBKu_Dvhv2D55gxRE8s7Y3ZbLgW1jDo8ShY',
    text: 'Lorem ipsum 1'
  },
  {
    img: 'https://i.picsum.photos/id/994/1080/720.jpg?hmac=AyHMdcb69esKlsR0MUfmVkHSxUv-iaS4QAalo-N0pjc',
    text: 'Lorem ipsum 2'
  },
  {
    img: 'https://i.picsum.photos/id/566/1080/720.jpg?hmac=mD3n7A7kq55-lfJIO8FI8tiJasAZA_rXjIORZkB7-nQ',
    text: 'Lorem ipsum 3'
  },
  {
    img: 'https://i.picsum.photos/id/844/1080/720.jpg?hmac=xhyA0hxJNGBFqUoaViHEGE7eHgHlKuEouCWqXmfv-n8',
    text: 'Lorem ipsum 4'
  },
  {
    img: 'https://i.picsum.photos/id/102/1080/720.jpg?hmac=3gzjupyidUczjx3bjGXADKmYmwtu1L8k5fmJVKvAdv4',
    text: 'Lorem ipsum 5'
  }
]);

// Age form control ===================
const ageInput = document.getElementById('age');
on(ageInput, 'keydown', (e) => {
  if (!isNaN(e.key)) {
    // max length 2
    if (ageInput.value.length === 2) return e.preventDefault();
    return;
  }

  switch (e.key.toLowerCase()) {
    case 'backspace':
    case 'arrowup':
    case 'arrowdown':
    case 'arrowleft':
    case 'arrowright':
    case 'tab':
      return;

    default:
      return e.preventDefault();
  }
});
on(ageInput, 'blur', () => {
  let val;
  if ((val = ageInput.value)) ageInput.value = parseInt(ageInput.value);
});

// Show Password =====================
for (const btn of document.querySelectorAll('[data-id=showPassword]')) attachClick(btn);

function attachClick(btn) {
  const { nextElementSibling: input } = btn;
  on(btn, 'click', () => {
    input.type = input.type === 'password' ? 'text' : 'password';
  });
}
