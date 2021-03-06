/* визуальная модель игрового поля */

class BattlefieldView extends Battlefield {

  // все приложение
  root = null;

  // игровое поле
  table = null;

  // div со всеми кораблями до расстановки
  dock = null;

  // div с выстрелами
  polygon = null;

  // отображение кораблей
  showShips = true;

  // матрица ячеек
  cells = [];

  constructor(showShips = true) {
    super();

    // создаем игровое поле
    const root = document.createElement('div');
    root.classList.add('battlefield');
    const table = document.createElement('table');
    table.classList.add('battlefield-table');

    // создаем div со всеми кораблями до расстановки
    const dock = document.createElement('div');
    dock.classList.add('battlefield-dock');

    // создаем div с выстрелами
    const polygon = document.createElement('div');
    polygon.classList.add('battlefield-polygon');

    Object.assign(this, { root, table, dock, polygon, showShips });
    root.append(table, dock, polygon);

    // делаем таблицу игрового поля
    for (let y = 0; y < 10; y++) {
      const row = [];
      const tr = document.createElement('tr');
      tr.classList.add('battlefield-row');
      tr.dataset.y = y;

      for (let x = 0; x < 10; x++) {
        const td = document.createElement('td');
        td.classList.add('battlefield-item');
        Object.assign(td.dataset, { x, y });

        tr.append(td);
        row.push(td);
      }

      table.append(tr);
      this.cells.push(row);
    }

    // добавляем маркеры по левому краю игрового поля
    for (let x = 0; x < 10; x++) {
      const cell = this.cells[0][x];
      const marker = document.createElement('div');

      marker.classList.add('marker', 'marker-column');
      marker.textContent = 'АБВГДЕЖЗИК'[x];

      cell.append(marker);
    }

    // добавляем маркеры по верхнему краю игрового поля
    for (let y = 0; y < 10; y++) {
      const cell = this.cells[y][0];
      const marker = document.createElement('div');

      marker.classList.add('marker', 'marker-row');
      marker.textContent = y + 1;

      cell.append(marker);
    }
  }

  // добавляем графическую часть корабля
  addShip(ship, x, y) {
    if (!super.addShip(ship, x, y)) {
      return false;
    }

    if (this.showShips) {

      this.dock.append(ship.div);

      if (ship.placed) {
        const cell = this.cells[y][x];
        const cellRect = cell.getBoundingClientRect();
        const rootRect = this.root.getBoundingClientRect();

        ship.div.style.left = `${cellRect.left - rootRect.left}px`;
        ship.div.style.top = `${cellRect.top - rootRect.top}px`;
      } else {
        ship.setDirection('row');
        ship.div.style.left = `${ship.startX}px`;
        ship.div.style.top = `${ship.startY}px`;
      }
    }

    return true;
  }

  // удаляем графическую часть корабля
  removeShip(ship) {
    if (!super.removeShip(ship)) {
      return false;

    }
    if (Array.prototype.includes.call(this.dock.children, ship.div)) {
      ship.div.remove();
    }

    return true;
  }

  //
  isUnder(point) {
    return isUnderPoint(point, this.root);
  }

  // добавляем графическую часть выстрела
  addShot(shot) {
    if (!super.addShot(shot)) {
      return false;
    }

    this.polygon.append(shot.div);

    const cell = this.cells[shot.y][shot.x];
    const cellRect = cell.getBoundingClientRect();
    const rootRect = this.root.getBoundingClientRect();

    shot.div.style.left = `${cellRect.left - rootRect.left}px`;
    shot.div.style.top = `${cellRect.top - rootRect.top}px`;

    return true;
  }

  // удаляем графическую часть выстрела
  removeShot(shot) {
    if (!super.removeShot(shot)) {
      return false;
    }

    if (Array.prototype.includes.call(this.polygon.children, shot.div)) {
      shot.div.remove();
    }

    return true;
  }
}