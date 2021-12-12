/* логическая модель корабя */

class Ship {

  // размер корабля
  size = null;

  // полложение корабля (горизонтальное, вертикальное)
  direction = null;

  // убит корабль или нет
  killed = false;

  // координаты корабля
  x = null;
  y = null;

  // расположен корабль на игровом поле или нет
  get placed() {
    return this.x !== null && this.y !== null;
  }

  constructor(size, direction) {
    this.size = size;
    this.direction = direction;
  }
}