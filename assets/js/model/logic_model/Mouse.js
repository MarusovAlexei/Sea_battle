/* обработка координат, нажатия левой кнопки и вращения колеса мыши */

class Mouse {

  // объект исследования (положение и прокрутка колесика мышки)
  element = null;
  // находится ли мышка над элементом
  under = false;
  // находилась ли мышка над нашим элементом в предыдущий тик работы приложения
  pUnder = false;

  // координаты мышки
  x = null;
  y = null;
  // координаты мышки в предыдущий тик работы приложения
  pX = null;
  pY = null;

  // состояние левой кнопки мышки
  left = false;
  pLeft = false;

  // состояние прокрутки колеса мышки
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

    // событие: движение мышки над элементом
    element.addEventListener("mousemove", (e) => {
      this.tick();
      update(e);
    });

    // событие: мышка преодолевает границу элемента и заходит на него
    element.addEventListener("mouseenter", (e) => {
      this.tick();
      update(e);
    });

    // событие: мышка преодолевает границу элемента и выходит за его пределы
    element.addEventListener("mouseleave", (e) => {
      this.tick();
      update(e);

      this.under = false;
    });

    // событие: нажатие на левую кнопку мышки
    element.addEventListener("mousedown", (e) => {
      this.tick();
      update(e);

      if (e.button === 0) {
        this.left = true;
      }
    });

    // событие: левую кнопку мышки отпустили
    element.addEventListener("mouseup", (e) => {
      this.tick();
      update(e);

      if (e.button === 0) {
        this.left = false;
      }
    });

    // // событие: прокрутка колесика мышки
    element.addEventListener("wheel", (e) => {
      this.tick();

      this.x = e.clientX;
      this.y = e.clientY;
      this.delta = e.deltaY > 0 ? 1 : -1;
      this.under = true;
    });
  }

  // переписывает значение элементов из текущего тика в прошедший
  tick() {
    this.pX = this.x;
    this.pY = this.y;
    this.pUnder = this.under;
    this.pLeft = this.left;
    this.pDelta = this.delta;
    this.delta = 0;
  }
}