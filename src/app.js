import keysConfig from './modules/keymap';
import Textbox from './modules/Textbox';
import Keyboard from './modules/Keyboard';
import layouts from './modules/Layouts';

const initHTML = () => {
  const head = document.getElementsByTagName('HEAD')[0];
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = 'app.css';
  head.appendChild(link);

  const textbox = new Textbox();
  const keyboard = new Keyboard({
    keymap: keysConfig, textbox, id: 'kb', layouts, layout: 'en',
  });
};

document.addEventListener('DOMContentLoaded', initHTML);
