export default class Textbox {
  constructor(id, classnames) {
    this.element = document.createElement('textarea');
    this.element.setAttribute('id', id);
    const classList = (!Array.isArray(classnames)) ? [classnames] : classnames;
    classList.forEach((classname) => this.element.classList.add(classname));
  }

  addchar(char) {
    const currentContent = this.element.textContent;
    const startPosition = this.element.selectionStart;
    const endPosition = this.element.selectionEnd;
    this.setContent(
      currentContent.substr(0, startPosition),
      char,
      currentContent.substr(startPosition, endPosition),
    );
  }

  removeLeft() {
    const currentContent = this.element.textContent;
    const startPosition = this.element.selectionStart - 1;
    const endPosition = this.element.selectionEnd;
    this.setContent(
      currentContent.substr(0, startPosition),
      currentContent.substr(startPosition, endPosition),
    );
  }

  removeRight() {
    const currentContent = this.element.textContent;
    const startPosition = this.element.selectionStart;
    const endPosition = this.element.selectionEnd + 1;
    this.setContent(
      currentContent.substr(0, startPosition),
      currentContent.substr(startPosition, endPosition),
    );
  }

  setContent(...parts) {
    this.element.textContent = parts.join('');
  }

  caretRight() {
    const newPosition = this.element.selectionStart + 1;
    this.element.setSelectionRange(newPosition, newPosition);
  }

  caretLeft() {
    const newPosition = this.element.selectionStart - 1;
    this.element.setSelectionRange(newPosition, newPosition);
  }

  selectRight() {
    const curPosition = this.element.selectionStart;
    this.element.setSelectionRange(curPosition, curPosition + 1);
  }

  selectLeft() {
    const curPosition = this.element.selectionStart;
    this.element.setSelectionRange(curPosition, curPosition - 1);
  }
}
