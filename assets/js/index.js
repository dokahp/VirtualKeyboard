import { keyCode } from './buttonsData.js';
import { EN, RU } from './languages.js';

class Keyboard {
  constructor() {
    this.shiftPressed = false;
    this.capsLockPressed = false;
    this.metaKeyPress = false;
    this.pressedKeys = [];
    if (localStorage.getItem('keyboard_lang')) {
      this.lang = localStorage.getItem('keyboard_lang');
    } else {
      localStorage.setItem('keyboard_lang', 'en');
      this.lang = localStorage.getItem('keyboard_lang');
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
    if (this.lang === 'en') {
      this.currLang = EN;
    } else {
      this.currLang = RU;
    }
    for (let i = 0; i < this.currLang.length; i += 1) {
      this.newKey = document.createElement('div');
      if (Array.isArray(this.currLang[i]) && this.currLang[i].length === 1) {
        this.newKey.classList.add('f_key');
      } else {
        this.newKey.classList.add('key');
      }
      this.newKey.setAttribute('id', `${keyCode[i]}`);
      this.main.appendChild(this.newKey);
      this.keyCap = document.createElement('div');
      if (Array.isArray(this.currLang[i])) {
        if (this.currLang[i].length > 1) {
          this.keyCap.innerHTML = `${this.currLang[i][0]} <br />  ${this.currLang[i][1]}`;
        } else {
          this.keyCap.textContent = [...this.currLang[i]];
        }
      } else {
        this.keyCap.textContent = this.currLang[i].toLowerCase();
      }
      this.keyCap.classList.add('keycap');
      this.newKey.appendChild(this.keyCap);
    }
    this.description = document.createElement('p');
    this.description.innerHTML = 'Клавиатура создана в операционной системе MacOS <br />Для переключения языка: левыe ctrl(control) + alt(option) или клик по клавише Fn';
    this.container.appendChild(this.description);
  };

  generateEvents = () => {
    this.mainKeyboard = document.querySelector('.main');
    this.mainKeyboard.addEventListener('mousedown', (e) => this.onMouseDown(e));
    this.mainKeyboard.addEventListener('mouseup', (e) => this.onMouseUp(e));
    document.addEventListener('keydown', (e) => this.onKeyDown(e));
    document.addEventListener('keyup', (e) => this.onKeyUp(e));
  };

  changeKeyboardLayout = () => {
    const allKeyCaps = document.querySelectorAll('.keycap');
    for (let i = 0; i < allKeyCaps.length; i += 1) {
      if (Array.isArray(this.currLang[i])) {
        if (this.currLang[i].length > 1) {
          allKeyCaps[
            i
          ].innerHTML = `${this.currLang[i][0]} <br />  ${this.currLang[i][1]}`;
        } else {
          allKeyCaps[i].textContent = [...this.currLang[i]];
        }
      } else {
        allKeyCaps[i].textContent = this.shiftPressed
          || this.capsLockPressed
          ? this.currLang[i]
          : this.currLang[i].toLowerCase();
      }
    }
  };

  changeLanguage = () => {
    if (this.lang === 'en') {
      localStorage.setItem('keyboard_lang', 'ru');
      this.currLang = RU;
    } else {
      localStorage.setItem('keyboard_lang', 'en');
      this.currLang = EN;
    }
    this.lang = localStorage.getItem('keyboard_lang');
    this.changeKeyboardLayout();
  };

  onKeyDown = (e) => {
    let keyId = document.getElementById(e.code);
    keyId = keyCode.indexOf(keyId.id);
    e.preventDefault();
    if (keyCode.includes(e.code)) {
      this.pressedKeys = [
        ...this.pressedKeys,
        document.getElementById(`${e.code}`),
      ];
      this.pressedKeys.map((el) => el.classList.add('pressed'));
    }
    if (e.key === 'Shift') {
      this.shiftPressed = true;
      this.changeKeyboardLayout();
    } else if (e.key === 'CapsLock') {
      this.capsLockPressed = true;
      this.changeKeyboardLayout();
    } else if ((e.key === 'Control' && e.altKey) || (e.key === 'Alt' && e.ctrlKey)) {
      this.changeLanguage();
    } else if (e.key === 'Backspace') {
      this.input.value = this.input.value.slice(0, -1);
    } else if (e.key === 'Enter') {
      this.input.value += '\n';
    } else if (e.key === 'Tab') {
      this.input.value += '    ';
    } else if (e.key === 'Space') {
      this.input.value += ' ';
    } else if (e.key === 'Control' || e.key === 'Alt' || e.key === 'Meta') {
      this.metaKeyPress = !this.metaKeyPress;
    } else if (this.shiftPressed) {
      if (Array.isArray(this.currLang[keyId])) {
        this.input.value += this.currLang[keyId][0];
      } else {
        this.input.value += this.currLang[keyId];
      }
    } else if (this.capsLockPressed) {
      if (keyId < 13) {
        this.input.value += this.currLang[keyId][1];
      } else {
        this.input.value += this.currLang[keyId];
      }
    } else if (Array.isArray(this.currLang[keyId])) {
      this.input.value += this.currLang[keyId][1];
    } else {
      this.input.value += this.currLang[keyId].toLowerCase();
    }
  };

  onKeyUp = (e) => {
    if (keyCode.includes(e.code)) {
      this.pressedKeys = this.pressedKeys.filter((el) => el.id !== e.code);
      document.getElementById(`${e.code}`).classList.remove('pressed');
    }
    if (e.key === 'Shift') {
      this.shiftPressed = false;
      this.changeKeyboardLayout();
    }
    if (e.key === 'CapsLock') {
      this.capsLockPressed = false;
      this.changeKeyboardLayout();
    }
  };

  onMouseDown = (e) => {
    this.addKeyAnimation(e);
    this.keyClicked = e.target.textContent;
    if (this.keyClicked === 'shift') {
      this.shiftPressed = true;
      this.changeKeyboardLayout();
    }
    if (this.keyClicked === 'caps lock') {
      this.capsLockPressed = !this.capsLockPressed;
      this.changeKeyboardLayout();
    }
  };

  onMouseUp = (e) => {
    this.removeKeyAnimation(e);
    if (e.target.textContent === 'fn' || e.target.id === 'fn') {
      this.changeLanguage();
    }
    if (this.keyClicked === 'shift') {
      this.shiftPressed = false;
      this.changeKeyboardLayout();
    }
  };

  addKeyAnimation = (e) => {
    this.object = e.target;
    if (e.target.classList.contains('key')) {
      e.target.classList.add('pressed');
    } else {
      e.target.parentNode.classList.add('pressed');
    }
  };

  removeKeyAnimation = (e) => {
    this.object = e.target;
    if (this.object.classList.contains('key')) {
      this.object.classList.remove('pressed');
    } else {
      this.object.parentNode.classList.remove('pressed');
    }
  };
}

window.onload = () => {
  const keyboard = new Keyboard();
  keyboard.generateKeyboard();
  keyboard.generateEvents();
};
