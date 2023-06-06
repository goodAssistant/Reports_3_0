let REPORTS;

const app = document.querySelector('.app');

const retrieverTheme = 'retriever_theme';

let switchButtonsBetweenTables;

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
