import '../styles/global.css';
import '../styles/register.css';

const on = (el, ev, handler) => el.addEventListener(ev, handler);

// Age form control
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
  ageInput.value = parseInt(ageInput.value);
});

// Show Password =====================
for (const btn of document.querySelectorAll('[data-id=showPassword]')) attachClick(btn);

function attachClick(btn) {
  const { nextElementSibling: input } = btn;
  on(btn, 'click', () => {
    input.type = input.type === 'password' ? 'text' : 'password';
  });
}
