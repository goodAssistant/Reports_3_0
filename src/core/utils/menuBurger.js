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
    this.wrapperBurger.innerHTML = `
      <div class="menu__burger__header" onClick="openBurgerMenu(event)">
        <div class="mouse__over">
          Меню
        </div>
        <span></span>
      </div>
      <div class="nav" onClick="getClckMenuItems(event)">
        <div class="menu">
          <div class="menu__item">
            <a data-action="welcome" href="#">
              Good Assistant: "Познакомимся?"
            </a>
          </div>
          <div class="menu__item">
            <a data-action="change__table" href="#">
              Выбрать таблицу
            </a>
          </div>
          <div class="menu__item">
            <a data-action="change__theme" href="#">
              Сменить тему
            </a>
          </div>
          <div class="menu__item">
            <a data-action="total__month" href="#">
              Итоги за месяц
            </a>
          </div>
          <div class="menu__item">
            <a data-action="clear__data" href="#">
              Очистить все данные
            </a>
          </div>
          <div class="release">
            Release 2.2
          </div>
        </div>
      </div>
    `

    this.container.append(this.wrapperBurger)
  }

  renderThemesMenu() {
    this.themesWrapper.innerHTML = `
      <h4 class="themes__title">Выбери тему:</h4>
      <div class="wrapperThemesMenu" onClick="getChangeThemes(event)">
      <div class="menu__item">
          <a href="#" data-theme="black__purple">Black - purple</a>
        </div>
        <div class="menu__item">
          <a href="#" data-theme="milk">Milk</a>
        </div>
        <div class="menu__item">
          <a href="#" data-theme="blue__yellow">Blue - yellow</a>
          </div>
          <div class="menu__item">
          <a href="#" data-theme="street__ball">Street basketball</a>
          </div>
        <div class="menu__item">
        <a href="#" data-theme="road">Road</a>
        </div>
        </div>
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
      localStorage.clear()
      setTimeout(() => {location.reload()}, 500)
      menuBurgerHeader.classList.remove('open')
    break
  }
}