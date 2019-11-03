export default class Key {
  constructor(keyProps, index, defaultSize, layouts) {
    this.layouts = {};
    const [, code, modifier, size, title, modifier2, chars] = keyProps.match(/^([^:]+):([^:]+):([^:]*):([^:]*):([^:]+):(.+)$/i);
    this.code = code;

    this.layoutKeys = (modifier === 'key')
      ? chars.split('')
      : (new Array(8)).fill(chars);

    this.node = document.createElement('button');
    this.node.setAttribute('tabindex', index + 1);
    this.node.setAttribute('type', 'button');
    this.node.setAttribute('data-key-code', code);

    this.node.classList.add(`kbd__key_${modifier}`);
    this.node.classList.add(`kbd__key_${modifier2}`);
    this.node.classList.add(`kbd__key_${code}`);

    const flexBasis = (size || defaultSize);
    if (size.match(/\d+/)) this.node.style.flex = '0';
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