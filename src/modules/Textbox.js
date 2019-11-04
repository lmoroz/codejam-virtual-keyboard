export default class Textbox {
  constructor(id = 'textbox', classnames = 'textbox') {
    this.element = document.createElement('textarea');
    this.element.setAttribute('id', id);
    this.element.value = this.content;

    const classList = (!Array.isArray(classnames)) ? [classnames] : classnames;
    classList.forEach((classname) => this.element.classList.add(classname));

    document.body.prepend(this.element);
    this.caretPosition = 0;

    const saveContentBound = (e) => {
      this.content = e.target.value;
    };
    this.element.addEventListener('change', saveContentBound);
    this.element.addEventListener('mouseup', saveContentBound);
    this.element.addEventListener('keyup', saveContentBound);
  }

  set content(newContent) {
    this.currentContent = newContent;
    localStorage.cjvcTextcontent = newContent;
  }

  get content() {
    this.currentContent = localStorage.cjvcTextcontent || '';
    return this.currentContent;
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
    if (startPosition < endPosition) this.caretAt(startPosition + 1);
    else this.caretAt(endPosition + 1);
  }

  removeLeft() {
    const currentContent = this.element.value;
    const startPosition = this.element.selectionStart;
    const endPosition = this.element.selectionEnd;
    if (startPosition < endPosition) {
      this.setContent(
        currentContent.substr(0, startPosition),
        currentContent.substr(endPosition, currentContent.length),
      );
      this.caretAt(startPosition);
    } else {
      this.setContent(
        currentContent.substr(0, startPosition - 1),
        currentContent.substr(endPosition, currentContent.length),
      );
      this.caretAt(startPosition - 1);
    }
  }

  removeRight() {
    const currentContent = this.element.value;
    const startPosition = this.element.selectionStart;
    const endPosition = this.element.selectionEnd;
    if (startPosition < endPosition) {
      this.setContent(
        currentContent.substr(0, startPosition),
        currentContent.substr(endPosition, currentContent.length),
      );
    } else {
      this.setContent(
        currentContent.substr(0, startPosition),
        currentContent.substr(endPosition + 1, currentContent.length),
      );
    }
    this.caretAt(startPosition);
  }

  setContent(...parts) {
    this.element.value = parts.join('');
  }

  caretAt(positionStart = 'end', positionEnd = false) {
    let newPosition = positionStart;
    if (newPosition === 'end') {
      const currentContent = this.element.value;
      newPosition = currentContent.length;
    }
    if (newPosition < 0) newPosition = 0;
    this.element.setSelectionRange(newPosition, positionEnd || newPosition);
    this.caretPosition = newPosition;
  }

  caretLeft() {
    this.caretAt(this.caretPosition - 1);
  }

  caretRight() {
    this.caretAt(this.caretPosition + 1);
  }
}
