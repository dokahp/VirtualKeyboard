import { keyCode, fKey } from './buttonsData.js';

const EN = [
  ['~', '`'],
  ['!', '1'],
  ['@', '2'],
  ['#', '3'],
  ['$', '4'],
  ['%', '5'],
  ['^', '6'],
  ['&', '7'],
  ['*', '8'],
  ['(', '9'],
  [')', '0'],
  ['_', '-'],
  ['+', '='],
  'delete',
  'tab',
  'Q',
  'W',
  'E',
  'R',
  'T',
  'Y',
  'U',
  'I',
  'O',
  'P',
  ['{', '['],
  ['}', ']'],
  ['|', '\\'],
  'caps lock',
  'A',
  'S',
  'D',
  'F',
  'G',
  'H',
  'J',
  'K',
  'L',
  [':', ';'],
  ['"', "'"],
  'return',
  'shift',
  'Z',
  'X',
  'C',
  'V',
  'B',
  'N',
  'M',
  ['<', ','],
  ['>', '.'],
  ['?', '/'],
  '↑',
  'shift',
  'fn',
  'control',
  'option',
  'command',
  ' ',
  'command',
  '←',
  '↓',
  '→',
  'option',
];

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
      if (fKey.includes(EN[i])) {
        this.newKey.classList.add('f_key');
        if (i === 41) {
          this.newKey.classList.add('shift-left');
        } else if (i === 53) {
          this.newKey.classList.add('shift-right');
        } else {
          this.newKey.classList.add(`${EN[i].split(' ').join('')}`);
        }
      } else {
        this.newKey.classList.add('key');
        if (i === 58) {
          this.newKey.classList.add('space');
        }
      }
      if (Array.isArray(EN[i])) {
        this.newKey.classList.add(`k${EN[i][1].charCodeAt()}`);
      } else {
        this.newKey.classList.add(`k${EN[i].charCodeAt()}`);
      }
      this.main.appendChild(this.newKey);
      this.keyCap = document.createElement('div');
      if (Array.isArray(EN[i])) {
        this.keyCap.innerHTML = `${EN[i][0]} <br />  ${EN[i][1]}`;
      } else {
        this.keyCap.textContent = EN[i];
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

  onKeyDown = (e) => {
    this.addKeyAnimation(e);
  };

  onKeyUp = (e) => {
    this.removeKeyAnimation(e);
  };

  onMouseDown = (e) => {
    this.addKeyAnimation(e);
  };

  onMouseUp = (e) => {
    this.removeKeyAnimation(e);
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
