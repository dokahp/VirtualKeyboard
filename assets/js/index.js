import { keyCode } from './buttonsData.js';
import { EN, RU } from './languages.js';

class Keyboard {
  constructor() {
    this.shiftPressed = false;
    this.capsLockPressed = false;
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
        allKeyCaps[i].textContent = this.currLang[i].toLowerCase();
      }
    }
    return this;
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
    if (keyCode.includes(e.code)) {
      this.pressedKeys = [
        ...this.pressedKeys,
        document.getElementById(`${e.code}`),
      ];
      this.pressedKeys.map((el) => el.classList.add('pressed'));
    }
  };

  onKeyUp = (e) => {
    if (keyCode.includes(e.code)) {
      this.pressedKeys = this.pressedKeys.filter((el) => el.id !== e.code);
      document.getElementById(`${e.code}`).classList.remove('pressed');
    }
  };

  onMouseDown = (e) => {
    this.addKeyAnimation(e);
  };

  onMouseUp = (e) => {
    this.removeKeyAnimation(e);
    if (e.target.textContent === 'fn' || e.target.id === 'fn') {
      this.changeLanguage();
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
