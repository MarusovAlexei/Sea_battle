//описывает работу приложения в различных режимах
class Scene {
  name = null;
  app = null;

  constructor(name, app) {
    Object.assign(this, { name, app })
  }

  init() { }

  start() { }

  update() { }

  stop() { }
}