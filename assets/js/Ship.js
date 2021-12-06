class Ship {
  size = null;
  direction = null;
  killed = false;

  x = null;
  y = null;

  get placed() {
    return Boolean(this.x && this.y !== null);
  }

  constructor(size, direction) {
    this.size = size;
    this.direction = direction;
  }
}