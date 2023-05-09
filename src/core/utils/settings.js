const tableVerticalOrientation = window.innerWidth < 500;

const addNextPrevButtonToHTML = (body) => {
  const containerButtons = document.createElement('div');
  containerButtons.className = 'wrapper_buttons hide';
  containerButtons.innerHTML = `<div class="wrapper wrapper_previous" data-page="previous" onclick="switchingBetweenTables(event)">
   <div class="buttons button_previous"></div>
  </div>
  <div class="wrapper wrapper_next" data-page="next" onclick="switchingBetweenTables(event)">
   <div class="buttons button_next"></div>
  </div>
 `;
  body.append(containerButtons);
};

function getDayOfWeek(data, numDay) {
  const dayOfWeek = new Date(
    `${+data.year}-${+data.month + 1}-${numDay}`
  ).getDay();
  return ["'Вс'", "'Пн'", "'Вт'", "'Ср'", "'Чт'", "'Пт'", "'Сб'"][dayOfWeek];
}

const renderTableHTML = (matrixMonth, data, selector) => {
  let thead;
  const wrapperTable = document.createElement('div');
  wrapperTable.className = selector;
  if (!tableVerticalOrientation)
    thead = matrixMonth.splice(0, 1).join('').split(',');
  const action = ['publ', 'video', 'pp', 'hours', 'iz'];
  const actionSum = ['publSum', 'videoSum', 'ppSum', 'hoursSum', 'izSum'];
  wrapperTable.innerHTML = `
  <h2 class="wrapper-table_title" data-key=${data.year}/${data.month}>${
    data.monthName
  } ${data.year}</h2>
  <table class="table">
  ${
    thead
      ? `<thead>
        <tr>
          ${thead
            .map((th, thIdx) => `<th class="days" id=${thIdx}>${th}</th>`)
            .join('')}
        </tr>
      </thead>`
      : ''
  }
    <tbody class="body_table">
    ${matrixMonth
      .map(
        (row, rowIdx) => `
    <tr>
      ${row
        .map((td, tdIdx) => {
          if (!tableVerticalOrientation) {
            if (tdIdx === 0) {
              return `<th class="action" data-action=${action[rowIdx]}>${td}</th>`;
            } else if (tdIdx === row.length - 1) {
              if (rowIdx === matrixMonth.length - 1) return `<th>${td}</th>`;
              return `<th class="sum" data-action=${actionSum[rowIdx]}>${td}</th>`;
            } else if (rowIdx === matrixMonth.length - 1) {
              if (tdIdx > 0 && tdIdx < row.length - 1) {
                return `<th class="btn_delete_values" id=${tdIdx} data-date="${tdIdx}" data-action="delete">${td}</th>`;
              }
            } else if (td === '') {
              return `<td class="cell ${action[rowIdx]}" id=${tdIdx} data-action=${action[rowIdx]} contenteditable="true">${td}</td>`;
            }
          } else {
            if (rowIdx === matrixMonth.length - 1) {
              if (tdIdx === row.length - 1) {
                return `<th>${td}</th>`;
              } else {
                return `<th class="sum" data-action=${actionSum[tdIdx]}>${td}</th>`;
              }
            } else if (
              rowIdx !== matrixMonth.length - 1 &&
              tdIdx === row.length - 1
            ) {
              return `<th class="btn_delete_values" id=${rowIdx} data-date="${rowIdx}" data-action="delete">${td}</th>`;
            } else {
              return `<td class="cell ${action[tdIdx]}" id=${rowIdx} data-action=${action[tdIdx]} contenteditable="true">${td}</td>`;
            }
          }
        })
        .join('')}
      </tr>`
      )
      .join('')}
    </tbody>
  </table>
 `;
  return wrapperTable;
};

const deleteValuesSpecificDay = (event, body, months) => {
  const key = body.querySelector('.wrapper-table_title').dataset.key,
    { target } = event;
  let monthName = months[key.split('/')[1]];
  let yearMonth = key.split('/')[0];
  if (target.dataset.action === 'delete') {
    if (REPORTS[key].values[target.id]) {
      const cellsDay = Array.from(body.querySelectorAll('td')).filter(
        (elem) => elem.id === target.id
      );

      imitationConfirm(
        monthHTML,
        `Вы уверены, что желаете очистить все значения в столбце за <span class="modal__data">${target.id}-ое число </span> <span class="modal__data">месяца ${monthName}</span> <span class="modal__data">${yearMonth} года</span>?`,
        deleteValuesIsLocalStorage,
        cellsDay,
        key,
        target
      );
    }
  }
};

function deleteValuesIsLocalStorage(cellsDay, key, target) {
  const { publSum, videoSum, ppSum, hoursSum, izSum, hoursSumTotal } =
    REPORTS[key].values['sum'];
  const { publ, video, pp, hours, iz } = REPORTS[key].values[target.id];
  const reports = REPORTS;

  reports[key].values['sum'] = {
    publSum: publSum - publ,
    videoSum: videoSum - video,
    ppSum: ppSum - pp,
    hoursSum: hoursSum - hours,
    izSum: izSum - iz,
    hoursSumTotal: hoursSumTotal - hours,
  };

  delete REPORTS[key].values[target.id];
  setToLocalStorage('reports', REPORTS);
  setTimeout(() => {
    document
      .querySelector(`[data-date="${target.id}"]`)
      .classList.remove('mustardSeed__icon1');
    document
      .querySelector(`[data-date="${target.id}"]`)
      .classList.remove('mustardSeed__icon2');
    pullValuesToTable(key.split('/')[0], key.split('/')[1]);
  }, 2100);
}

function getAndDeleteSlide(
  module,
  body,
  data,
  { year, month, selector, relay }
) {
  let currentSlide,
    newSlide,
    x = relay === 'next' ? '-102%' : '102%';
  numOfDays = numDaysOfMonth(year, month);
  newSlide = new module(body, data, selector);
  currentSlide = monthHTML.container.querySelector('.wrapper-table');
  currentSlide.querySelector('.wrapper_buttons').style.opacity = 0;

  setTimeout(() => {
    newSlide.render(year, month);
  }, 1000);
  setTimeout(() => {
    newSlide.slide.style.left = '0%';
    currentSlide.style.left = x;
  }, 1100);
  setTimeout(() => {
    currentSlide.style.opacity = '0';
  }, 2500);
  setTimeout(() => {
    currentSlide.remove();
    currentSlide.style.opacity = '1';
    newSlide.slide.className = 'slide wrapper-table';
    pullValuesToTable(year, month);
    setCurrentScrollInsertValue(new Date().getDate());
    const bodyTable = newSlide.slide.querySelector('.body_table');
    bodyTable.addEventListener('click', (event) => {
      getAndPushValuesForMonth(event);
      deleteValuesSpecificDay(
        event,
        document.querySelector('.container'),
        months
      );
    });
    newSlide.slide.querySelector('.wrapper_buttons').classList.remove('hide');
  }, 3100);
  drawContentBeforeTds(data[`${year}/${month}`]);
}

function getAndCheckCurrentYearAndMonth(data, year, month, relay) {
  let currentYear, currentMonth;
  let monthsTables = Object.keys(data).slice(1);
  let idx = monthsTables.indexOf(`${year}/${month}`);
  if (relay === 'previous') {
    if (idx === 0) {
      currentYear = monthsTables.at(-1).split('/')[0];
      currentMonth = monthsTables.at(-1).split('/')[1];
    } else {
      currentYear = monthsTables[idx - 1].split('/')[0];
      currentMonth = monthsTables[idx - 1].split('/')[1];
    }
  } else {
    if (idx === monthsTables.length - 1) {
      currentYear = monthsTables.at(0).split('/')[0];
      currentMonth = monthsTables.at(0).split('/')[1];
    } else {
      currentYear = monthsTables[idx + 1].split('/')[0];
      currentMonth = monthsTables[idx + 1].split('/')[1];
    }
  }
  return {
    currentYear: currentYear,
    currentMonth: currentMonth,
  };
}

function moveModalWindow(obj, str = null, no_btn = false) {
  const { modalWindow, overlay } = obj;
  obj.renderModalwindow();
  if (!no_btn) {
    const noBtn = modalWindow.querySelector('.no__btn');
    noBtn.style.display = 'none';
  }
  const modalText = modalWindow.querySelector('.modal__text');
  modalText.innerHTML = str;
  if (modalWindow.classList.contains('open')) {
    setTimeout(() => {
      modalWindow.classList.remove('open');
    }, 0);
    setTimeout(() => {
      modalWindow.remove();
    }, 810);
  } else {
    setTimeout(() => {
      overlay.classList.add('open');
      modalWindow.classList.add('open');
    }, 20);
  }
}

function modalBtnYes(obj, str) {
  obj.modalWindow.querySelector('.yes__btn').onclick = function () {
    moveModalWindow(obj, str);
    monthHTML.getAndDeleteOverlay();
  };
}

function imitationAlert(str, obj) {
  moveModalWindow(obj, str);
  modalBtnYes(obj, str);
}

function imitationConfirm(obj, str, func, cells, key, target) {
  moveModalWindow(obj, str, true);
  let btns = obj.modalWindow.querySelector('.btns');
  btns.firstElementChild.onclick = function () {
    moveModalWindow(obj, str, true);
    func(cells, key, target);
    monthHTML.getAndDeleteOverlay();
  };
  btns.lastElementChild.onclick = function () {
    moveModalWindow(obj, str, true);
    monthHTML.getAndDeleteOverlay();
  };
}

function randomNum(min, max) {
  return Math.round(min - 0.5 + Math.random() * (max - min + 1));
}

let alpha = 0;
var startTime;

function getRandomColorRgba(elem, alpha) {
  const colors = {
    red: randomNum(0, 255),
    green: randomNum(0, 255),
    blue: randomNum(0, 255),
    elem: elem,
  };

  const { red, green, blue } = colors;

  elem.style.color = `rgba(${red}, ${green}, ${blue}, ${alpha})`;
  elem.style.setProperty(
    '--color-titleAfter',
    `rgb(${red}, ${green}, ${blue})`
  );
  elem.style.setProperty(
    '--shadow-titleAfter',
    `0 0 2px rgb(${red}, ${green}, ${blue}), 0 0 10px rgb(${red}, ${green}, ${blue})`
  );

  moveTwoElementsAfterAndBefore({
    elem: elem,
    animAF: '--animation-titleAfter',
    animBef: '--animation-titleBefore',
    borderAf: '--border-titleAfter',
    borderBef: '--border-titleBefore',
    none: 'none',
    border: '1px solid black',
    animStart: 'loadingStart 1.55s ease-out 0s 1 normal forwards',
    animFinish: 'loadingFinish 1.55s ease-out 0s 1 normal forwards',
  });

  const refreshId = setInterval(() => {
    alphaValueIncrement(refreshId, colors);
  }, 30);
}

function alphaValueDecrement(int, { red, green, blue, elem }) {
  if (alpha) {
    alpha = +((alpha * 100 - 1) / 100).toFixed(2);
    elem.style.color = `rgba(${red}, ${green}, ${blue}, ${alpha})`;
  } else {
    clearInterval(int);
    getRandomColorRgba(elem, alpha);
  }
}

function alphaValueIncrement(int, { red, green, blue, elem }) {
  if (alpha < 1) {
    alpha = +((alpha * 100 + 1) / 100).toFixed(2);
    elem.style.color = `rgba(${red}, ${green}, ${blue}, ${alpha})`;
  } else {
    clearInterval(int);
    const refreshId = setInterval(() => {
      alphaValueDecrement(refreshId, {
        red: red,
        green: green,
        blue: blue,
        elem: elem,
      });
    }, 30);
  }
}

function moveTwoElementsAfterAndBefore({
  elem,
  animAF,
  animBef,
  borderAf,
  borderBef,
  none,
  border,
  animStart,
  animFinish,
}) {
  setTimeout(() => {
    elem.style.setProperty(borderAf, border);
    elem.style.setProperty(animAF, animStart);
  }, 0);

  setTimeout(() => {
    setTimeout(() => {
      setTimeout(() => {
        elem.style.setProperty(borderBef, border);
        elem.style.setProperty(animBef, animFinish);
      }, 0);
      elem.style.setProperty(borderAf, none);
      elem.style.setProperty(animAF, none);
    }, 0);
  }, 1555);

  setTimeout(() => {
    elem.style.setProperty(animBef, animStart);
  }, 3100);

  setTimeout(() => {
    setTimeout(() => {
      elem.style.setProperty(borderAf, border);
      elem.style.setProperty(animAF, animFinish);
    }, 0);
    setTimeout(() => {
      elem.style.setProperty(borderBef, none);
      elem.style.setProperty(animBef, none);
    }, 0);
  }, 4650);
}

function getChangeTable(event) {
  event.preventDefault();
  const { target } = event;
  const year = +target.id.split('/')[0],
    month = +target.id.split('/')[1],
    objRelay = {
      year: year,
      month: month,
    };
  console.log(year === currentYear);
  console.log('currentYear:', currentYear);
  if (year === +currentYear) {
    console.log(1);
    if (month < currentMonth) {
      console.log(1.1);
      objRelay.selector = 'slide wrapper-table_previous previous';
      objRelay.relay = 'previous';
    } else {
      console.log(1.2);
      objRelay.selector = 'slide wrapper-table_next next';
      objRelay.relay = 'next';
    }
  } else if (year > currentYear) {
    console.log(2);
    objRelay.selector = 'slide wrapper-table_next next';
    objRelay.relay = 'next';
  } else if (year < currentYear) {
    console.log(3);
    objRelay.selector = 'slide wrapper-table_previous previous';
    objRelay.relay = 'previous';
  }
  currentYear = year;
  currentMonth = month;
  getAndDeleteSlide(MonthHTML, app, REPORTS, objRelay);
  console.log('objRelay:', objRelay);
  monthHTML.getAndDeleteOverlay();
  menuBurger.getAndDeleteTablesMenu();
}

function getTotalMonths(event) {
  event.preventDefault();
  const { target } = event;
  menuBurger.getAndDeleteTablesMenu();
  if (!Object.keys(REPORTS[target.id].values).length)
    imitationAlert('В этой таблице ещё нет данных)', monthHTML);
  else {
    menuBurger.renderTotalMonth(target.id, {
      repeat: false,
      totalYearInfo: false,
    });
  }
}

let targetYearSumValues;

function getTotalYear(event) {
  event.preventDefault();
  const { target } = event;
  menuBurger.getAndDeleteTablesMenu();
  REPORTS = getFromLocalStorage('reports');
  targetYearSumValues = Object.values(REPORTS).reduce((acc, item) => {
    if (+item.year === +target.id) {
      if (item.values.sum) acc.push(item.values.sum);
    }
    return acc;
  }, []);

  if (!targetYearSumValues.length)
    imitationAlert('Я не нашёл данных за этот год.', monthHTML);
  else
    menuBurger.renderTotalMonth(target.id, {
      repeat: false,
      totalYearInfo: true,
    });
}

function getYearSumValues() {
  const result = {};
  targetYearSumValues.forEach((obj) => {
    Object.keys(obj).forEach((key) => {
      if (!result[key]) result[key] = 0;
      result[key] += obj[key];
    });
  });
  return result;
}

function getAllYears(arr) {
  res = arr.reduce((acc, item) => {
    const el = item.split('/')[0];
    if (acc.length) !acc.includes(el) && acc.push(el);
    else acc.push(el);
    return acc;
  }, []);
  return res.sort((a, b) => a - b);
}

function runItemTablesMenu(event) {
  if (menuBurger.tablesMenuWrapper.className.includes('getTotalMonths')) {
    getTotalMonths(event);
  } else if (menuBurger.tablesMenuWrapper.className.includes('getTotalYear')) {
    getTotalYear(event);
  } else if (
    menuBurger.tablesMenuWrapper.className.includes('getChangeTable')
  ) {
    getChangeTable(event);
  }
}

function getChangeThemes(event) {
  event.preventDefault();
  const { target } = event;
  if (target.dataset.theme) {
    monthHTML.getAndDeleteOverlay();
    REPORTS.theme = target.dataset.theme;
    setToLocalStorage('reports', REPORTS);
    setTimeout(() => {
      monthHTML.container.closest(
        '.app'
      ).className = `app ${target.dataset.theme}`;
    }, 800);
    menuBurger.getAndDeleteThemesMenu();
  }
}

function drawDaysWeek(data) {
  const daysMonth = Array.from(document.querySelectorAll('.days'))
    .slice(1)
    .slice(0, -1);
  daysMonth.forEach((item) => {
    item.style.setProperty('--days-after', getDayOfWeek(data, item.id));
  });
}

function clearLocalStorage() {
  localStorage.clear();
  setTimeout(() => {
    location.reload();
  }, 500);
}

function getDataTransfer(event) {
  event.preventDefault();
  let newId;
  const { modalWindow } = monthHTML;
  const { target, submitter } = event;
  const value = target[0].value;
  const hours = value.split(':')[0] + ' ч ' + value.split(':')[1] + ' мин';
  const minutes = +convertHoursToMinutes(hours);
  const year = +target.id.split('/')[0];
  const month = +target.id.split('/')[1];

  function getAndDeleteData() {
    modalWindow.classList.remove('open');
    setTimeout(() => {
      modalWindow.remove();
      monthHTML.getAndDeleteOverlay();
    }, 300);
    setTimeout(() => {
      menuBurger.renderTotalMonth(target.id, {
        repeat: true,
        totalYearInfo: false,
      });
    }, 811);
  }

  if (submitter.name === 'dataTransfer') {
    const getData = (selector) => REPORTS[selector].values.sum;

    if (month === 11) {
      newId = [year + 1, 0].join('/');
    } else {
      newId = [year, month + 1].join('/');
    }
    if (!REPORTS[newId]) {
      monthHTML.addDataReports(newId.split('/')[0], newId.split('/')[1]);
      REPORTS = getFromLocalStorage('reports');
      getData(newId).hoursSumTransfer = 0;
    }

    getData(target.id).hoursSumTotal =
      getData(target.id).hoursSumTotal - minutes;

    getData(newId).hoursSumTransfer = getData(newId).hoursSumTransfer + minutes;
    getData(newId).hoursSumTotal = getData(newId).hoursSumTotal + minutes;

    getAndDeleteData();

    if (!monthHTML.container.querySelector('.wrapper_buttons')) {
      addNextPrevButtonToHTML(document.querySelector('.wrapper-table'));
      setTimeout(
        () =>
          document.querySelector('.wrapper_buttons').classList.remove('hide'),
        0
      );
    }

    setToLocalStorage('reports', REPORTS);
    const currentTable = monthHTML.container.querySelector(
      '.wrapper-table_title'
    );
    const currentYear = currentTable.dataset.key.split('/')[0];
    const currentMonth = currentTable.dataset.key.split('/')[1];
    pullValuesToTable(currentYear, currentMonth);
  } else if (submitter.name === 'dataTransferNo') {
    getAndDeleteData();
  }
}

function getAndDeleteCurrentDay(action) {
  let days;
  const currentDay = new Date().getDate();
  if (tableVerticalOrientation) {
    days = Array.from(monthHTML.container.querySelectorAll('.cell'));
    const targetCells = days.filter((item) => +item.id === currentDay - 1);
    if (action === 'add') {
      targetCells.forEach((cell) => {
        cell.classList.add('days_today');
      });
    } else if (action === 'remove') {
      targetCells.forEach((cell) => {
        cell.classList.remove('days_today');
      });
    }
  } else {
    days = Array.from(monthHTML.container.querySelectorAll('.days'));
    if (action === 'add') {
      days[currentDay].classList.add('days_today');
    } else if (action === 'remove') {
      days[currentDay].classList.remove('days_today');
    }
  }
}

function drawContentBeforeTds(data) {
  console.log('data:', data);
  const days = Array.from(monthHTML.container.querySelectorAll('.cell'));
  days.forEach((day) => {
    day.style.setProperty(
      '--beforeTds',
      `${getDayOfWeek(data, +day.id + 1)}" ${+day.id + 1} число"`
    );
  });
}
