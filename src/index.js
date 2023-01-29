const app = document.querySelector('.app')

const getFromLocalStorage = (key, obj = '{}') => JSON.parse(localStorage.getItem(key) || obj)

const setToLocalStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data))
}

let REPORTS = getFromLocalStorage('reports')

let currentYear = new Date().getFullYear()
let currentMonth = new Date().getMonth()

// currentYear = 2024
// currentMonth = 4

const puncts = ['Число', 'Публ', 'Видео', 'ПП', 'Часы', 'Из', 'Очистить»']
const months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']

function numDaysOfMonth(year, month) {
	return new Date(year, month + 1, 0).getDate()
}

function range(count) {
    return Array.from({length: count}, (v, i) => i + 1)
}

function chunk(arr, n) {
    let newArr = []
    while(arr.length) {
        newArr.push(arr.splice(0, n))
    }
    return newArr
}

function normalize(num, thead) {
    return thead.reduce((acc, el, idx) => {
        if(idx === 0) acc =  [...acc, el, ...range(num), 'Итого']
        else if(idx === thead.length - 1) acc = [...acc, el, ...Array(num).fill(''), '«столбец']
        else acc =  [...acc, el, ...Array(num).fill(''), '']
        return acc
    }, [])
}

class MonthHTML {
    constructor(body, data, selector) {
        this.body = body
        this.data = data
        this.selector = selector
        
        this.container = document.createElement('div')
        this.container.className = 'container'
        this.tableArr
        this.slider = document.createElement('div')
        this.slide 
    }

    render(year, month) {
        const monthDays = numDaysOfMonth(year, month)
        this.tableArr = normalize(monthDays, puncts)

        this.tableArr = chunk(this.tableArr, monthDays + 2)
        this.addDataReports(year, month)
        this.addToHTML(this.tableArr, this.data[`${currentYear}/${currentMonth}`])
        this.slide = this.body.querySelector('.' + this.selector.split(' ')[1])
    }

    addToHTML(matrixMonth, data) {
        const globalContainer = document.querySelector('.container')
        if(!globalContainer) {
            this.container.innerHTML = this.addSlider()
            this.body.append(this.container)
            this.container.querySelector('.slider-track').append(renderTableHTML(matrixMonth, data, this.selector))
        } else {
            globalContainer.querySelector('.slider-track').append(renderTableHTML(matrixMonth, data, this.selector))
        }

        if(Object.keys(this.data).length > 1) {
            setTimeout(() => {
            addNextPrevButtonToHTML(this.body.querySelector('.' + this.selector.split(' ')[1]))
        }, 1500)
        setTimeout(() => this.body.querySelector('.wrapper_buttons').classList.remove('hide'), 1600)
    }
        
    }

    addDataReports(year, month) {
        if(!Object.keys(this.data).some(el => el === `${year}/${month}`)) {
            this.data[`${year}/${month}`] = {
                year: year,
                monthName: months[month],
                month: month,
                values: {}
            }
            setToLocalStorage('reports', this.data)
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
        </div>`
    }
}

const monthHTML = new MonthHTML(app, REPORTS, 'slide wrapper-table')

let currentDayBackground

monthHTML.render(currentYear, currentMonth)
pullValuesToTable(currentYear, currentMonth)
setCurrentScrollInsertValue(new Date().getDate())
const tdsHTML = monthHTML.container.querySelectorAll('td')
tdsHTML.forEach(elem => {
    elem.classList.add('content')
    elem.style.fontSize = '16px'
})


function setCurrentScrollInsertValue(value) {
    const table = monthHTML.container.querySelector('table')
    const days = Array.from(monthHTML.container.querySelectorAll('.days'))
    if(value < 11) {
    table.scrollLeft = 70 * value
    } else if(value > 10 && value < 21) {
      table.scrollLeft = 85 * value
    }else {
      table.scrollLeft = 87 * value
    }
    console.log()
    if(table.previousElementSibling.dataset.key === `${new Date().getFullYear()}/${new Date().getMonth()}`) {
        currentDayBackground = days[value]
        currentDayBackground.classList.add('days_today')
    }
}

class Values {
    constructor(publ, video, pp, hours, iz, day) {
        this.publ = publ
        this.video = video
        this.pp = pp
        this.hours = hours
        this.iz = iz
        this.day = day
    }

    getValues(reports) {
        const data = reports[`${currentYear}/${currentMonth}`].values
        if(!Object.keys(data).length) {
            reports[`${currentYear}/${currentMonth}`].values = {
                [this.day]: {
                    publ: + this.publ, 
                    video: + this.video, 
                    pp: + this.pp, 
                    hours: + this.hours, 
                    iz: + this.iz
                },
                sum: {
                    publSum: this.publ, 
                    videoSum: this.video, 
                    ppSum: this.pp, 
                    hoursSum: this.hours, 
                    izSum: this.iz
                }
            }
        }else {
            if(!data[this.day]) {
                reports[`${currentYear}/${currentMonth}`].values[this.day] = {
                    publ: + this.publ, 
                    video: + this.video, 
                    pp: + this.pp, 
                    hours: + this.hours, 
                    iz: + this.iz
                }
            }else {
                data[this.day] = {
                    publ: + data[this.day]['publ'] + + this.publ, 
                    video: + data[this.day]['video'] + + this.video, 
                    pp: + data[this.day]['pp'] + + this.pp, 
                    hours: + data[this.day]['hours'] + + this.hours, 
                    iz: + data[this.day]['iz'] + + this.iz
                }
            }
            reports[`${currentYear}/${currentMonth}`].values.sum = {
                publSum: + data.sum['publSum'] + + this.publ,
                videoSum: + data.sum['videoSum'] + + this.video,
                ppSum: + data.sum['ppSum'] + + this.pp,
                hoursSum: + data.sum['hoursSum'] + + this.hours,
                izSum: + data.sum['izSum'] + + this.iz
            }
        }
    }
}

const alertForValueHour = () => {
    imitationAlert('Неверный формат данных.<br/>Инструкция: Поле "Чч. мин." принимает разные форматы, например, если вы ведёте просто число, оно зафиксируется, как просто минуты, также вы можете ввести данные в следующих форматах: 1ч/час; 50м/мин; 1ч 50м либо 150 мин, либо 150 = 2ч.30мин. В итоге ты получишь формат: чч:мин.');
}

function convertMinutesToHours(mins) {
    let hours = Math.trunc(mins/60);
    let minutes = mins % 60;
    if(mins < 60 ) {
      return minutes + ' м';
    } else if(mins % 60 === 0) {
      return hours + ' ч';
    }else {
      return hours + ' ч ' + minutes + ' м';
    };
};

function convertHoursToMinutes(time, bool = true) {
    let arrTime = time.split(/\b/g);
    if(time.indexOf('ч') > 0) {
      if(arrTime.length > 2) {
        return String(+ arrTime[0] * 60 + + arrTime[2]);
      }else {
        return String(+ arrTime[0] * 60);
      };
    }else if(time.indexOf('м') > 0) {
      return  arrTime[0];
    }else if (arrTime.length === 1){
      return time;
    }else if(bool) {
      alertForValueHour();
      return '';
    };
};

let publValue = 0,
    videoValue = 0,
    ppValue = 0,
    hoursValue = 0,
    izValue = 0,
    day,
    btnDeleteChangeBackground,
    tdClick,
arrCells = []


function getValuesForMonth(event) {
    const btnsDelete = monthHTML.container.querySelectorAll('.btn_delete_values')
    const tds = monthHTML.container.querySelectorAll('td')
    const { target } = event
    if(target.className.includes('cell')) {
        tdClick = target
        target.textContent = ''
        arrCells.push(target)
        btnsDelete.forEach(elem => {
            if(elem.id === target.id) {
                btnDeleteChangeBackground = elem
                elem.style.background = 'rgba(223, 223, 200, 0.5) url(../assets/images/smile_ok.png)no-repeat center center / contain'
                elem.setAttribute('data-action', 'ok')
                tds.forEach(elemTd => {
                    elemTd.onfocus = () => {
                        if(target.id !== elemTd.id) {
                            elem.style.background = 'rgba(223, 223, 200, 0.5) url(../assets/images/recycle.png) no-repeat center center / contain'
                            elem.setAttribute('data-action', 'delete')
                            pullValuesToTable(currentYear, currentMonth)

                        }
                    }
                })
                
            }
        })
        target.onblur = () => {cellsTextContent()}
    }

    function cellsTextContent() {
        let res = []
        arrCells.forEach((el, idx) => {
            if(el.id === target.id) {
                day = target.id
                let elem = el.textContent
                switch(el.dataset.action) {
                    case 'publ':
                        publValue = elem
                        el.textContent = ''
                        res.push(publValue)
                    break
                    case 'video':
                        videoValue = elem
                        el.textContent = ''
                        res.push(videoValue)
                    break
                    case 'pp':
                        ppValue = elem
                        el.textContent = ''
                        res.push(ppValue)
                    break
                    case 'hours':
                        hoursValue = convertHoursToMinutes(elem)
                        el.textContent = ''
                        res.push(hoursValue)
                    break
                    case 'iz':
                        izValue = elem
                        el.textContent = ''
                        res.push(izValue)
                    break
                }

                if(idx === arrCells.length - 1 && !res.every(el => el === '')) {
                    if(res.some(el => isNaN(el))) {
                        alert('Все поля, кроме поля "Часы" принимают только число. Попробуйте ещё раз)')
                        return
                    }
                    new Values(publValue, videoValue, ppValue, hoursValue, izValue, day).getValues(REPORTS)
                    setToLocalStorage('reports', REPORTS)
                    arrCells = []
                    publValue = 0
                    videoValue = 0
                    ppValue = 0
                    hoursValue = 0
                    izValue = 0
                    pullValuesToTable(currentYear, currentMonth)
                    
                }
            }
        })
    }
}

document.addEventListener('click', event => {
    if(monthHTML.container.querySelector('.wrapper_buttons')?.contains(event.target)) {
        return
    }else if(btnDeleteChangeBackground) {
        if(!monthHTML.container.querySelector('.body_table').contains(event.target) || event.target === btnDeleteChangeBackground) {
            btnDeleteChangeBackground.style.background = 'rgba(223, 223, 200, 0.5) url(../assets/images/recycle.png) no-repeat center center / contain'
            setTimeout(() => {
                btnDeleteChangeBackground.setAttribute('data-action', 'delete')
            }, 0)
            pullValuesToTable(currentYear, currentMonth)
        }
    }
})


document.querySelector('.body_table').addEventListener('click', event => {
    getValuesForMonth(event)
    deleteValuesSpecificDay(event, document.querySelector('.container'))
})

function pullValuesToTable(year, month) {
    const cells = monthHTML.container.querySelectorAll('.cell'),
        cellsSum = monthHTML.container.querySelectorAll('.sum'),
    data = REPORTS[`${year}/${month}`].values

    for(let cell of cells) {
        if(data[cell.id]) {
            if(!data[cell.id][cell.dataset.action]) cell.textContent = ''
            else {
                if(cell.dataset.action === 'hours') {
                    cell.textContent = convertMinutesToHours(data[cell.id][cell.dataset.action])
                } else cell.textContent = data[cell.id][cell.dataset.action]
            }
        }else {
            cell.textContent = ''
        }
    }

    for(let cell of cellsSum) {
        if(!Object.values(data).length) return
        if(cell.dataset.action === 'undefined') return
        if(!data.sum[cell.dataset.action]) cell.textContent = ''
        else {
            if(cell.dataset.action === 'hoursSum') {
                cell.textContent = convertMinutesToHours(data.sum[cell.dataset.action])
            } else cell.textContent = data.sum[cell.dataset.action]
        }
    }
}

const switchingBetweenTables = event => {
    const { target } = event
    let relay,
    objDate
    if(target.className.includes('wrapper')) relay = target
    if(target.className.includes('buttons')) relay = target.parentElement
    switch(relay.dataset.page) {
      case 'previous':
        objDate = getAndCheckCurrentYearAndMonth(REPORTS, currentYear, currentMonth, {funcYear: getPrevYear, funcMonth: getPrevMonth}, relay.dataset.page)

        currentYear = objDate.currentYear
        currentMonth = objDate.currentMonth
      
        getAndDeleteSlide(MonthHTML, app, REPORTS, currentYear, currentMonth, 'slide wrapper-table_previous previous', 'previous', currentDayBackground)
      break 
      case 'next':
        objDate = getAndCheckCurrentYearAndMonth(REPORTS, currentYear, currentMonth, {funcYear: getNextYear, funcMonth: getNextMonth}, relay.dataset.page)

        currentYear = objDate.currentYear
        currentMonth = objDate.currentMonth

        getAndDeleteSlide(MonthHTML, app, REPORTS, currentYear, currentMonth, 'slide wrapper-table_next next', 'next', currentDayBackground)
      break
    }
}  