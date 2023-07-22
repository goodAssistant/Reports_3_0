let xStart, xEnd, yStart, yEnd;

function dragstart(event, item) {
  const { target, screenX, screenY } = event;
  xStart = screenX;
  yStart = screenY;

  target.classList.add('hold');

  setTimeout(() => {
    target.style.transition = 'opacity 0.2s ease-in-out 0s';
    target.style.opacity = '0';
  }, 0);
}

function dragend(event, item) {
  const getStartValueItemXY = (direction) =>
    +item.style[direction].split(/[a-z]+/g)[0];
  const { target, screenX, screenY } = event;
  xEnd = screenX;
  yEnd = screenY;

  target.classList.remove('hold');

  setTimeout(() => {
    target.style.opacity = '1';
  }, 0);
  setTimeout(
    () => (target.style.transition = 'opacity 1s ease-in-out 0s'),
    300
  );
  item.style.left = getStartValueItemXY('left') + (xEnd - xStart) + 'px';
  item.style.top = getStartValueItemXY('top') + (yEnd - yStart) + 'px';
}

const dragAndDrop = (item) => {
  item.addEventListener('dragstart', (event) => dragstart(event, item)); //dragstart - событие начала перетаскивания элемента.
  item.addEventListener('dragend', (event) => dragend(event, item)); //dragend - событие завершения перетаскивания элемента, т.е. срабатывает когда отпускаем левую кнопку мыши.
};
