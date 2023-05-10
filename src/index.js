const app = document.querySelector('.app');

const getFromLocalStorage = (key, obj = '{}') =>
  JSON.parse(localStorage.getItem(key) || obj);

const setToLocalStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

let REPORTS = getFromLocalStorage('reports');
if (!Object.keys(REPORTS).length) REPORTS.theme = 'black__purple';
let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth();

//currentYear = 2023;
//currentMonth = 5;

const puncts = ['Число', 'Публ', 'Видео', 'ПП', 'Часы', 'Из', 'Очистить>>'];
const months = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
];

function numDaysOfMonth(year, month) {
  return new Date(+year, +month + 1, 0).getDate();
}

function range(count) {
  return Array.from({ length: count }, (v, i) => i + 1);
}

function chunk(arr, n) {
  let newArr = [];
  while (arr.length) {
    newArr.push(arr.splice(0, n));
  }
  return newArr;
}

function normalize(num, thead) {
  return thead.reduce((acc, el, idx) => {
    if (idx === 0) acc = [...acc, el, ...range(num), 'Итого'];
    else if (idx === thead.length - 1)
      acc = [...acc, el, ...Array(num).fill(''), '<<столбец'];
    else acc = [...acc, el, ...Array(num).fill(''), ''];
    return acc;
  }, []);
}

function normalizeVertical(num, thead) {
  let res;
  const theadSlice = thead
    .slice(1)
    .reduce((acc) => (acc = [...acc, ...Array(num).fill('')]), []);
  res = theadSlice.slice(1);
  res.push('<<Итого');
  return res;
}

class MonthHTML {
  constructor(body, data, selector) {
    this.body = body;
    this.data = data;
    this.selector = selector;

    this.container = document.createElement('div');
    this.container.className = 'container';

    this.title = document.createElement('h1');
    this.title.className = 'reports__title';

    this.modalWindow = document.createElement('div');
    this.modalWindow.className = 'modal__window';

    this.mustardSeedWrapper = document.createElement('div');
    this.mustardSeedWrapper.className = 'mustardSeed__wrapper';

    this.overlay = document.createElement('div');
    this.overlay.className = 'overlay';

    this.tableArr;
    this.slide;
  }

  render(year, month) {
    const monthDays = numDaysOfMonth(year, month);
    let matrixMonth;
    let numCells;
    if (tableVerticalOrientation) {
      matrixMonth = normalizeVertical(monthDays, puncts);
      numCells = 6;
    } else {
      matrixMonth = normalize(monthDays, puncts);
      numCells = monthDays + 2;
    }
    this.tableArr = chunk(matrixMonth, numCells);
    this.addDataReports(year, month);
    this.addToHTML(this.tableArr, this.data[`${year}/${month}`]);

    this.slide = this.body.querySelector('.' + this.selector.split(' ')[1]);
  }

  addToHTML(matrixMonth, data) {
    const globalContainer = document.querySelector('.container');
    if (!globalContainer) {
      this.container.innerHTML = this.addSlider();
      this.body.append(this.container);
      this.container
        .querySelector('.slider-track')
        .append(renderTableHTML(matrixMonth, data, this.selector));
    } else {
      globalContainer
        .querySelector('.slider-track')
        .append(renderTableHTML(matrixMonth, data, this.selector));
    }

    this.body.className = `app ${this.data.theme}`;

    if (tableVerticalOrientation) {
      drawContentBeforeTds(data);
      getAndDeleteGoTopBtn(this.container, this.container.closest('.app'));
    } else {
      drawDaysWeek(data);
    }

    if (Object.keys(this.data).length > 2) {
      setTimeout(() => {
        addNextPrevButtonToHTML(
          this.body.querySelector('.' + this.selector.split(' ')[1])
        );
      }, 1500);
      setTimeout(
        () =>
          this.body.querySelector('.wrapper_buttons').classList.remove('hide'),
        1600
      );
    }
  }

  addDataReports(year, month) {
    if (!Object.keys(this.data).some((el) => el === `${year}/${month}`)) {
      this.data[`${year}/${month}`] = {
        year: year,
        monthName: months[month],
        month: month,
        values: {
          sum: {
            publSum: 0,
            videoSum: 0,
            ppSum: 0,
            izSum: 0,
            hoursSum: 0,
            hoursSumTotal: 0,
          },
        },
      };
      setToLocalStorage('reports', this.data);
    }
  }

  addSlider() {
    return `
      <div class="current_table">
          <div class="slider">
              <div class="slider-list">
                  <div class="slider-track"></div>
              </div>
          </div>
      </div>
    `;
  }

  getMustardSeed({ counter1, counter2 }) {
    let hide1;
    let hide2;
    if (!counter1) hide1 = 'hide';
    if (!counter2) hide2 = 'hide';
    this.mustardSeedWrapper.innerHTML = `
      <div class="wrapper__counter ${hide1}">
        <div class="mustardSeed1"></div>
        <div class="mustardSeed__counter1">
      - ${counter1}
        </div>
      </div>
      <div class="wrapper__counter ${hide2}">
      <div class="mustardSeed2"></div>
        <div class="mustardSeed__counter2">
      - ${counter2}
        </div>
      </div>
    `;
    this.container
      .querySelector('.wrapper-table')
      .append(this.mustardSeedWrapper);
  }

  renderModalwindow() {
    this.modalWindow.innerHTML = `
      <div class="modal__text"></div>
      <div class="btns">
          <button class="modal__btn yes__btn"></button>
          <button class="modal__btn no__btn"></button>
      </div>
    `;
    this.container.append(this.modalWindow);
    this.container.append(this.overlay);
  }

  getReportsTitle() {
    this.title.textContent = 'Reports';
    this.container.append(this.title);
  }

  getAndDeleteOverlay() {
    if (
      Array.from(this.container.children).some((elem) =>
        elem.className.includes('overlay')
      )
    ) {
      setTimeout(() => {
        this.overlay.remove();
      }, 300);
      setTimeout(() => {
        this.overlay.classList.remove('open');
      }, 0);
    } else {
      this.container.append(this.overlay);
      setTimeout(() => {
        this.overlay.classList.add('open');
      }, 0);
      this.overlay.addEventListener('click', () => {
        document.querySelectorAll('.open').forEach((item) => {
          setTimeout(() => {
            if (!item.className.includes('menu__burger__header')) item.remove();
          }, 1000);
          setTimeout(() => {
            item.classList.remove('open');
          }, 0);
        });
      });
    }
  }
}

const monthHTML = new MonthHTML(app, REPORTS, 'slide wrapper-table');

function getMusteredSeed(year, month) {
  const rate = `${year}/${month}`;
  if (!Object.keys(REPORTS[rate].values).length) return;
  const values = REPORTS[rate].values;
  const arrDates = Object.keys(values).splice(0, Object.keys(values).length);
  arrDates.slice(0, arrDates.length - 1).forEach((day) => {
    if (values[day].hours >= 150) {
      monthHTML.container
        .querySelector(`[data-date="${day}"]`)
        ?.classList.remove('mustardSeed__icon2');
      monthHTML.container
        .querySelector(`[data-date="${day}"]`)
        ?.classList.add('mustardSeed__icon1');
    } else if (Object.values(values[day]).some((elem) => elem > 0)) {
      monthHTML.container
        .querySelector(`[data-date="${day}"]`)
        ?.classList.remove('mustardSeed__icon1');
      monthHTML.container
        .querySelector(`[data-date="${day}"]`)
        ?.classList.add('mustardSeed__icon2');
    }
  });
  monthHTML.getMustardSeed(getCounters());
}

function getCounters() {
  return {
    counter1: monthHTML.container.querySelectorAll('.mustardSeed__icon1')
      .length,
    counter2: monthHTML.container.querySelectorAll('.mustardSeed__icon2')
      .length,
  };
}

monthHTML.render(currentYear, currentMonth);
monthHTML.getReportsTitle();
pullValuesToTable(currentYear, currentMonth);
setCurrentScrollInsertValue(new Date().getDate());
const tdsHTML = monthHTML.container.querySelectorAll('td');

getRandomColorRgba(monthHTML.title, alpha);

function setCurrentScrollInsertValue(value) {
  const table = monthHTML.container.querySelector('table');
  if (tableVerticalOrientation) {
    document.querySelector('.app').scrollTop = 27 * value;
  } else {
    table.scrollLeft = 60 * value;
  }

  getAndDeleteCurrentDay();

  if (
    table.previousElementSibling.dataset.key ===
    `${new Date().getFullYear()}/${new Date().getMonth()}`
  ) {
    getAndDeleteCurrentDay('add');
  }
}

class Values {
  constructor(publ, video, pp, hours, iz, day) {
    this.publ = publ;
    this.video = video;
    this.pp = pp;
    this.hours = hours;
    this.iz = iz;
    this.day = day;
  }

  getValues(reports) {
    const data = reports[`${currentYear}/${currentMonth}`].values;
    if (!Object.keys(data).length) {
      data = {
        [this.day]: {
          publ: +this.publ,
          video: +this.video,
          pp: +this.pp,
          hours: +this.hours,
          iz: +this.iz,
        },
        sum: {
          publSum: this.publ,
          videoSum: this.video,
          ppSum: this.pp,
          hoursSum: data.sum.hoursSum + this.hours,
          izSum: this.iz,
          hoursSumTotal: data.sum.hoursSum + this.hours,
        },
      };
    } else {
      if (!data[this.day]) {
        data[this.day] = {
          publ: +this.publ,
          video: +this.video,
          pp: +this.pp,
          hours: +this.hours,
          iz: +this.iz,
        };
      } else {
        data[this.day] = {
          publ: +data[this.day]['publ'] + +this.publ,
          video: +data[this.day]['video'] + +this.video,
          pp: +data[this.day]['pp'] + +this.pp,
          hours: +data[this.day]['hours'] + +this.hours,
          iz: +data[this.day]['iz'] + +this.iz,
        };
      }
      data.sum = {
        ...data.sum,
        publSum: +data.sum['publSum'] + +this.publ,
        videoSum: +data.sum['videoSum'] + +this.video,
        ppSum: +data.sum['ppSum'] + +this.pp,
        hoursSum: +data.sum['hoursSum'] + +this.hours,
        izSum: +data.sum['izSum'] + +this.iz,
        hoursSumTotal: +data.sum['hoursSumTotal'] + +this.hours,
      };
    }
  }
}

function convertMinutesToHours(mins) {
  let hours = Math.trunc(mins / 60);
  let minutes = mins % 60;
  if (mins < 60) {
    return minutes + ' м';
  } else if (mins % 60 === 0) {
    return hours + ' ч';
  } else {
    return hours + ' ч ' + minutes + ' м';
  }
}

function convertHoursToMinutes(time) {
  let arrTime = time.split(/\b/g);
  if (isNaN(time.split(/\b/g)[0]) || time.search(/[A-Z]+/gi) + 1) {
    imitationAlert(
      '<div style="display: flex; align-items: center"><div style="flex-shrink:200">Дорогой друг, вводи данные пожалуйста на русской раскладке клавиатуры и первым символом ввода должно быть число. Формат принимаемых данных можно посмотреть в первом пункте меню.</div> <span style="background: url(../assets/images/hmmm__smile.png)no-repeat center center / contain; width: 50px; height: 50px"></span></div>',
      monthHTML
    );
    return;
  }
  if (time.indexOf('ч') > 0) {
    if (arrTime.length > 2) {
      return String(+arrTime[0] * 60 + +arrTime[2]);
    } else {
      return String(+arrTime[0] * 60);
    }
  } else if (time.indexOf('м') > 0) {
    return arrTime[0];
  } else if (arrTime.length === 1) {
    return time;
  }
}

let publValue = 0,
  videoValue = 0,
  ppValue = 0,
  hoursValue = 0,
  izValue = 0,
  day,
  btnDeleteChangeBackground,
  tdClick,
  arrCells = [];

function getAndPushValuesForMonth(event) {
  const btnsDelete = monthHTML.container.querySelectorAll('.btn_delete_values');
  const tds = monthHTML.container.querySelectorAll('td');
  const { target } = event;
  if (target.className.includes('cell')) {
    tdClick = target;
    target.textContent = '';
    arrCells.push(target);
    btnsDelete.forEach((elem) => {
      if (elem.id === target.id) {
        btnDeleteChangeBackground = elem;
        changeIconToDeleteButton(btnDeleteChangeBackground, 'ok');
        tds.forEach((elemTd) => {
          elemTd.onfocus = () => {
            if (target.id !== elemTd.id) {
              changeIconToDeleteButton(btnDeleteChangeBackground, 'delete');
              pullValuesToTable(currentYear, currentMonth);
            }
          };
        });
      }
    });
    target.onblur = () => {
      cellsTextContent();
    };
  }

  document.addEventListener('keydown', (event) => {
    const { keyCode } = event;
    if (keyCode === 13) {
      event.preventDefault();
      cellsTextContent();
      changeIconToDeleteButton(btnDeleteChangeBackground, 'delete');
      target.blur();
    }
  });

  function cellsTextContent() {
    let res = [];
    arrCells.forEach((el, idx) => {
      if (el.id === target.id) {
        day = target.id;
        let elem = el.textContent;
        switch (el.dataset.action) {
          case 'publ':
            publValue = elem;
            el.textContent = '';
            res.push(publValue);
            break;
          case 'video':
            videoValue = elem;
            el.textContent = '';
            res.push(videoValue);
            break;
          case 'pp':
            ppValue = elem;
            el.textContent = '';
            res.push(ppValue);
            break;
          case 'hours':
            hoursValue = convertHoursToMinutes(elem);
            el.textContent = '';
            res.push(hoursValue);
            break;
          case 'iz':
            izValue = elem;
            el.textContent = '';
            res.push(izValue);
            break;
        }

        if (idx === arrCells.length - 1 && !res.every((el) => el === '')) {
          if (res.some((el) => isNaN(el))) return;

          new Values(
            publValue,
            videoValue,
            ppValue,
            hoursValue,
            izValue,
            day
          ).getValues(REPORTS);
          setToLocalStorage('reports', REPORTS);
          arrCells = [];
          publValue = 0;
          videoValue = 0;
          ppValue = 0;
          hoursValue = 0;
          izValue = 0;
          pullValuesToTable(currentYear, currentMonth);
        }
      }
    });
  }
}

document.addEventListener('click', (event) => {
  if (
    monthHTML.container
      .querySelector('.wrapper_buttons')
      ?.contains(event.target)
  ) {
    return;
  } else if (btnDeleteChangeBackground) {
    if (
      !monthHTML.container
        .querySelector('.body_table')
        .contains(event.target) ||
      event.target === btnDeleteChangeBackground
    ) {
      changeIconToDeleteButton(btnDeleteChangeBackground, 'delete');
      pullValuesToTable(currentYear, currentMonth);
    }
  }
});

function changeIconToDeleteButton(elem, dataAction) {
  if (dataAction === 'delete') {
    elem.classList.remove('active');
    setTimeout(() => {
      elem.setAttribute('data-action', dataAction);
      elem.style.setProperty(
        '--after-delete-button',
        'url(../assets/images/delete.png) no-repeat center center / contain'
      );
    }, 0);
  } else if (dataAction === 'ok') {
    elem.classList.add('active');
    setTimeout(() => {
      elem.setAttribute('data-action', dataAction);
      elem.style.setProperty(
        '--after-delete-button',
        'url(../assets/images/after_ok.png) no-repeat center center/contain'
      );
    }, 0);
  }
}

document.querySelector('.body_table').addEventListener('click', (event) => {
  getAndPushValuesForMonth(event);
  deleteValuesSpecificDay(event, document.querySelector('.container'), months);
});

function pullValuesToTable(year, month) {
  const cells = monthHTML.container.querySelectorAll('.cell'),
    cellsSum = monthHTML.container.querySelectorAll('.sum'),
    data = REPORTS[`${year}/${month}`].values;

  for (let cell of cells) {
    if (data[cell.id]) {
      if (!data[cell.id][cell.dataset.action]) cell.textContent = '';
      else {
        if (cell.dataset.action === 'hours') {
          cell.textContent = convertMinutesToHours(
            data[cell.id][cell.dataset.action]
          );
        } else cell.textContent = data[cell.id][cell.dataset.action];
      }
    } else {
      cell.textContent = '';
    }
  }

  for (let cell of cellsSum) {
    if (!data.sum[cell.dataset.action]) cell.textContent = '';
    else {
      if (cell.dataset.action === 'hoursSum') {
        const beforeValue = convertMinutesToHours(
          data.sum[cell.dataset.action]
        );
        if (data.sum.hoursSumTransfer) {
          const afterValue =
            '+ ' + convertMinutesToHours(data.sum.hoursSumTransfer);

          cell.style.setProperty(
            '--afterHoursSumTransferText',
            `"${afterValue}"`
          );
        }
        cell.style.setProperty('--beforeHoursSum', `"${beforeValue}"`);
        cell.textContent = convertMinutesToHours(data.sum['hoursSumTotal']);
      } else cell.textContent = data.sum[cell.dataset.action];
    }
  }
  getMusteredSeed(year, month);
}

const switchingBetweenTables = (event) => {
  const { target } = event;
  let relay, objDate;
  if (target.className.includes('wrapper')) relay = target;
  if (target.className.includes('buttons')) relay = target.parentElement;
  switch (relay.dataset.page) {
    case 'previous':
      objDate = getAndCheckCurrentYearAndMonth(
        REPORTS,
        currentYear,
        currentMonth,
        relay.dataset.page
      );

      currentYear = objDate.currentYear;
      currentMonth = objDate.currentMonth;

      getAndDeleteSlide(MonthHTML, app, REPORTS, {
        year: currentYear,
        month: currentMonth,
        selector: 'slide wrapper-table_previous previous',
        relay: 'previous',
      });
      break;
    case 'next':
      objDate = getAndCheckCurrentYearAndMonth(
        REPORTS,
        currentYear,
        currentMonth,
        relay.dataset.page
      );

      currentYear = objDate.currentYear;
      currentMonth = objDate.currentMonth;

      getAndDeleteSlide(MonthHTML, app, REPORTS, {
        year: currentYear,
        month: currentMonth,
        selector: 'slide wrapper-table_next next',
        relay: 'next',
      });
      break;
  }
};

document.querySelector('.app').addEventListener('scroll', function () {
  const titleMonth = document.querySelector('.wrapper-table_title');

  if (document.querySelector('.app').scrollTop >= 30) {
    if (!document.querySelector('.sticky')) {
      const titleMonthAfter = document.createElement('h2');
      titleMonthAfter.className = 'wrapper-table_title after';
      titleMonthAfter.textContent = titleMonth.textContent;
      titleMonthAfter.style.marginTop = '5px';
      const div = document.createElement('div');
      div.className = 'sticky';
      document.querySelector('.app').append(div);
      div.append(titleMonthAfter);
      setTimeout(() => {
        div.style.height = '40px';
      }, 0);
    }
  } else {
    document.querySelector('.sticky')?.remove();
  }
});
