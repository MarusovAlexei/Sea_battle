/* визуальная модель корабя */

class ShipView extends Ship {
  div = null;

  startX = null;
  startY = null;

  constructor(size, direction, startX, startY) {

    // берем размер и положение в конструкторе родительского класса
    super(size, direction);

    // создаем корабль
    const div = document.createElement("div");
    div.classList.add("ship");

    Object.assign(this, { div, startX, startY });

    this.setDirection(direction, true);
  }

  // изменияем положение для короблей
  setDirection(newDirection, force = false) {

    // соответствует ли новая ориентация старой
    if (!force && this.direction === newDirection) {
      return false;
    }

    this.div.classList.remove(`ship-${this.direction}-${this.size}`);
    this.direction = newDirection;
    this.div.classList.add(`ship-${this.direction}-${this.size}`);

    return true;
  }

  // изменение положения корабля, в зависимости от текущего
  toggleDirection() {
    const newDirection = this.direction === "row" ? "column" : "row";
    this.setDirection(newDirection);
  }

  // возвращает true, если point находится над element
  isUnder(point) {
    return isUnderPoint(point, this.div);
  }
}