
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
        return `<th class="btn_delete_values" id=${tdIdx} data-action="delete">${td}</th>`
      }
      }else if(td === '') {
      return `<td class="cell ${action[rowIdx]}" id=${tdIdx} data-action = ${action[rowIdx]} contenteditable="true">${td}</td>`
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

const deleteValuesSpecificDay = (event, body) => {
  const key = body.querySelector('.wrapper-table_title').dataset.key,
  { target } = event
  if(target.dataset.action === 'delete') {
    const cellsDay = Array.from(body.querySelectorAll('td')).filter((elem => elem.id === target.id))
    cellsDay.forEach(elem => elem.style.fontSize = '0px')
    if(REPORTS[key].values[target.id]) {
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
        pullValuesToTable(key.split('/')[0], key.split('/')[1])
        cellsDay.forEach(elem => elem.style.fontSize = '16px')
    },2100)
    }
  }
}

function getAndDeleteSlide(module, body, data, year, month, selector, relay, currentDay) {
  let numOfDays,
    currentSlide,
    newSlide,
    x = relay === 'next' ? '-102%' : '102%' 
  numOfDays = numDaysOfMonth(year, month)

  newSlide = new module(body, data, selector)
  currentSlide = monthHTML.container.querySelector('.wrapper-table')
  currentSlide.querySelector('.wrapper_buttons').style.opacity = 0
  currentDay.style.transition = 'all 1s ease-out 0s'
  currentDay.classList.remove('days_today')
  currentSlide.querySelectorAll('td').forEach(elem => {
    elem.classList.remove('content')
    elem.style.fontSize  = '0'
  })

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
      deleteValuesSpecificDay(event, document.querySelector('.container'))
    })
    bodyTable.querySelectorAll('td').forEach(elem => {
      elem.classList.add('content')
      elem.style.fontSize = '16px'
    })
    newSlide.slide.querySelector('.wrapper_buttons').classList.remove('hide')
  }, 3100)
}

function getAndCheckCurrentYearAndMonth(data, year, month, functions, relay) {
  if(!data[[`${functions.funcYear(year, month)}/${functions.funcMonth(month)}`]]) {
    if(relay === 'previous') {
      return {
        currentYear: Object.keys(data).at(-1).split('/')[0],
        currentMonth: Object.keys(data).at(-1).split('/')[1]
      } 
    } else {
       return {
        currentYear: Object.keys(data)[0].split('/')[0],
        currentMonth: Object.keys(data)[0].split('/')[1]
      } 
    }
  }else {
    return {
      currentYear: functions.funcYear(year, month),
      currentMonth: functions.funcMonth(month)
    }
  }
}