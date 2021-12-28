import cssPath from './app.css';
import keysConfig from './modules/keymap';
import Textbox from './modules/Textbox';
import Keyboard from './modules/Keyboard';
import layoutsList from './modules/Layouts';

const addStyleLink = (cssLink) => {
  const head = document.getElementsByTagName('HEAD')[0];
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = cssLink;
  head.appendChild(link);
};
const initHTML = () => {
  addStyleLink(cssPath);
  addStyleLink('https://fonts.googleapis.com/css?family=Roboto:300,400&amp;display=swap');
  const textbox = new Textbox();
  const keyboard = new Keyboard({
    keymap: keysConfig, textbox, id: 'kb', layouts: layoutsList,
  });

  const boundToKeyboardRestore = keyboard.restoreState.bind(keyboard);
  window.addEventListener('blur', boundToKeyboardRestore);
  window.addEventListener('mouseout', boundToKeyboardRestore);
  window.addEventListener('mouseleave', boundToKeyboardRestore);

  const boundToKeyboardKeyEvent = keyboard.keyEvent.bind(keyboard);
  window.addEventListener('keydown', boundToKeyboardKeyEvent);
  window.addEventListener('keyup', boundToKeyboardKeyEvent);

  const boundToKeyboardMouseEvent = keyboard.mouseEvent.bind(keyboard);
  document.addEventListener('mousedown', boundToKeyboardMouseEvent);
  document.addEventListener('mouseup', boundToKeyboardMouseEvent);
};

document.addEventListener('DOMContentLoaded', initHTML);
