class Menu {
  constructor(container) {
    this.container = container;

    this.wrapperBurger = document.createElement('div');
    this.wrapperBurger.className = 'wrapper__burger';

    this.themesWrapper = document.createElement('div');
    this.themesWrapper.className = 'themes__wrapper';

    this.tablesMenuWrapper = document.createElement('div');
    this.tablesMenuWrapper.className = 'tables__menu__wrapper';

    this.tablesTotalMonth = document.createElement('div');
    this.tablesTotalMonth.className = 'tables__total__month';
  }

  renderBurgerMenu() {
    const menu = {
      welcome: 'Good Assistant: "Познакомимся?',
      change__table: 'Выбрать таблицу',
      change__theme: 'Сменить тему',
      total__month: 'Итоги за месяц',
      total__year: 'Итоги за год',
      clear__data: 'Очистить все данные',
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
            .map(
              (key) => `
          <div class="menu__item">
            <a data-action=${key} href="#">
              ${menu[key]}
            </a>
          </div>
          `
            )
            .join('')}
          <div class="release">
            Release 3.0 
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
        this.themesWrapper.classList.remove('open');
      }, 0);
    } else {
      menuBurger.renderThemesMenu();
      setTimeout(() => {
        this.themesWrapper.classList.add('open');
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
        this.tablesMenuWrapper.classList.remove('open');
      }, 0);
    } else {
      menuBurger.renderTablesMenu(selector, arr);
      setTimeout(() => {
        this.tablesMenuWrapper.classList.add('open');
      }, 0);
    }
  }

  renderTotalMonth(rate) {
    let totalValues;
    const punctsTotal = [...puncts].splice(1, [...puncts].length - 2);
    let totalYear = !rate.includes('/');
    if (totalYear) totalValues = Object.values(getYearSumValues(rate));
    else totalValues = Object.values(REPORTS[rate].values.sum);
    this.tablesTotalMonth.innerHTML = `
    <h4 class="month__name">${
      totalYear
        ? 'Итоги за ' + rate + ' год'
        : REPORTS[rate].monthName + ' ' + REPORTS[rate].year
    }</h4>
    <table class="table__total">
      <tbody>
      ${punctsTotal
        .map(
          (punct, idx) => `
        <tr>
          <th class="total__modal">
            ${punct}:
          </th>
          <td class="total__modal">
            ${
              idx === 3
                ? totalYear
                  ? convertMinutesToHours(totalValues[idx])
                  : convertMinutesToHours(totalValues[idx]).split(' ')[0] + ' ч'
                : totalValues[idx]
            }
          </td>
        </tr>
        `
        )
        .join('')}
      </tbody>
    </table>
    `;
    imitationAlert(this.tablesTotalMonth.innerHTML, monthHTML);
  }
}

const menuBurger = new Menu(monthHTML.container);
menuBurger.renderBurgerMenu();

let menuBurgerHeader;

function openBurgerMenu({ target }) {
  if (monthHTML.container.querySelector('.open')) return;
  if ((menuBurgerHeader = target.closest('.menu__burger__header'))) {
    monthHTML.getAndDeleteOverlay();
    menuBurgerHeader.classList.toggle('open');
  }
}

function getClickMenuItems(event) {
  event.preventDefault();
  const { target } = event;
  switch (target.dataset.action) {
    case 'welcome':
      setInstructions();
      menuBurgerHeader.classList.remove('open');
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
      menuBurgerHeader.classList.remove('open');
      break;
    case 'change__theme':
      menuBurger.getAndDeleteThemesMenu();
      menuBurgerHeader.classList.remove('open');
      break;
    case 'total__month':
      menuBurger.getAndDeleteTablesMenu(
        'getTotalMonths',
        Object.values(REPORTS).slice(1)
      );
      menuBurgerHeader.classList.remove('open');
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
      menuBurgerHeader.classList.remove('open');
      break;
    case 'clear__data':
      imitationConfirm(
        monthHTML,
        '<div style="display: flex; align-items: center"><div style="flex-shrink:200">Ты уверен, что желаешь очистить все данные без возможности восстановления?</div><span style="background: url(../assets/images/hmmm__smile.png)no-repeat center center / contain; width: 50px; height: 50px"></span></div>',
        clearLocalStorage
      );
      menuBurgerHeader.classList.remove('open');
      break;
  }
}
