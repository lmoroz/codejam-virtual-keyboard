export default class Textbox {
  constructor(id = 'textbox', classnames = 'textbox') {
    this.element = document.createElement('textarea');
    this.element.setAttribute('id', id);
    const classList = (!Array.isArray(classnames)) ? [classnames] : classnames;
    classList.forEach((classname) => this.element.classList.add(classname));
    document.body.prepend(this.element);
  }

  addchar(char) {
    const currentContent = this.element.value;
    const startPosition = this.element.selectionStart;
    const endPosition = this.element.selectionEnd;

    this.setContent(
      currentContent.substr(0, startPosition),
      char,
      currentContent.substr(endPosition, currentContent.length),
    );
    this.caretAt(endPosition + 1);
  }

  removeLeft() {
    const currentContent = this.element.value;
    const startPosition = this.element.selectionStart - 1;
    const endPosition = this.element.selectionEnd;
    this.setContent(
      currentContent.substr(0, startPosition),
      currentContent.substr(endPosition, currentContent.length),
    );
  }

  removeRight() {
    const currentContent = this.element.value;
    const startPosition = this.element.selectionStart;
    const endPosition = this.element.selectionEnd + 1;
    this.setContent(
      currentContent.substr(0, startPosition),
      currentContent.substr(endPosition, currentContent.length),
    );
  }

  setContent(...parts) {
    this.element.value = parts.join('');
  }

  caretAt(position = 'end') {
    let newPosition = position;
    if (position === 'end') {
      const currentContent = this.element.value;
      newPosition = currentContent.length;
    }
    this.element.setSelectionRange(newPosition, newPosition);
  }
}
