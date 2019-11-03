
import Key from './Key';

export default class Keyboard {
  constructor({
    keymap, textbox, id = 'keyboard', layouts = ['en'], layout = 'en', classnames = 'kbd',
  }) {
    this.element = document.createElement('div');
    this.element.setAttribute('id', id);
    this.element.dataset.layout = layout;

    const classList = (!Array.isArray(classnames)) ? [classnames] : classnames;
    classList.forEach((classname) => this.element.classList.add(classname));
    document.body.append(this.element);

    this.textbox = textbox;
    this.layouts = layouts;
    this.keys = {};
    this.drawKeys(keymap, classList);
  }

  drawKeys(keymap, classList) {
    const kbHTML = document.createDocumentFragment();
    let currentRow = false;
    keymap.forEach((keyProps, index) => {
      if (!keyProps) {
        if ((index + 1) < keymap.length) {
          currentRow = document.createElement('div');
          classList.forEach((classname) => currentRow.classList.add(`${classname}__row`));
          kbHTML.append(currentRow);
        }
        return;
      }
      const key = new Key({ keyProps, index, layouts: this.layouts });
      if (key.code) this.keys[key.code] = key;
      currentRow.append(key.node);
    });
    this.element.append(kbHTML);
  }
}
