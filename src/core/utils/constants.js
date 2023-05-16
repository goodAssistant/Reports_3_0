const DAYS_COLORS = {
  publ: '#0000ff80',
  video: '#ffa5080',
  pp: '#ffff0080',
  hours: '#ff00ff80',
  iz: '#00800080',
};

const CHECKED = {
  color: 'var(--color-checked)',
  backgroundColor: 'var(--backgroundColor-checked)',
  border: 'var(--borderColor-checked)',
  borderRadius: '5px',
  initStyles(container) {
    for (const key in this) {
      container.style[key] = this[key];
    }
  },
};

const UNCHECKED = {
  color: 'var(--color-unchecked)',
  backgroundColor: 'var(--backgroundColor-unchecked)',
  border: 'var(--borderColor-unchecked)',
  borderRadius: '5px',
  initStyles(container) {
    for (const key in this) {
      container.style[key] = this[key];
    }
  },
};
