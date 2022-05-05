const EN = ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='];

class Keyboard {
  constructor() {
    this.shiftPressed = false;
    this.capsLockPressed = false;
    if (localStorage.getItem('keyboard_lang')) {
      this.lang = localStorage.getItem('keyboard_lang');
    } else {
      this.lang = 'en';
    }
  }

  generateKeyboard = () => {
    const BODY = document.querySelector('body');
    this.container = document.createElement('div');
    this.container.classList.add('container');
    BODY.appendChild(this.container);
    this.input = document.createElement('textarea');
    this.container.appendChild(this.input);
    this.keyboard = document.createElement('div');
    this.keyboard.classList.add('keyboard');
    this.container.appendChild(this.keyboard);
    this.main = document.createElement('div');
    this.main.classList.add('main');
    this.keyboard.appendChild(this.main);
    for (let i = 0; i < EN.length; i += 1) {
      this.newKey = document.createElement('div');
      this.newKey.classList.add('key');
      this.main.appendChild(this.newKey);
      this.keyCap = document.createElement('div');
      this.keyCap.textContent = EN[i];
      this.keyCap.classList.add('keycap');
      this.newKey.appendChild(this.keyCap);
    }
  };
}

window.onload = () => {
  const keyboard = new Keyboard();
  keyboard.generateKeyboard();
};
