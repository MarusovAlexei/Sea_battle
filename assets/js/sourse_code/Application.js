/* отвечает за работу всего приложения */

class Application {

  // объект - мышка
  mouse = null;

  // игроки
  player = null;
  opponent = null;

  // массив сцен и активная сцена
  scenes = {};
  activeScene = null;

  constructor(scenes = {}) {

    const mouse = new Mouse(document.body);

    // создаем игровые поля для игроков
    const player = new BattlefieldView(true);
    const opponent = new BattlefieldView(false);

    Object.assign(this, { mouse, player, opponent });

    document.querySelector('[data-side="player"]').append(player.root);
    document.querySelector('[data-side="opponent"]').append(opponent.root);

    // регистрируем все сцены из конструктора в массив
    for (const [sceneName, SceneClass] of Object.entries(scenes)) {
      this.scenes[sceneName] = new SceneClass(sceneName, this);
    }

    // вызываем у всех сцен init
    for (const scene of Object.values(this.scenes)) {
      scene.init();
    }

    // регистрируем вызов tick (вызывается под fps)
    requestAnimationFrame(() => this.tick());
  }

  // тик для мышки
  tick() {
    requestAnimationFrame(() => this.tick());

    if (this.activeScene) {
      this.activeScene.update();
    }

    this.mouse.tick();
  }

  // запускаем конкретную сцену
  start(sceneName, ...args) {

    // является ли сцена активной
    if (this.activeScene && this.activeScene.name === sceneName) {
      return false;
    }

    // есть ли уже такая сцена
    if (!this.scenes.hasOwnProperty(sceneName)) {
      return false;
    }

    // остановка текущей сцены
    if (this.activeScene) {
      this.activeScene.stop();
    }

    // запускаем необходимую сцену
    const scene = this.scenes[sceneName];
    this.activeScene = scene;
    scene.start(...args);

    return true;
  }
}




