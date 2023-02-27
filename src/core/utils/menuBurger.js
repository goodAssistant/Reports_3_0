class Menu {
  constructor(container) {
    this.container = container

    this.wrapperBurger = document.createElement('div')
    this.wrapperBurger.className = 'wrapper__burger'

    this.themesWrapper = document.createElement('div')
    this.themesWrapper.className = 'themes__wrapper'

    this.tablesMenuWrapper = document.createElement('div')
    this.tablesMenuWrapper.className = 'tables__menu__wrapper'

    this.tablesTotalMonth = document.createElement('div')
    this.tablesTotalMonth.className = 'tables__total__month'
  }

  renderBurgerMenu() {
    const menu = {
      welcome: 'Good Assistant: "Познакомимся?',
      change__table: 'Выбрать таблицу',
      change__theme: 'Сменить тему',
      total__month: 'Итоги за месяц',
      clear__data: 'Очистить все данные',
    }
    this.wrapperBurger.innerHTML = `
      <div class="menu__burger__header" onClick="openBurgerMenu(event)">
        <div class="mouse__over">
          Меню
        </div>
        <span></span>
      </div>
      <div class="nav" onClick="getClckMenuItems(event)">
        <div class="menu">
          ${Object.keys(menu).map(key => `
          <div class="menu__item">
            <a data-action=${key} href="#">
              ${menu[key]}
            </a>
          </div>
          `).join('')}
          <div class="release">
            Release 3.0 
          </div>
        </div>
      </div>
    `

    this.container.append(this.wrapperBurger)
  }

  renderThemesMenu() {
    const themes = {
      black__purple:'Black - purple',
      milk: 'Milk',
      blue__yellow: 'Blue - yellow',
      street__ball: 'Street basketball',
      road: 'Road'
    }
    this.themesWrapper.innerHTML = `
      <h4 class="themes__title">Выбери тему:</h4>
      <div class="wrapperThemesMenu" onClick="getChangeThemes(event)">
        ${Object.keys(themes).map(key => `
        <div class="menu__item">
          <a href="#" data-theme=${key}>${themes[key]}</a>
        </div>
        `).join('')}
    `
    this.container.append(this.themesWrapper)
  }

  getAndDeleteThemesMenu(){
    if(Array.from(this.container.children).some(elem => elem.className.includes('themes__wrapper'))) {
      setTimeout(() => {this.themesWrapper.remove()}, 800)
      setTimeout(() => {this.themesWrapper.classList.remove('open')}, 0)
    }else {
      menuBurger.renderThemesMenu()
      setTimeout(() => {this.themesWrapper.classList.add('open')}, 0)
    }
  }

  renderTablesMenu(selector, arr) {
    if(selector) this.tablesMenuWrapper.classList.add(selector)
    else this.tablesMenuWrapper.classList.remove('getTotalMonths')
    this.tablesMenuWrapper.innerHTML = `
    <h4 class="themes__title">Выбери месяц:</h4>
    ${arr.map(elem => `
      <div class="menu__item" onClick="runItemTablesMenu(event)">
        <a class="menu__link" id=${elem.year}/${elem.month} href="#">
          ${elem.monthName} ${elem.year}
        </a>
      </div>`).join('')}
    `
    this.container.append(this.tablesMenuWrapper)
  }

  getAndDeleteTablesMenu(selector, arr){
    if(Array.from(this.container.children).some(elem => elem.className.includes('tables__menu__wrapper'))) {
      setTimeout(() => {this.tablesMenuWrapper.remove()}, 1000)
      setTimeout(() => {this.tablesMenuWrapper.classList.remove('open')}, 0)
    }else {
      menuBurger.renderTablesMenu(selector, arr)
      setTimeout(() => {this.tablesMenuWrapper.classList.add('open')}, 0)
    }
  }

  renderTotalMonth(rate) {
    const punctsTotal = [...puncts].splice(1, [...puncts].length - 2)
    const totalValues = Object.values(REPORTS[rate].values.sum)
    this.tablesTotalMonth.innerHTML = `
    <h4 class="month__name">${REPORTS[rate].monthName} ${REPORTS[rate].year}</h4>
    <table class="table__total">
      <tbody>
      ${punctsTotal.map((punct, idx) => `
        <tr>
          <th class="total__modal">
            ${punct}:
          </th>
          <td class="total__modal transitionFz">
            ${idx === 3 ? convertMinutesToHours(totalValues[idx]) : totalValues[idx]}
          </td>
        </tr>
        `).join('')}
      </tbody>
    </table>
    `
    imitationAlert(this.tablesTotalMonth.innerHTML, monthHTML)
  }
}

const menuBurger = new Menu(monthHTML.container)
menuBurger.renderBurgerMenu()

let menuBurgerHeader 

function openBurgerMenu({target}) {
  if(menuBurgerHeader = target.closest('.menu__burger__header')) {
    monthHTML.getAndDeleteOverlay( )
    menuBurgerHeader.classList.toggle('open')
  }
}

function getClckMenuItems(event) {
  event.preventDefault()
  const { target } = event
  switch(target.dataset.action) {
    case 'welcome':
      setInstructions()
      menuBurgerHeader.classList.remove('open')
    break
    case 'change__table':
      if(Object.keys(REPORTS).length === 1) {
        imitationAlert('У вас всего одна таблица)', monthHTML)
      }else {
        menuBurger.getAndDeleteTablesMenu('', Object.values(REPORTS))
      }
      menuBurgerHeader.classList.remove('open')
    break
    case 'change__theme':
      menuBurger.getAndDeleteThemesMenu()
      menuBurgerHeader.classList.remove('open')
    break
    case 'total__month':
      menuBurger.getAndDeleteTablesMenu('getTotalMonths', Object.values(REPORTS))
      menuBurgerHeader.classList.remove('open')
    break
    case 'clear__data':
      imitationConfirm(monthHTML, '<div style="display: flex; align-items: center"><div style="flex-shrink:200">Ты уверен, что желаешь очистить все данные без возможности восстановления?</div><span style="background: url(../assets/images/hmmm__smile.png)no-repeat center center / contain; width: 50px; height: 50px"></span></div>', clearLocalStorage)
      menuBurgerHeader.classList.remove('open')
    break
  }
}

function clearLocalStorage() {
  localStorage.clear()
  setTimeout(() => {location.reload()}, 500)
}