class Menu {
  constructor(container) {
    this.container = container;

    this.wrapperBurger = document.createElement('div');
    this.wrapperBurger.className = 'wrapper__burger';

    this.themesWrapper = document.createElement('div');
    this.themesWrapper.className = 'themes__wrapper';

    this.tablesMenuWrapper = document.createElement('div');
    this.tablesMenuWrapper.className = 'tables__menu__wrapper';
  }

  renderBurgerMenu() {
    const menu = {
      welcome: 'Good Assistant: "Познакомимся?',
      change__theme: 'Сменить тему',
      change__table: 'Выбрать таблицу',
      total__month: 'Итоги за месяц',
      total__year: 'Итоги за год',
      golden__retriever: 'Открыть тему...',
      admin_page: 'Страница администратора',
      clear__data: 'Очистить все данные',
      fast__entry: () => `
        <form class="menu__checkbox">
          <label class="fast__entry__switch" for="fast__entry__switch">
          </label>
          <input class="fast__entry__input" type="checkbox" id="fast__entry__switch" name="fast__entry" onclick="getFastEntry(event)">
          <span class="fast__entry__text">
            Вкл/выкл быстрый ввод часов
          </span>
        </form>`,
    };

    this.wrapperBurger.innerHTML = `
      <div class="menu__burger__header" onClick="openBurgerMenu(event)">
        <div class="mouse__over">
          Меню
        </div>
        <span></span>
      </div>
      <div class="nav" onClick="getClickMenuItems(event)">
        <div class="menu">
          ${Object.keys(menu)
            .map((key) =>
              typeof menu[key] === 'function'
                ? menu[key]()
                : `<div class="menu__item">
                    <a data-action=${key} href="#">
                      ${menu[key]}
                    </a>
                  </div>`
            )
            .join('')}
          <div class="release">
            ${RELEASE}
          </div>
        </div>
      </div>
    `;
    this.container.append(this.wrapperBurger);
  }

  renderThemesMenu() {
    const themes = {
      black__purple: 'Black - purple',
      milk: 'Milk',
      street__ball: 'Street basketball',
      on__style: 'On style',
      random__image: 'Random image',
    };
    this.themesWrapper.innerHTML = `
      <h4 class="themes__title">Выбери тему:</h4>
      <div class="wrapperThemesMenu" onClick="getChangeThemes(event)">
        ${Object.keys(themes)
          .map(
            (key) => `
        <div class="menu__item">
          <a href="#" data-theme=${key}>${themes[key]}</a>
        </div>
        `
          )
          .join('')}
    `;
    this.container.append(this.themesWrapper);
  }

  getAndDeleteThemesMenu() {
    if (
      Array.from(this.container.children).some((elem) =>
        elem.className.includes('themes__wrapper')
      )
    ) {
      setTimeout(() => {
        this.themesWrapper.remove();
      }, 800);
      setTimeout(() => {
        this.themesWrapper.classList.remove('active');
      }, 0);
    } else {
      menuBurger.renderThemesMenu();
      setTimeout(() => {
        this.themesWrapper.classList.add('active');
      }, 0);
    }
  }

  renderTablesMenu(selector, arr) {
    let totalYear = selector === 'getTotalYear';
    if (selector)
      this.tablesMenuWrapper.className = `tables__menu__wrapper ${selector}`;
    this.tablesMenuWrapper.innerHTML = `
    <h4 class="themes__title">${
      totalYear ? 'Выбери год:' : 'Выбери месяц:'
    }</h4>
    ${arr
      .map(
        (elem) => `
      <div class="menu__item" onClick="runItemTablesMenu(event)">
        <a class="menu__link" id=${
          totalYear ? elem : elem.year + '/' + elem.month
        } href="#">
          ${totalYear ? elem : elem.monthName + ' ' + elem.year}
        </a>
      </div>`
      )
      .join('')}
    `;
    this.container.append(this.tablesMenuWrapper);
    const height = window.innerHeight;
    if (height < 400) {
      this.tablesMenuWrapper.style.setProperty(
        '--tables-menu-wrapper',
        height - 50 + 'px'
      );
    }
  }

  getAndDeleteTablesMenu(selector, arr) {
    if (
      Array.from(this.container.children).some((elem) =>
        elem.className.includes('tables__menu__wrapper')
      )
    ) {
      setTimeout(() => {
        this.tablesMenuWrapper.remove();
      }, 1000);
      setTimeout(() => {
        this.tablesMenuWrapper.classList.remove('active');
      }, 0);
    } else {
      menuBurger.renderTablesMenu(selector, arr);
      setTimeout(() => {
        this.tablesMenuWrapper.classList.add('active');
      }, 0);
    }
  }

  renderTotalMonth(rate, { repeat, totalYearInfo }) {
    let totalValues;

    const orderedArray = [
      'publSum',
      'videoSum',
      'ppSum',
      'hoursSumTotal',
      'izSum',
    ];
    const totalYear = !rate.includes('/');
    if (totalYear) totalValues = getYearSumValues();
    else totalValues = REPORTS[rate].values.sum;
    const tableStr = `
    <h4 class="month__name">${
      totalYear
        ? 'Итоги за ' + rate + ' год'
        : REPORTS[rate].monthName + ' ' + REPORTS[rate].year
    }</h4>
    <table class="table__total">
      <tbody>
      ${orderedArray
        .map(
          (punct, idx) => `
        <tr>
          <th class="total__modal">
            ${punctsTotal[punct]}:
          </th>
          <td class="total__modal">
            ${
              idx === 3
                ? convertMinutesToHours(totalValues[punct])
                : totalValues[punct]
            }
          </td>
        </tr>
        `
        )
        .join('')}
      </tbody>
    </table>
    `;
    if (totalYearInfo) {
      imitationAlert(tableStr, monthHTML);
      return;
    }
    if (repeat) {
      imitationAlert(tableStr, monthHTML);
      return;
    }
    if (REPORTS[rate]) {
      const totalMinutes = REPORTS[rate].values.sum.hoursSumTotal;
      const totalTime = convertMinutesToHours(totalMinutes);

      let arrTime = totalTime.replace(/\s+[а-я]/g, '').split(' ');
      console.log('arrTime:', arrTime)
      const conditionForMinutes = arrTime.length > 1;
      const noValue = 0 + arrTime.join(':').slice(1);
      console.log('noValue:', noValue)

      const value =
      totalMinutes > 3000
          ? noValue
          : '00:' + noValue.split(':')[1];
          
      if (totalMinutes > 3000 || conditionForMinutes) {
        const template = `<form id=${rate} class="data_transfer_form" onsubmit="getDataTransfer(event)">
            <label for="dataTransfer" class="item_dataTransfer form-label">
              Ваше время составило: ${totalTime}
            </label>
            <div style="width:100%;     display: flex;
            flex-direction: column;" class="item_dataTransfer">
            <input
              type="time"
              class="dataTransfer_control"
              id="dataTransfer"
              aria-describedby="dataTransferHelp"
              value=${value}
              name="dataTransfer"
            />
              <button type="submit" class="dataTransfer_btn" name="dataTransfer">
            Перенести
          </button>
          <button type="submit" class="dataTransfer_btn" name="dataTransferNo">
          Не переносить
        </button>
          </div>
            <div id="dataTransferHelp" class="item_dataTransfer form-text">
              Чтобы перенести нужное вам количество часов или минут на следующий
              месяц укажите их и нажмите кнопку "Перенести", если не хотите переносить, то нажмите кнопку "Не переносить", чтобы выйти нажмите на мою рожицу)))
            </div>
          </form>`;
        imitationAlert(template, monthHTML);
      } else {
        imitationAlert(tableStr, monthHTML);
      }
    }
  }
}

const menuBurger = new Menu(monthHTML.container);
menuBurger.renderBurgerMenu();

let menuBurgerHeader;

function openBurgerMenu({ target }) {
  if (monthHTML.container.querySelector('.active')) return;
  if ((menuBurgerHeader = target.closest('.menu__burger__header'))) {
    monthHTML.getAndDeleteOverlay();
    menuBurgerHeader.classList.toggle('active');
  }
}

function getClickMenuItems(event) {
  event.preventDefault();
  const { target } = event;
  switch (target.dataset.action) {
    case 'welcome':
      setInstructions();
      menuBurgerHeader.classList.remove('active');
      break;
    case 'change__table':
      if (Object.keys(REPORTS).length === 1) {
        imitationAlert('У вас всего одна таблица)', monthHTML);
      } else {
        menuBurger.getAndDeleteTablesMenu(
          'getChangeTable',
          Object.values(REPORTS).slice(1)
        );
      }
      menuBurgerHeader.classList.remove('active');
      break;
    case 'change__theme':
      menuBurger.getAndDeleteThemesMenu();
      menuBurgerHeader.classList.remove('active');
      break;
    case 'total__month':
      menuBurger.getAndDeleteTablesMenu(
        'getTotalMonths',
        Object.values(REPORTS).slice(1)
      );
      menuBurgerHeader.classList.remove('active');
      break;
    case 'total__year':
      //const allYears = getAllYears([
      //  '2023/1',
      //  '2023/2',
      //  '2023/3',
      //  '2025/1',
      //  '2024/2',
      //  '2024/3',
      //  '2026/9',
      //  '2027/1',
      //  '2028/1',
      //  '2029/1',
      //  '2030/1',
      //  '2031/1',
      //  '2032/1',
      //  '2033/1',
      //  '2034/1',
      //  '2035/1',
      //  '2036/1',
      //  '2037/1',
      //  '2038/1',
      //  '2039/1',
      //  '2040/1',
      //  '2041/1',
      //  '2042/1',
      //]);
      const allYears = getAllYears(Object.keys(REPORTS).slice(1));
      menuBurger.getAndDeleteTablesMenu('getTotalYear', allYears);
      menuBurgerHeader.classList.remove('active');
      break;
    case 'golden__retriever':
      imitationConfirm(monthHTML, getInputRetriever(), startRetrieverTheme);
      menuBurgerHeader.classList.remove('active');
      break;
    case 'admin_page':
      imitationConfirm(monthHTML, getInputAdminPage(), startAdminPage);
      menuBurgerHeader.classList.remove('active');
      break;
    case 'clear__data':
      imitationConfirm(
        monthHTML,
        '<div style="display: flex; align-items: center"><div style="flex-shrink:200">Ты уверен, что желаешь очистить все данные без возможности восстановления?</div><span style="background: url(../assets/images/hmmm__smile.png)no-repeat center center / contain; width: 50px; height: 50px"></span></div>',
        localStorageService.clear
      );
      menuBurgerHeader.classList.remove('active');
      break;
  }
}
menuBurger.getAndDeleteTablesMenu(
        'getTotalMonths',
        Object.values(REPORTS).slice(1)
      );
