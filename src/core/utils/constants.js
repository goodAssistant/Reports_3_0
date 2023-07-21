let REPORTS;

const app = document.querySelector('.app');

const retrieverTheme = 'retriever_theme';

let switchButtonsBetweenTables;

const RELEASE = 'Release 3.017';

const DAYS_COLORS = {
  publ: '#0000ff80',
  video: '#ffa5080',
  pp: '#ffff0080',
  hours: '#ff00ff80',
  iz: '#00800080',
};

function init(container, obj) {
  for (const key in obj) {
    container.style[key] = obj[key];
  }
}

const CHECKED = {
  color: 'var(--color-checked)',
  backgroundColor: 'var(--backgroundColor-checked)',
  border: 'var(--borderColor-checked)',
  borderRadius: '5px',
  initStyles(container) {
    init(container, this);
  },
};

const UNCHECKED = {
  color: 'var(--color-unchecked)',
  backgroundColor: 'var(--backgroundColor-unchecked)',
  border: 'var(--borderColor-unchecked)',
  borderRadius: '5px',
  initStyles(container) {
    init(container, this);
  },
};

const localStorageService = {
  get: (key) => JSON.parse(localStorage.getItem(key)),
  set: (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
  },
  remove: (key) => {
    localStorage.removeItem(key);
  },
  clear: () => {
    localStorage.clear();
    setTimeout(() => {
      location.reload();
    }, 500);
  },
};

const punctsTotal = {
  publSum: 'Публ',
  videoSum: 'Видео',
  ppSum: 'ПП',
  izSum: 'Из',
  hoursSumTotal: 'Часы',
};

const quantityParagraphs = [
  'При первом запуске твоего нового помощника, счетовода драгоценного времени и бесценного труда, хочется с тобой поздороваться: "Привээээт, родненький(ая)!!!"',

  'Каждое первое число нового месяца, я буду создавать новую таблицу с названием наступившего месяца. Тебе нужно будет лишь вносить в неё данные.',

  'Данные можно вносить тапнув на соответствующую ячейку прямо в таблице, когда ты переключишься на новую ячейку, данные автоматически сохраняются. Также заметь, что кнопка удаления данных меняется на кнопку сохранения данных с изображением моей прекрасной улыбки в солнечных очках. На эту кнопку можно сохранять данные. Кроме того, данные сохранятся если ты нажмёшь "Enter".',

  'Каждая ячейка промаркирована для твоего удобства. В верхней строчке ячейки, проставлен день недели и число, а в нижней части название отображаемых данных . Все ячейки, кроме ячейки "Часы" принимают число. Ячейка "Часы" принимает разные форматы, например, если вы ведёте просто число, оно зафиксируется, как просто минуты, также вы можете ввести данные в следующих форматах: 1ч/час; 50м/мин; 1ч 50м либо 150 мин, либо 150 = 2ч.30мин. В итоге ты получишь формат: чч:мин. В один день можно вводить значения сколько тебе удобно раз, все они будут суммироваться.',

  'В графе "Итого" в завершении таблицы отображена сумма введенных данных в текущем месяце. Более интересна ячеека "Часы", т.к. она отображает несколько полей с данными. Верхнее поле: часы за текущий месяц, нижнее поле: время перенесённое с прошлого месяца со знаком "+", центральное поле(крупный шрифт): отображает сумму двух этих полей. Это удобно при формировании отчёта, когда число не круглое, ведь в нашем деле лишних минут не бывает, поэтому забираем их на следующий месяц. А трудяги может прихватят и побольшееее...',

  'По двойному клику на любую из ячеек ты сможешь просмотреть все введенные данные в эту ячейку, если ты вводил их туда более одного раза. Также можно удалить любую строчку из этих данных, если ввёл некорректно и ввести заново. Также это удобно если не помнишь, ввёл ты эти "15 минут" или нет)))',

  'В меню ты можешь: посмотреть инструкцию и даже прочитать её; выбрать таблицу любого месяца для просмотра и редактирования, между месяцами можно переключаться с помощью стрелок; сменить тему; посмотреть итоги за месяц и за год; очистить все данные.',

  'При необходимости есть возможность удалить данные конкретного дня. Это можно сделать на кнопку под ячекой "Из." или справа от неё. На этой кнопке всегда меняются иконки. Во время ввода она становится кнопкой сохранения и улыбается тебе. Иконка меняется в зависимости от количества проведённого времени в важном деле. От 2ч. 30 мин в день "вера с горчичное зерно прорастает из лампочки дающей свет" - это норма трудяги и если ты её видишь, то ты большой молодец.',

  'В пункте "Итоги за месяц" выбери необходимый месяц, чтобы подвести итоги и сделать скриншот.',

  'При формировании отчёта имеется возможность перенести данные о минутах или часах с минутами на следующий месяц. В графу для переноса времени автоматически попадает количество минут сверх последнего часа, при желании эти данные можно корректировать.',
];
