
const addNextPrevButtonToHTML = body => {
 const containerButtons = document.createElement('div')
 containerButtons.className = 'wrapper_buttons hide'
 containerButtons.innerHTML = 
 `<div class="wrapper wrapper_previous" data-page="previous" onclick="switchingBetweenTables(event)">
   <div class="buttons button_previous"></div>
  </div>
  <div class="wrapper wrapper_next" data-page="next" onclick="switchingBetweenTables(event)">
   <div class="buttons button_next"></div>
  </div>
 `
 body.append(containerButtons)
}

const renderTableHTML = (matrixMonth, data, selector) => {
  const wrapperTable = document.createElement('div')
  wrapperTable.className = selector
  const thead = matrixMonth.splice(0, 1).join('').split(',')
  const action = ['publ', 'video', 'pp', 'hours', 'iz']
  const actionSum = ['publSum', 'videoSum', 'ppSum', 'hoursSum', 'izSum']
  wrapperTable.innerHTML =
 `
  <h2 class="wrapper-table_title" data-key=${data.year}/${data.month}>${data.monthName} ${data.year}</h2>
  <table>
    <thead>
    <tr>
      ${thead.map((th, thIdx) => `<th class="days"id=${thIdx}>${th}</th>`).join('')}
    </tr>
    </thead>
    <tbody class="body_table">
    ${matrixMonth.map((row, rowIdx) => `
    <tr>
      ${row.map((td, tdIdx) => {
      if(tdIdx === 0) {
      return `<th class="action" data-action=${action[rowIdx]}>${td}</th>`
      }else if(tdIdx === row.length - 1) {
        if(rowIdx === matrixMonth.length - 1) return `<th>${td}</th>`
      return `<th class="sum" data-action=${actionSum[rowIdx]}>${td}</th>`
      }else if(rowIdx === matrixMonth.length - 1) {
      if(tdIdx > 0 && tdIdx < row.length - 1) {
        return `<th class="btn_delete_values" id=${tdIdx} data-date="${tdIdx}" data-action="delete">${td}</th>`
      }
      }else if(td === '') {
      return `<td class="cell ${action[rowIdx]}" id=${tdIdx} data-action=${action[rowIdx]} contenteditable="true">${td}</td>`
      }}).join('')}
      </tr>`).join('')}
    </tbody>
  </table>
 `
 return wrapperTable
}

function getPrevYear(year, month) {
	if(month === 0) {
		return --year
	}else {
		return year
	}
}

function getNextYear(year, month) {
	if(month === 11) {
		return ++year
	}else {
		return year
	}
}

function getPrevMonth(month) {
	if(month === 0) {
		return 11
	}else {
		return --month
	}
}

function getNextMonth(month) {
	if(month === 11) {
		return 0
	}else {
		return ++month
	}
}

const deleteValuesSpecificDay = (event, body, months) => {
  const key = body.querySelector('.wrapper-table_title').dataset.key,
  { target } = event
  let monthName = months[key.split('/')[1]]
  let yearMonth = key.split('/')[0]
  if(target.dataset.action === 'delete') {
    if(REPORTS[key].values[target.id]) {
      const cellsDay = Array.from(body.querySelectorAll('td')).filter((elem => elem.id === target.id))

      imitationConfirm(monthHTML, `Вы уверены, что желаете очистить все значения в столбце за <span class="modal__data">${target.id}-ое число </span> <span class="modal__data">месяца ${monthName}</span> <span class="modal__data">${yearMonth} года</span>?`, deleteValuesIsLocalStorage, cellsDay, key, target)
    }
  }
}

function deleteValuesIsLocalStorage(cellsDay, key, target) {
  cellsDay.forEach(elem => elem.style.fontSize = '0px')

  const {publSum, videoSum, ppSum, hoursSum, izSum} = REPORTS[key].values['sum']
  const {publ, video, pp, hours, iz} = REPORTS[key].values[target.id]
  const reports = REPORTS

  reports[key].values['sum'] = {
    publSum: publSum - publ,
    videoSum: videoSum - video,
    ppSum: ppSum - pp,
    hoursSum: hoursSum - hours,
    izSum: izSum - iz 
  }

  delete REPORTS[key].values[target.id]
  setToLocalStorage('reports', REPORTS)
  setTimeout(() => {
    monthHTML.slide.querySelector(`[data-date="${target.id}"]`).classList.remove('mustardSeed__icon1')
    monthHTML.slide.querySelector(`[data-date="${target.id}"]`).classList.remove('mustardSeed__icon2')
    pullValuesToTable(key.split('/')[0], key.split('/')[1])
    //cellsDay.forEach(elem => elem.style.fontSize = '16px')
  }, 2100)
}

function getAndDeleteSlide(module, body, data, {year, month, selector, relay}, currentDay) {
  let currentSlide,
    newSlide,
    x = relay === 'next' ? '-102%' : '102%' 
  numOfDays = numDaysOfMonth(year, month)
  newSlide = new module(body, data, selector)
  currentSlide = monthHTML.container.querySelector('.wrapper-table')
  currentSlide.querySelector('.wrapper_buttons').style.opacity = 0
  currentDay.style.transition = 'all 1s ease-out 0s'
  currentDay.classList.remove('days_today')
  //currentSlide.querySelector('.wrapper-table_title').classList.remove('transitionFz')
  //currentSlide.querySelectorAll('td').forEach(elem => {
  //  elem.classList.remove('transitionFz')
  //})

  setTimeout(() => {
    newSlide.render(year, month)
  }, 1000)
  setTimeout(() => {
    newSlide.slide.style.left = '0%'
    currentSlide.style.left = x
  }, 1100)
  setTimeout(() => {
    currentSlide.style.opacity = '0'
  }, 2500)
  setTimeout(() => {
    currentSlide.remove()
    currentSlide.style.opacity = '1'
    newSlide.slide.className = 'slide wrapper-table'
    pullValuesToTable(year, month)
    setCurrentScrollInsertValue(new Date().getDate())
    const bodyTable = newSlide.slide.querySelector('.body_table')
    bodyTable.addEventListener('click', event => {
      getValuesForMonth(event)
      deleteValuesSpecificDay(event, document.querySelector('.container'), months)
    })
    //bodyTable.querySelectorAll('td').forEach(elem => {
    //  elem.classList.add('transitionFz')
    //})
    //newSlide.slide.querySelector('.wrapper-table_title').classList.add('transitionFz')
    newSlide.slide.querySelector('.wrapper_buttons').classList.remove('hide')
  }, 3100)
}

function getAndCheckCurrentYearAndMonth(data, year, month, functions, relay) {
  let rate
  if(!data[[`${functions.funcYear(year, month)}/${functions.funcMonth(month)}`]]) {
    if(relay === 'previous') rate = Object.keys(data).length - 1
    else rate = 1
    return {
      currentYear: Object.keys(data)[rate].split('/')[0],
      currentMonth: Object.keys(data)[rate].split('/')[1]
    }
  }else {
    return {
      currentYear: functions.funcYear(year, month),
      currentMonth: functions.funcMonth(month)
    }
  }
}

function moveModalWindow(obj, str = null, no_btn = false) {
  const {modalWindow, overlay} = obj
  obj.renderModalwindow()
  if(!no_btn) {
    const noBtn = modalWindow.querySelector('.no__btn')
    noBtn.style.display = 'none'
  }
  const modalText = modalWindow.querySelector('.modal__text')
  modalText.innerHTML = str
  if(modalWindow.classList.contains('open')) {
    setTimeout(() => {
      modalWindow.classList.remove('open')
    }, 0)
    setTimeout(() => {
      modalWindow.remove()
    }, 810)
  }else {
    setTimeout(() => {
      overlay.classList.add('open')
      modalWindow.classList.add('open')
    }, 0)
  }
}

function modalBtnYes(obj, str) {
  obj.modalWindow.querySelector('.yes__btn').onclick = function() {
    moveModalWindow(obj, str)
    monthHTML.getAndDeleteOverlay()
  }
}

function imitationAlert(str, obj) {
  moveModalWindow(obj, str)
  modalBtnYes(obj, str)
}

function imitationConfirm(obj, str, func, cells, key, target) {
  moveModalWindow(obj, str, true)
  let btns = obj.modalWindow.querySelector('.btns')
  btns.firstElementChild.onclick = function() {
    moveModalWindow(obj, str, true)
    func(cells, key, target)
    monthHTML.getAndDeleteOverlay()
  }
  btns.lastElementChild.onclick = function() {
    moveModalWindow(obj, str, true)
    monthHTML.getAndDeleteOverlay()
  }
}

function randomNum(min, max) {
  return Math.round(min - 0.5 + Math.random() * (max - min + 1))
}

let alpha = 0
var startTime 

function getRandomColorRgba(elem, alpha) {
  const colors = {
    red: randomNum(0, 255),
    green: randomNum(0, 255),
    blue : randomNum(0, 255),
    elem: elem
  }

  const {red, green, blue} = colors

  elem.style.color = `rgba(${red}, ${green}, ${blue}, ${alpha})`
  elem.style.setProperty('--color-titleAfter', `rgb(${red}, ${green}, ${blue})`)
  elem.style.setProperty('--shadow-titleAfter', `0 0 2px rgb(${red}, ${green}, ${blue}), 0 0 10px rgb(${red}, ${green}, ${blue})`)
  
  moveTwoElementsAfterAndBefore({
    elem: elem,
    animAF: '--animation-titleAfter',
    animBef: '--animation-titleBefore',
    borderAf: '--border-titleAfter',
    borderBef: '--border-titleBefore',
    none: 'none',
    border: '1px solid black',
    animStart: 'loadingStart 1.55s ease-out 0s 1 normal forwards',
    animFinish:'loadingFinish 1.55s ease-out 0s 1 normal forwards'
  })
 
  const refreshId = setInterval(() => {alphaValueIncrement(refreshId, colors)}, 30)
}

function alphaValueDecrement(int, {red, green, blue, elem}) {
  if(alpha) {
    alpha = + ((alpha * 100 - 1) / 100).toFixed(2)
    elem.style.color = `rgba(${red}, ${green}, ${blue}, ${alpha})`
  }else {
    clearInterval(int)
    getRandomColorRgba(elem, alpha)
  }
}

function alphaValueIncrement(int, {red, green, blue, elem}) {
  if(alpha < 1) {
    alpha = + ((alpha * 100 + 1) / 100).toFixed(2)
    elem.style.color = `rgba(${red}, ${green}, ${blue}, ${alpha})`
  }else {
    clearInterval(int)
    const refreshId = setInterval(() => {alphaValueDecrement(refreshId, {red: red, green: green, blue: blue, elem: elem})}, 30)
  }
}

function moveTwoElementsAfterAndBefore({elem,
  animAF,
  animBef,
  borderAf,
  borderBef,
  none,
  border,
  animStart,
  animFinish
}) {

  setTimeout(() => {
    elem.style.setProperty(borderAf,  border)
    elem.style.setProperty(animAF,  animStart)
  }, 0)
  
  setTimeout(() => {
    setTimeout(() => {
      setTimeout(() => {
        elem.style.setProperty(borderBef,  border)
        elem.style.setProperty(animBef,  animFinish)
      }, 0)
      elem.style.setProperty(borderAf,  none)
      elem.style.setProperty(animAF,  none)
    }, 0)
  }, 1555)

  setTimeout(() => {
    elem.style.setProperty(animBef,  animStart)
  }, 3100)

  setTimeout(() => {
    setTimeout(() => {
      elem.style.setProperty(borderAf,  border)
      elem.style.setProperty(animAF,  animFinish)
    }, 0)
    setTimeout(() => {
      elem.style.setProperty(borderBef,  none)
      elem.style.setProperty(animBef,  none)
    }, 0)
  }, 4650)
}

function getChangeTable(event) {
  event.preventDefault()
  const { target } = event
  const year = + target.id.split('/')[0],
    month = + target.id.split('/')[1],
    objRelay = {
    year: year ,
    month: month
  }
  if(year === currentYear) {
    if(month < currentMonth) {
      objRelay.selector = 'slide wrapper-table_previous previous'
      objRelay.relay = 'previous'
    } else {
      objRelay.selector = 'slide wrapper-table_next next'
      objRelay.relay = 'next'
    }
  }else if(year > currentYear) {
    objRelay.selector = 'slide wrapper-table_next next'
    objRelay.relay = 'next'
  } else if(year < currentYear) {
    objRelay.selector = 'slide wrapper-table_previous previous'
    objRelay.relay = 'previous'
  }
  currentYear = year
  currentMonth = month
  getAndDeleteSlide(MonthHTML, app, REPORTS, objRelay, currentDayBackground)
  monthHTML.getAndDeleteOverlay()
  menuBurger.getAndDeleteTablesMenu()
}

function getTotalMonths(event) {
  event.preventDefault()
  const { target } = event
  menuBurger.getAndDeleteTablesMenu()
  if(!Object.keys(REPORTS[target.id].values).length) imitationAlert('В этой таблице ещё нет данных)', monthHTML)
  else menuBurger.renderTotalMonth(target.id)
}

function runItemTablesMenu(event) {
  if(menuBurger.tablesMenuWrapper.className.includes('getTotalMonths')) {
    getTotalMonths(event)
  }else {
    getChangeTable(event)
  }
}

function getChangeThemes(event) {
  event.preventDefault()
  const { target } = event 
  if(target.dataset.theme) {
    monthHTML.getAndDeleteOverlay()
    REPORTS.theme = target.dataset.theme
    setToLocalStorage('reports', REPORTS)
    setTimeout(() => {
      monthHTML.container.closest('.app').className = `app ${target.dataset.theme}`
    }, 800)
    menuBurger.getAndDeleteThemesMenu()
  }
}