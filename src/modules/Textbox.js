export default class Textbox {
  constructor(id = 'textbox', classnames = 'textbox') {
    this.element = document.createElement('textarea');
    this.element.setAttribute('id', id);
    this.element.value = this.content;

    const classList = (!Array.isArray(classnames)) ? [classnames] : classnames;
    classList.forEach((classname) => this.element.classList.add(classname));

    document.body.prepend(this.element);

    const saveContentBound = (e) => {
      // при изменении контента сохраним его
      // для восстановления при перезагрузке
      // (включая положение каретки)
      this.content = e.target.value;
      this.caretPosition = this.element.selectionEnd;
      if (e.type !== 'keyup' || !['ArrowUp', 'ArrowDown'].includes(e.code)) {
        // в случае клика мышкой или изменения контента
        // сохраним крайнее правое положение каретки
        // так как в общем случае при шаге вверх/вниз
        // каретка удерживается в последнем заданном крайнем
        // правом положении если это позволяет длина строки
        this.lastLongestCaretPosition = this.element.selectionEnd;
      }
    };
    this.element.addEventListener('change', saveContentBound);
    this.element.addEventListener('mouseup', saveContentBound);
    this.element.addEventListener('keyup', saveContentBound);

    this.element.focus();
    this.caretAt(this.caretPosition);
  }

  set content(newContent) {
    this.currentContent = newContent;
    localStorage.cjvcTextcontent = newContent;
  }

  get content() {
    this.currentContent = localStorage.cjvcTextcontent || '';
    return this.currentContent;
  }

  set caretPosition(newPosition) {
    localStorage.cjvcCaretPosition = newPosition;
    this.currentCaretPosition = newPosition;
  }

  get caretPosition() {
    this.currentCaretPosition = localStorage.cjvcCaretPosition || 0;
    return this.currentCaretPosition;
  }

  set lastLongestCaretPosition(newPosition) {
    const caretPos = this.getCaretPosition();
    this.llCP = caretPos.caretX;
  }

  get lastLongestCaretPosition() {
    return this.llCP;
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
    return this.caretPosition;
  }

  caretLeft() {
    this.lastLongestCaretPosition = this.caretAt(this.caretPosition - 1);
  }

  caretRight() {
    this.lastLongestCaretPosition = this.caretAt(this.caretPosition + 1);
  }

  getCaretPosition() {
    const topHalfContent = this.element.value.substr(0, this.element.selectionEnd);
    const topHalfLines = topHalfContent.split('\n');
    const curCaretLineNum = (topHalfLines.length || 1) - 1;
    const posOnLine = topHalfLines.length ? topHalfLines.pop().length : 0;
    const topLinesContent = `${topHalfLines.join('\n')}\n`;
    const prevLine = topHalfLines.length ? `${topHalfLines.pop()}\n` : false;
    const restLines = this.element.value.substr(this.element.selectionEnd).split('\n');

    let restOfCurrentLineLenght = (restLines.length) ? restLines.shift().length : 0;
    if (restLines.length) restOfCurrentLineLenght += 1;

    let nextLine = restLines.length ? `${restLines.shift()}` : false;
    if (nextLine !== false && restLines.length) nextLine += '\n';

    return {
      topHalfContent,
      caretX: posOnLine,
      caretY: curCaretLineNum,
      prevLine,
      nextLine,
      lastPos: this.element.selectionEnd,
      topLinesContent,
      restOfCurrentLineLenght,
    };
  }

  caretUp() {
    const caretPos = this.getCaretPosition();
    let nextCaretPos = 0;
    if (caretPos.caretY === 0) {
      // если это верхняя строка — переводим каретку в её начало
      return this.caretAt(nextCaretPos);
    }
    if (caretPos.prevLine.length < this.lastLongestCaretPosition) {
      // если длина предыдущей строки меньше крайнего правого положения каретки
      // переводим каретку в конец предыдущей строки до перевода строки
      nextCaretPos = caretPos.topLinesContent.length - 1;
    } else {
      // переводим каретку в сохранённое крайнее правое положение
      nextCaretPos = caretPos.topLinesContent.length
        - caretPos.prevLine.length
        + this.lastLongestCaretPosition;
    }
    return this.caretAt(nextCaretPos);
  }

  caretDown() {
    const caretPos = this.getCaretPosition();
    let nextCaretPos = 'end';
    if (!caretPos.nextLine) {
      // если это нижняя строка — переводим каретку в её начало
      return this.caretAt(nextCaretPos);
    }
    if (caretPos.nextLine.length < this.lastLongestCaretPosition) {
      nextCaretPos = caretPos.topHalfContent.length
        + caretPos.restOfCurrentLineLenght
        + caretPos.nextLine.length - 1;
    } else {
      nextCaretPos = caretPos.topHalfContent.length
        + caretPos.restOfCurrentLineLenght + this.lastLongestCaretPosition;
    }

    return this.caretAt(nextCaretPos);
  }
}
