/* функции частого использования */

// возвращает рандомное число
function getRandomBetween(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

// возвращает случайный элемент из агрументов, которые в него переданы
function getRandomFrom(...args) {
  const index = Math.floor(Math.random() * args.length);
  return args[index];
}

// возвращает true, если point находится над element
function isUnderPoint(point, element) {
  const { left, top, width, height } = element.getBoundingClientRect();
  const { x, y } = point;

  return left <= x & x <= left + width && top <= y && y <= top + height;
}

// навешивает обработчик события и возвращает функцию, которая снимает это событие
function addEventListener(element, ...args) {
  element.addEventListener(...args);
  return () => element.removeEventListener(...args);
}

// указывад сколько нужно забрать случайных элементов из массива
function getRandomSeveral(array = [], size) {
  array = array.slice();

  if (size > array.length) {
    size = arra.length;
  }

  const result = [];

  while (result.length < size) {
    const index = Math.floor(Math.random() * array.length);

    // берем один элемент в отдаем в result
    const item = array.splice(index, 1)[0];
    result.push(item);
  }

  return result;
}

