//отвечает за все приложение
class Application {
  mouse = null;

  player = null;
  opponent = null;

  scenes = {};
  activeScene = null;

  constructor(scenes = {}) {
    const mouse = new Mouse(document.body);
    const player = new BattlefieldView();
    const opponent = new BattlefieldView();

    Object.assign(this, { mouse, player, opponent });

    document.querySelector('[data-side="player"]').append(player.root);
    document.querySelector('[data-side="opponent"]').append(opponent.root);

    // регистрируем все сцены из конструктора вмассив
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

  tick() {
    requestAnimationFrame(() => this.tick());

    if (this.activeScene) {
      this.activeScene.update();
    }

    this.mouse.tick();
  }

  // запускаем сцены с предварительными проверками
  start(sceneName) {

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

    //запускаем необходимую сцену
    const scene = this.scenes[sceneName];
    this.activeScene = scene;
    scene.start();

    return true;
  }
}




