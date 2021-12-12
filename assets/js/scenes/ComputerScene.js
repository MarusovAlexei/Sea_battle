/* сцена игры с ботом */

class ComputerScene extends Scene {

  // массив выстрелов, которые делать не надо (middle - 20, hard - 40)
  untouchables = [];

  playerTurn = true;
  status = null;
  removeEventListeners = [];

  // показывает чей ход
  init() {
    this.status = document.querySelector('.battlefield-status');
  }

  // управление началом и концом боя
  start(untouchables) {
    const { opponent } = this.app;

    // скрываем меню
    document
      .querySelectorAll('.app-actions')
      .forEach((element) => element.classList.add('hidden'));

    // показываем меню боя (чей ход и кнопку сдаться)
    document
      .querySelector('[data-scene="computer"]')
      .classList.remove('hidden');

    opponent.clear();
    opponent.randomize(ShipView);

    this.untouchables = untouchables;

    this.removeEventListeners = [];

    // находим кнопки сдаться и играть еще раз 
    const gaveupButton = document.querySelector('[data-action="gaveup"]');
    const againButton = document.querySelector('[data-action="again"]');

    gaveupButton.classList.remove('hidden');
    againButton.classList.add('hidden');

    // кнопка сдаться выводит в начальное меню
    this.removeEventListeners.push(
      addEventListener(gaveupButton, 'click', () => {
        this.app.start('preparation');
      })
    );

    // // кнопка играть снова выводит в начальное меню
    this.removeEventListeners.push(
      addEventListener(againButton, 'click', () => {
        this.app.start('preparation');
      })
    );
  }

  // когда переходим к следующей сцене удаляем обработчик
  stop() {
    for (const removeEventListener of this.removeEventListeners) {
      removeEventListener();
    }

    this.removeEventListeners = [];
  }

  // метод, ответственный за провдение логики в computer сцене
  update() {

    // получаем данные мышки, игрока и компьютера из приложения
    const { mouse, opponent, player } = this.app;

    // проверяем, проиграл ли кто-нибудь
    const isEnd = opponent.loser || player.loser;

    const cells = opponent.cells.flat();
    cells.forEach((cell) =>
      cell.classList.remove("battlefield-item__active"));

    // выводим результат игры
    if (isEnd) {
      if (opponent.loser) {
        this.status.textContent = "Вы выиграли!";
      } else {
        this.status.textContent = "Вы проиграли!";
      }

      // скрываем кнопку сдаться и показываем кнопку играть еще раз
      document.querySelector('[data-action="gaveup"]')
        .classList.add("hidden");

      document
        .querySelector('[data-action="again"]')
        .classList.remove("hidden");

      return;
    }

    if (isUnderPoint(mouse, opponent.table)) {
      const cell = cells.find(cell => isUnderPoint(mouse, cell));

      if (cell) {
        cell.classList.add('battlefield-item__active');

        if (this.playerTurn && mouse.left && !mouse.pLeft) {
          const x = parseInt(cell.dataset.x);
          const y = parseInt(cell.dataset.y);

          const shot = new ShotView(x, y);
          const result = opponent.addShot(shot);

          // если мы успешно добавили выстрел, значит ход переходит
          if (result) {
            this.playerTurn = shot.variant === 'miss' ? false : true;

          }
        }
      }
    }

    if (!this.playerTurn) {
      // генерация выстрела
      const x = getRandomBetween(0, 9);
      const y = getRandomBetween(0, 9);

      let inUntouchable = false;

      // входит ли клетка выстрела в список неприкасаемых клеток
      for (const item of this.untouchables) {
        if (item.x === x && item.y === y) {
          inUntouchable = true;
          break;
        }
      }

      // стреляем, если не попали в список неприкасаемых клеток
      if (!inUntouchable) {
        const shot = new ShotView(x, y);
        const result = player.addShot(shot);
        if (result) {
          this.playerTurn = shot.variant === 'miss' ? true : false;
        }
      }
    }

    if (this.playerTurn) {
      this.status.textContent = 'Ваш ход:';
    } else {
      this.status.textContent = 'Xод компьютера:';
    }
  }
}