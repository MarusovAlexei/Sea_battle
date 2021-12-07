class BattlefieldView extends Battlefield {
  //все приложение
  root = null;
  //игровое поле
  table = null;
  //div со всеми кораблями до расстановки
  dock = null;
  //div с выстрелами
  polygon = null;

  //быстрый доступ к каждой ячейке через матрицу
  cells = [];

  constructor() {
    super();

    const root = document.createElement('div');
    root.classList.add('battlefield');

    const table = document.createElement('table');
    table.classList.add('battlefield-table');

    const dock = document.createElement('div');
    dock.classList.add('battlefield-dock');

    const polygon = document.createElement('div');
    polygon.classList.add('battlefield-polygon');

    Object.assign(this, { root, table, dock, polygon });
    root.append(table, dock, polygon);

    //делаем таблицу игрового поля
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

    for (let x = 0; x < 10; x++) {
      const cell = this.cells[0][x];
      const marker = document.createElement('div');

      marker.classList.add('marker', 'marker-column');
      marker.textContent = 'АБВГДЕЖЗИК'[x];

      cell.append(marker);
    }

    for (let y = 0; y < 10; y++) {
      const cell = this.cells[y][0];
      const marker = document.createElement('div');

      marker.classList.add('marker', 'marker-row');
      marker.textContent = y + 1;

      cell.append(marker);
    }
  }

  addShip(ship, x, y) {
    if (!super.addShip(ship, x, y)) {
      return false;
    }

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

    return true;
  }

  removeShip(ship) {
    if (!super.removeShip(ship)) {
      return false;

    }
    if (Array.prototype.includes.call(this.dock.children, ship.div)) {
      ship.div.remove();
    }

    return true;
  }

  isUnder(point) {
    return isUnderPoint(point, this.root);
  }
}