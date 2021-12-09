class Battlefield {
  ships = [];
  shots = [];

  #matrix = null;
  #changed = true;

  get loser() {
    // проверяем есть ли у нас целые корабли
    for (const ship of this.ships) {
      if (!ship.killed) {
        return false;
      }
    }

    return true;
  }

  // матрица игрового поля со служебной инфо
  // если есть изменения в #change, то перезаписываем #matrix
  get matrix() {
    if (!this.#changed) {
      this.#matrix;
    }

    const matrix = [];

    for (let y = 0; y < 10; y++) {
      const row = [];

      for (let x = 0; x < 10; x++) {
        const item = {
          x,
          y,
          ship: null,
          free: true,

          shoted: false,
          wounded: false,
        };

        row.push(item);
      }

      matrix.push(row);
    }

    // перебор кораблей
    for (const ship of this.ships) {
      if (!ship.placed) {
        continue;
      }

      const { x, y } = ship;
      const dx = ship.direction === 'row';
      const dy = ship.direction === 'column';

      for (let i = 0; i < ship.size; i++) {
        const cx = x + dx * i;
        const cy = y + dy * i;

        const item = matrix[cy][cx];
        item.ship = ship;
      }

      // клетки корабля и вокруг него (в зависимости от ориентации на игровом поле)
      for (let y = ship.y - 1; y < ship.y + ship.size * dy + dx + 1; y++) {
        for (let x = ship.x - 1; x < ship.x + ship.size * dx + dy + 1; x++) {
          if (this.inField(x, y)) {
            const item = matrix[y][x];
            item.free = false;
          }
        }
      }
    }

    for (const { x, y } of this.shots) {
      const item = matrix[y][x];
      item.shoted = true;

      if (item.ship) {
        item.wounded = true;
      }
    }

    this.#matrix = matrix;
    this.#changed = false;

    return this.#matrix;
  }

  get complete() {
    // если не все корабли на поле, то false
    if (this.ships.length !== 10) {
      return false;
    }

    // если хоть один корабль не на поле, то false
    for (const ship of this.ships) {
      if (!ship.placed) {
        return false;
      }

      return true;
    }
  }

  // лежат ли x и y в пределах игрового поля
  inField(x, y) {
    const isNumber = (n) => parseInt(n) === n && !isNaN(n) && ![Infinity, -Infinity].includes(n);

    if (!isNumber(x) || !isNumber(y)) {
      return false;
    }

    return 0 <= x && x < 10 && 0 <= y && y < 10;
  }

  addShip(ship, x, y) {
    if (this.ships.includes(ship)) {
      return false;
    }

    this.ships.push(ship);

    if (this.inField(x, y)) {
      const dx = ship.direction === 'row';
      const dy = ship.direction === 'column';

      let placed = true;

      for (let i = 0; i < ship.size; i++) {
        const cx = x + dx * i;
        const cy = y + dy * i;

        if (!this.inField(cx, cy)) {
          placed = false;
          break;
        }

        const item = this.matrix[cy][cx];

        if (!item.free) {
          placed = false;
          break;
        }
      }

      if (placed) {
        Object.assign(ship, { x, y })
      }
    }

    this.#changed = true;
    return true;
  }

  removeShip(ship) {
    if (!this.ships.includes(ship)) {
      return false;
    }

    const index = this.ships.indexOf(ship);
    this.ships.splice(index, 1);

    ship.x = null;
    ship.y = null;

    this.#changed = true;
    return true;
  }

  removeAllShips() {
    const ships = this.ships.slice();

    for (const ship of ships) {
      this.removeShip(ship);
    }

    return ships.length;
  }

  // добавление выстрела
  addShot(shot) {

    // перебираем все существующие выстрелы
    // проверяем их координаты
    // блокируем возможность стрелять в одну и ту же клетку
    for (const { x, y } of this.shots) {
      if (x === shot.x && y === shot.y) {
        return false;
      }
    }

    // добавляем в общий спиок выстрелов
    this.shots.push(shot);
    this.#changed = true;

    // актуальная версия матрицы
    const matrix = this.matrix;
    const { x, y } = shot;

    // если есть корабль в ячейке выстрела
    if (matrix[y][x].ship) {
      shot.setVariant('wounded');

      // пробегаемся по размеру корабля
      // узнаем убит он или нет
      const { ship } = matrix[y][x];
      const dx = ship.direction === 'row';
      const dy = ship.direction === 'column';

      // по умолчанию = убит
      let killed = true;

      // ищем палубу, которая не ранена
      for (let i = 0; i < ship.size; i++) {
        const cx = ship.x + dx * i;
        const cy = ship.y + dy * i;
        const item = matrix[cy][cx];

        // если не раненной палубы нет, то корабль убит
        if (!item.wounded) {
          killed = false;
          break;
        }
      }

      if (killed) {
        ship.killed = true;

        for (let i = 0; i < ship.size; i++) {
          const cx = ship.x + dx * i;
          const cy = ship.y + dy * i;

          const shot = this.shots.find(shot => shot.x === cx && shot.y === cy);
          shot.setVariant('killed');
        }
      }
    }

    this.#changed = true;
    return true;
  }

  // удаление выстрела
  removeShot(shot) {
    if (!this.shots.includes(shot)) {
      return false;
    }

    const index = this.shots.indexOf(shot);
    this.shots.splice(index, 1);

    this.#changed = true;
    return true;
  }

  removeAllShots() {
    const shots = this.shots.slice();

    for (const shot of shots) {
      this.removeShot(shot);
    }

    return shots.length;
  }

  randomize(ShipClass = Ship) {
    this.removeAllShips();

    // тип и количество кораблей
    for (let size = 4; size >= 1; size--) {
      for (let n = 0; n < 5 - size; n++) {
        const direction = getRandomFrom('row', 'column');
        const ship = new ShipClass(size, direction);

        while (!ship.placed) {
          const x = getRandomBetween(0, 9);
          const y = getRandomBetween(0, 9);

          this.removeShip(ship);
          this.addShip(ship, x, y);
        }
      }
    }
  }

  clear() {
    this.removeAllShots();
    this.removeAllShips();
  }
}
