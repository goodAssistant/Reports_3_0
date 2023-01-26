const app = document.querySelector('.app')

const getFromLocalStorage = (key, obj = '{}') => JSON.parse(localStorage.getItem(key) || obj)

const setToLocalStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data))
}

let REPORTS = getFromLocalStorage('reports')

// const currentYear = new Date().getFullYear()
// const currentMonth = new Date().getMonth()

const currentYear = 2022
const currentMonth = 11

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

class MonthHTML {
    constructor(body, data) {
        this.body = body
        this.data = data

        this.container = document.createElement('div')
        this.container.className = 'container'

        this.tableArr
    }

    render(year, month) {
        const monthDays = numDaysOfMonth(year, month)
        this.tableArr = puncts.reduce((acc, el, idx) => {
            if(idx === 0) acc =  [...acc, el, ...range(monthDays), 'Итого']
            else if(idx === puncts.length - 1) acc = [...acc, el, ...Array(monthDays).fill(''), '«столбец']
            else acc =  [...acc, el, ...Array(monthDays).fill(''), '']
            return acc
        }, [])
        this.tableArr = chunk(this.tableArr, monthDays + 2)
        this.addDataReports(year, month)
        this.addToHTML(this.tableArr, this.data[`${currentYear}/${currentMonth}`])
    }

    addToHTML(matrixMonth, data) {
        const thead = matrixMonth.splice(0, 1).join('').split(',')
        const action = ['publ', 'video', 'pp', 'hours', 'iz']
        this.container.innerHTML = `
            <div class="wrapper-table">
                <h2 class="wrapper-table_title">${data.monthName} ${data.year}</h2>
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
                                return `<th class="sum" data-action=${action[rowIdx]}>${td}</th>`
                            }else if(rowIdx === matrixMonth.length - 1) {
                                if(tdIdx > 0 && tdIdx < row.length - 1) {
                                    return `<th class="btn_delete_values" id=${tdIdx}>${td}</th>`
                                }
                            }else if(td === '') {
                                return `<td class="cell" id=${tdIdx} data-action = ${action[rowIdx]} contenteditable="true">${td}</td>`
                            }}).join('')}
                        </tr>`).join('')}
                    </tbody>
                </table>
            </div>
        `
        this.body.append(this.container)
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
}

const monthHTML = new MonthHTML(app, REPORTS)

monthHTML.render(currentYear, currentMonth)
pullValuesToTable(currentYear, currentMonth)
setCurrentScrollInsertValue(new Date().getDate())

console.log(new Date().getDate())

function setCurrentScrollInsertValue(value) {
    const table = monthHTML.container.querySelector('table')
    if(value < 11) {
    table.scrollLeft = 70 * value;
    } else if(value > 10 && value < 21) {
      table.scrollLeft = 85 * value;
    }else {
      table.scrollLeft = 87 * value;
    };
};

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
                    publ: this.publ, 
                    video: this.video, 
                    pp: this.pp, 
                    hours: this.hours, 
                    iz: this.iz
                },
                sum: {
                    publ: this.publ, 
                    video: this.video, 
                    pp: this.pp, 
                    hours: this.hours, 
                    iz: this.iz
                }
            }
        }else {
            if(!data[this.day]) {
                reports[`${currentYear}/${currentMonth}`].values[this.day] = {
                    publ: this.publ, 
                    video: this.video, 
                    pp: this.pp, 
                    hours: this.hours, 
                    iz: this.iz
                }
            }else {
                console.log(this.day)
                console.log(data[this.day])
                data[this.day] = {
                    publ: + data[this.day]['publ'] + + this.publ, 
                    video: + data[this.day]['video'] + + this.video, 
                    pp: + data[this.day]['pp'] + + this.pp, 
                    hours: + data[this.day]['hours'] + + this.hours, 
                    iz: + data[this.day]['iz'] + + this.iz
                }
            }
            reports[`${currentYear}/${currentMonth}`].values.sum = {
                publ: + data.sum['publ'] + + this.publ,
                video: + data.sum['video'] + + this.video,
                pp: + data.sum['pp'] + + this.pp,
                hours: + data.sum['hours'] + + this.hours,
                iz: + data.sum['iz'] + + this.iz
            }
        }
    }
}

const alertForValueHour = () => {
    imitationAlert('Неверный формат данных.<br/>Инструкция: Поле "Чч. мин." принимает разные форматы, например, если вы ведёте просто число, оно зафиксируется, как просто минуты, также вы можете ввести данные в следующих форматах: 1ч/час; 50м/мин; 1ч 50м либо 150 мин, либо 150 = 2ч.30мин. В итоге ты получишь формат: чч:мин.');
}

const convertMinutesToHours = mins => {
    let hours = Math.trunc(mins/60);
    let minutes = mins % 60;
    if(mins < 60 ) {
      return minutes + ' мин';
    } else if(mins % 60 === 0) {
      return hours + ' ч';
    }else {
      return hours + ' ч ' + minutes + ' мин';
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
arrCells = []

function getValuesForMonth(event) {
    const { target } = event
    if(target.className.includes('cell')) {
        arrCells.push(target)
    }

    if(target.className.includes('btn_delete_values')) {
        arrCells.forEach((el, idx) => {
            if(el.id === target.id) {
                day = target.id
                let elem = el.textContent
                switch(el.dataset.action) {
                    case 'publ':
                        publValue = elem
                        el.textContent = ''
                    break
                    case 'video':
                        videoValue = elem
                        el.textContent = ''
                    break
                    case 'pp':
                        ppValue = elem
                        el.textContent = ''
                    break
                    case 'hours':
                        hoursValue = convertHoursToMinutes(elem)
                        el.textContent = ''
                    break
                    case 'iz':
                        izValue = elem
                        el.textContent = ''
                    break
                }
                if(idx === arrCells.length - 1) {
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

document.querySelector('.body_table').addEventListener('click', getValuesForMonth)

function pullValuesToTable(year, month) {
    const cells = monthHTML.container.querySelectorAll('.cell'),
        cellsSum = monthHTML.container.querySelectorAll('.sum'),
    data = REPORTS[`${year}/${month}`].values

    for(let cell of cells) {
        if(data[cell.id]) {
            cell.textContent = data[cell.id][cell.dataset.action]
        }
    }

    for(let cell of cellsSum) {
        if(data[cell.id]) {
            if(cell.dataset.action === 'undefined') return
            else cell.textContent = data.sum[cell.dataset.action]
        }
    }
}