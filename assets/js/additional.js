// функции частого использования
function getRandomBetween(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1))
};

function getRandomFrom(...args) {
  const index = Math.floor(Math.random() * args.length);
  return args[index];
};

function isUnderPoint(point, element) {
  const { left, top, width, height } = element.getBoundingClientRect();
  const { x, y } = point;

  return left <= x & x <= left + width && top <= y && y <= top + height;
}

// навешивает обработчик события и возвращает функцию, которая снимает это событие
function addEventListener(element, ...args) {
  element.addEventListener(...args)
  return () => element.removeEventListener(...args);
}