class Mouse {

  element = null;
  // находится ли мышка над элементом
  under = false;
  // находилась ли мышь над нашим элементом в предыдущий тик работы приложения
  pUnder = false;

  // координаты мыши
  x = null;
  y = null;
  // координаты мыши в предыдущий тик работы приложения
  pX = null;
  pY = null;

  //состояние левой кнопки мыши
  left = false;
  pLeft = false;

  //состояние прокрутки колеса мыши
  delta = 0;
  pDelta = 0;

  constructor(element) {
    this.element = element;

    const update = (e) => {
      this.x = e.clientX;
      this.y = e.clientY;
      this.delta = 0;
      this.under = true;
    };

    element.addEventListener("mousemove", (e) => {
      this.tick();
      update(e);
    });

    element.addEventListener("mouseenter", (e) => {
      this.tick();
      update(e);
    });

    element.addEventListener("mouseleave", (e) => {
      this.tick();
      update(e);

      this.under = false;
    });

    element.addEventListener("mousedown", (e) => {
      this.tick();
      update(e);

      if (e.button === 0) {
        this.left = true;
      }
    });

    element.addEventListener("mouseup", (e) => {
      this.tick();
      update(e);

      if (e.button === 0) {
        this.left = false;
      }
    });

    element.addEventListener("wheel", (e) => {
      this.tick();

      this.x = e.clientX;
      this.y = e.clientY;
      this.delta = e.deltaY > 0 ? 1 : -1;
      this.under = true;
    });
  }

  tick() {
    this.pX = this.x;
    this.pY = this.y;
    this.pUnder = this.under;
    this.pLeft = this.left;
    this.pDelta = this.delta;
    this.delta = 0;
  }
}