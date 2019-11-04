import Key from './Key';

export default class Keyboard {
  constructor({
    keymap, textbox, id = 'keyboard', layouts = ['en'], classnames = 'kbd',
  }) {
    this.langs = layouts;

    this.element = document.createElement('div');
    this.element.setAttribute('id', id);
    const layoutState = [this.lang];
    if (this.capsEnabled) layoutState.push('caps');
    this.element.dataset.layout = layoutState.join('-');

    const classList = (!Array.isArray(classnames)) ? [classnames] : classnames;
    classList.forEach((classname) => this.element.classList.add(classname));
    document.body.append(this.element);

    this.textbox = textbox;
    this.keys = {};
    this.bypassKeys = ['Enter', 'Escape', 'Backspace', 'Del', 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight'];
    this.schortcutKeys = ['KeyA', 'KeyC', 'KeyV', 'KeyX'];
    this.drawKeys(keymap, classList);
  }

  get capsEnabled() {
    this.capsEnabledInternal = !!parseInt(localStorage.cjvcCapsEnabled, 10) || 0;
    return this.capsEnabledInternal;
  }

  set capsEnabled(capsEnabledNewValue) {
    this.capsEnabledInternal = capsEnabledNewValue ? 1 : 0;
    localStorage.cjvcCapsEnabled = this.capsEnabledInternal;
  }

  get lang() {
    this.langInternal = localStorage.cjvcLangName || 'en';
    return this.langInternal;
  }

  set lang(langName) {
    this.langInternal = langName;
    localStorage.cjvcLangName = this.langInternal;
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
      const key = new Key({ keyProps, index, layouts: this.langs });
      if (key.code) this.keys[key.code] = key;
      currentRow.append(key.node);
    });
    this.element.append(kbHTML);
  }

  keyEvent(e) {
    if (!(e.code in this.keys)) return;

    if (!(document.activeElement === this.textbox.element)) {
      this.textbox.element.focus();
      this.textbox.caretAt();
    }

    let curKey = e.code;
    const newSates = [];
    this[e.type](curKey, e.type);

    if (this.schortcutKeys.includes(curKey) && e.getModifierState('Control')) return;
    if (this.bypassKeys.includes(curKey)) return;

    e.preventDefault();

    if (curKey === 'GroupNext' && e.getModifierState('Alt')) { // switch layout combination!
      curKey = 'ShiftLeft';
    } else if (curKey === 'GroupNext' && e.getModifierState('Shift')) { // switch layout combination in other order
      curKey = 'AltLeft';
    }


    if (this.keys[curKey].type === 'func') {
      if (e.type === 'keydown') {
        if (curKey === 'GroupNext' || (curKey === 'AltLeft' && e.getModifierState('Shift')) || (curKey === 'ShiftLeft' && e.getModifierState('Alt'))) {
          this.lang = this.lang === 'ru' ? 'en' : 'ru';
        }
        newSates.push(this.lang);

        if (e.getModifierState('Shift') || curKey === 'Shift') {
          newSates.push('shift');
        }


        if ((curKey === 'CapsLock' && this.capsEnabled) || (!e.getModifierState('CapsLock') && curKey !== 'CapsLock')) {
          this.capsEnabled = false;
        } else if (!this.capsEnabled && (curKey === 'CapsLock' || e.getModifierState('CapsLock'))) {
          this.capsEnabled = true;
        }
      } else {
        newSates.push(this.lang);
        if (e.getModifierState('Shift')) {
          newSates.push('shift');
        }
      }
      if (this.capsEnabled) newSates.push('caps');
      this.element.dataset.layout = newSates.join('-');
    } else if (e.type === 'keydown') {
      this.textbox.addchar(this.keys[curKey].layouts[this.element.dataset.layout]);
    }
  }

  mouseEvent(e) {
    const curKey = e.target.dataset.keyCode;
    if (!curKey) return;
    if (!(document.activeElement === this.textbox.element)) {
      this.textbox.element.focus();
      this.textbox.caretAt(this.textbox.caretPosition);
    }

    const newSates = [];


    if (this.keys[curKey].type === 'func') {
      if (e.type === 'mousedown') {
        newSates.push(this.lang);
        switch (curKey) {
          case 'MetaLeft': {
            this.lang = this.lang === 'ru' ? 'en' : 'ru';
            newSates[0] = this.lang;
            break;
          }
          case 'CapsLock': {
            this.capsEnabled = this.capsEnabled ? 0 : 1;
            break;
          }
          case 'ShiftLeft':
          case 'ShiftRight': {
            newSates.push('shift');
            break;
          }
          case 'Escape': {
            this.textbox.element.blur();
            break;
          }
          case 'Backspace': {
            this.textbox.removeLeft();
            break;
          }
          case 'Delete': {
            this.textbox.removeRight();
            break;
          }
          case 'ArrowLeft': {
            this.textbox.caretLeft();
            break;
          }
          case 'ArrowRight': {
            this.textbox.caretRight();
            break;
          }
          default:
            break;
        }
      } else newSates.push(this.lang);

      if (this.capsEnabled) newSates.push('caps');
      this.element.dataset.layout = newSates.join('-');
    } else if (e.type === 'mousedown') {
      this.textbox.addchar(this.keys[curKey].layouts[this.element.dataset.layout]);
    }
  }


  keydown(code) {
    this.keys[code].keydown();
  }

  keyup(code) {
    this.keys[code].keyup();
  }
}
