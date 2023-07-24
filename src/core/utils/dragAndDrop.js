let xStart, xEnd, yStart, yEnd;

const getStartValueItemXY = (direction, item) =>
  +item.style[direction].split(/[a-z]+/g)[0];

function dragstart(event) {
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
  item.style.left = getStartValueItemXY('left', item) + (xEnd - xStart) + 'px';
  item.style.top = getStartValueItemXY('top', item) + (yEnd - yStart) + 'px';
}

function touchMove(event, item) {
  if (event.targetTouches.length == 1) {
    const touch = event.targetTouches[0];
    const { pageX, pageY, target } = touch;
    if (target.className.includes('title_table-drop-down')) {
      app.style.overflow = 'hidden';
      item.style.zIndex = '10000';
      item.style.left = pageX - item.clientWidth / 2 + 'px';
      item.style.top = pageY - 5 + 'px';
    }
  }
}

function touchEnd(event, item) {
  app.style.overflow = 'auto';
  item.style.zIndex = '2';
}

const dragAndDrop = (item) => {
  item.addEventListener('dragstart', (event) => dragstart(event)); //dragstart - событие начала перетаскивания элемента.
  item.addEventListener('dragend', (event) => dragend(event, item)); //dragend - событие завершения перетаскивания элемента, т.е. срабатывает когда отпускаем левую кнопку мыши.
  item.addEventListener('touchmove', (event) => touchMove(event, item));
  item.addEventListener('touchend', (event) => touchEnd(event, item));
};
