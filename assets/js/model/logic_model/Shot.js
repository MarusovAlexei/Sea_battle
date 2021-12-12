/* координаты и состояние выстрела */

class Shot {

  // координаты выстрела
  x = null;
  y = null;

  // вариант показывает промахнулся, ранил или убил выстрел
  variant = null;

  constructor(x, y, variant = 'miss') {
    Object.assign(this, { x, y, variant });
  }

  setVariant(variant) {
    this.variant = variant;
  }
}