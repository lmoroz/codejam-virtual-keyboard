export default class Textbox {
  constructor(id, classnames) {
    this.element = document.createElement('textarea');
    this.element.setAttribute('id', id);
    const classList = (!Array.isArray(classnames)) ? [classnames] : classnames;
    classList.forEach((classname) => this.element.classList.add(classname));
  }

  addchar(char) {
    this.element.textContent += char;
  }

  addchar(char) {
    this.element.textContent += char;
  }
}
