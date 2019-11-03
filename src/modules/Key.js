export default class Key {
  constructor({
    keyProps, index, defaultSize = '60', layouts = [],
  }) {
    this.layouts = {};
    const [, code, modifier, size, title, type, chars] = keyProps.match(/^([^:]+):([^:]+):([^:]*):([^:]*):([^:]+):((.|\n)+)$/i);
    this.code = code;
    this.type = type;

    this.layoutKeys = ['symbol', 'letter'].includes(type)
      ? chars.split('')
      : (new Array(8)).fill(chars);

    this.node = document.createElement('button');

    this.node.setAttribute('tabindex', index + 1);
    this.node.setAttribute('type', 'button');
    this.node.setAttribute('data-key-code', code);

    this.node.classList.add('kbd__key');
    this.node.classList.add(`kbd__key_${modifier}`);
    this.node.classList.add(`kbd__key_${type}`);
    this.node.classList.add(`kbd__key_${code}`);

    const flexBasis = (size || defaultSize);
    if (flexBasis.match(/\d+/)) this.node.style.flex = '0';
    this.node.style.flexBasis = flexBasis.match(/\d+/) ? `${flexBasis}px` : flexBasis;


    layouts.forEach((layout, layoutIndex) => {
      this.node.setAttribute(`data-key-${layout}`, title || this.layoutKeys[layoutIndex]);
      this.layouts[layout] = this.layoutKeys[layoutIndex];
    });
  }

  event(type) {
    this[type]();
  }

  mousedown() {
    this.node.classList.add('active');
  }

  mouseup() {
    this.node.classList.remove('active');
  }

  keydown() {
    this.node.classList.add('active');
  }

  keyup() {
    this.node.classList.remove('active');
  }
}
