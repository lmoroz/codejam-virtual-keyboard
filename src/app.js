// import keysConfig from './modules/keymap';
// import Textbox from './modules/Textbox';
// import Keyboard from './modules/Keyboard';
// import Key from './modules/Key';
const initHTML = () => {
  const head = document.getElementsByTagName('HEAD')[0];
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = 'app.css';
  head.appendChild(link);
};

document.addEventListener('DOMContentLoaded', initHTML);
