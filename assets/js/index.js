import { keyCode } from './keyCode.js';
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

  generateKeyboard() {
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
    this.description.innerHTML = 'Клавиатура создана в операционной системе MacOS <br />';
    this.description.innerHTML += 'Для переключения языка: левыe ctrl(control) + alt(option) или клик по клавише Fn';
    this.container.appendChild(this.description);
  }

  generateEvents() {
    this.allKeys = document.querySelector('.main');
    this.allKeys.childNodes.forEach((el) => el.addEventListener('mousedown', (e) => this.onMouseDown(e)));
    this.allKeys.childNodes.forEach((el) => el.addEventListener('mouseup', (e) => this.onMouseUp(e)));
    document.addEventListener('keydown', (e) => this.onKeyDown(e));
    document.addEventListener('keyup', (e) => this.onKeyUp(e));
  }

  changeKeyboardLayout() {
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
  }

  changeLanguage() {
    if (this.lang === 'en') {
      localStorage.setItem('keyboard_lang', 'ru');
      this.currLang = RU;
    } else {
      localStorage.setItem('keyboard_lang', 'en');
      this.currLang = EN;
    }
    this.lang = localStorage.getItem('keyboard_lang');
    this.changeKeyboardLayout();
  }

  addValueToCursorPosition(value) {
    const cursor = this.input.selectionStart;
    const textVal = this.input.value;
    this.input.value = (textVal.slice(0, cursor) + value + textVal.slice(cursor));
    this.input.selectionStart = cursor + 1;
    this.input.selectionEnd = cursor + 1;
  }

  onKeyDown(e) {
    e.preventDefault();
    let code = null;
    if (keyCode.includes(e.code)) {
      code = document.getElementById(e.code).id;
    } else {
      return null;
    }
    const keyId = keyCode.indexOf(code);
    if (keyCode.includes(e.code)) {
      this.pressedKeys = [
        ...this.pressedKeys,
        document.getElementById(`${e.code}`),
      ];
      this.pressedKeys.map((el) => el.classList.add('pressed'));
    }
    if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
      this.shiftPressed = true;
      this.changeKeyboardLayout();
    } else if (e.code === 'CapsLock') {
      this.capsLockPressed = !this.capsLockPressed;
      this.changeKeyboardLayout();
    } else if ((e.key === 'Control' && e.altKey) || (e.key === 'Alt' && e.ctrlKey)) {
      this.changeLanguage();
    } else if (e.code === 'Backspace') {
      const textVal = this.input.value;
      if (this.input.selectionStart === this.input.value.length) {
        this.input.value = this.input.value.slice(0, -1);
      } else if (this.input.selectionStart === 0) {
        this.input.value = textVal;
      } else {
        const cursor = this.input.selectionStart - 1;
        this.input.value = (textVal.slice(0, cursor) + textVal.slice(cursor + 1));
        this.input.selectionStart = cursor;
        this.input.selectionEnd = cursor;
      }
    } else if (e.code === 'Enter') {
      this.addValueToCursorPosition('\n');
    } else if (e.code === 'Tab') {
      this.addValueToCursorPosition('    ');
      this.input.selectionEnd += 3;
      this.input.selectionStart = this.input.selectionEnd;
    } else if (['ControlLeft', 'AltLeft', 'MetaLeft', 'MetaRight', 'AltRight'].includes(e.code)) {
      this.metaKeyPress = !this.metaKeyPress;
    } else if (this.shiftPressed) {
      if (Array.isArray(this.currLang[keyId])) {
        this.addValueToCursorPosition(this.currLang[keyId][0]);
      } else {
        this.addValueToCursorPosition(this.currLang[keyId]);
      }
    } else if (this.capsLockPressed) {
      if (keyId < 13) {
        this.addValueToCursorPosition(this.currLang[keyId][1]);
      } else if (Array.isArray(this.currLang[keyId])) {
        this.addValueToCursorPosition(this.currLang[keyId][1]);
      } else {
        this.addValueToCursorPosition(this.currLang[keyId]);
      }
    } else if (Array.isArray(this.currLang[keyId])) {
      this.addValueToCursorPosition(this.currLang[keyId][1]);
    } else {
      this.addValueToCursorPosition(this.currLang[keyId].toLowerCase());
    }
    return null;
  }

  onKeyUp(e) {
    if (keyCode.includes(e.code)) {
      this.pressedKeys = this.pressedKeys.filter((el) => el.id !== e.code);
      document.getElementById(`${e.code}`).classList.remove('pressed');
    }
    if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
      this.shiftPressed = false;
      this.changeKeyboardLayout();
    }
    // if (e.code === 'CapsLock' && this.capsLockPressed) {
    //   this.capsLockPressed = false;
    //   this.changeKeyboardLayout();
    // }
  }

  onMouseDown(e) {
    const btnPressCode = e.currentTarget.id;
    if (e.currentTarget.textContent === 'fn' || e.currentTarget.id === 'fn') {
      this.changeLanguage();
    } else {
      const keyDown = new KeyboardEvent('keydown', { code: btnPressCode, shiftKey: this.shiftPressed });
      document.dispatchEvent(keyDown);
    }
  }

  onMouseUp(e) {
    const btnPressCode = e.currentTarget.id;
    if (keyCode.includes(btnPressCode)) {
      this.pressedKeys = this.pressedKeys.filter((el) => el.id !== btnPressCode);
      document.getElementById(`${btnPressCode}`).classList.remove('pressed');
    }
    if (btnPressCode === 'ShiftLeft' || btnPressCode === 'ShiftRight') {
      this.shiftPressed = false;
      this.changeKeyboardLayout();
    }
  }
}

window.onload = () => {
  const keyboard = new Keyboard();
  keyboard.generateKeyboard();
  keyboard.generateEvents();
};
