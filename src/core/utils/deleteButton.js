class DeleteButton {
  constructor(body, className) {
    this.body = body;
    this.className = className;

    this.buttonHTML = document.createElement('button');
    this.buttonHTML.className = this.className;
    this.body.append(this.buttonHTML);
  }

  deleteBody(bodyOverlay, selector) {
    this.buttonHTML.addEventListener('click', () => {
      if (bodyOverlay) bodyOverlay.getAndDeleteOverlay();
      if (this.body.className.includes('active'))
        this.body.classList.remove('active');
      setTimeout(() => {
        if (selector) this.body.closest(selector).remove();
        this.body.remove();
      }, 1000);
    });
  }

  deleteDataHours(date, day, action, bodyOverlay) {
    this.buttonHTML.addEventListener('click', (event) => {
      const { target } = event;
      const td = target.closest('td');
      const { timestep } = td.dataset;
      const data = REPORTS[date].values[day].filter((el) => {
        if (el.name) el[action] -= convertHoursToMinutes(td.textContent);
        if (el.timestep !== +timestep) return el;
      });
      REPORTS = {
        ...REPORTS,
        [date]: {
          ...REPORTS[date],
          values: {
            ...REPORTS[date].values,
            [day]: data,
          },
        },
      };

      if(REPORTS[date].values[day].length === 1) {
        delete REPORTS[date].values[day]
      }

      if (action === 'hours') {
        REPORTS[date].values.sum.hoursSumTotal -= convertHoursToMinutes(
          td.textContent
        );
        REPORTS[date].values.sum.hoursSum -= convertHoursToMinutes(
          td.textContent
        );
      } else {
        REPORTS[date].values.sum[action + 'Sum'] -= +td.textContent;
      }

      const tableDropDown = this.body.closest('.wrapper_table-drop-down');
      td.closest('tr').remove();
      if (!app.querySelector('.tds__drop-menu')) {
        if (bodyOverlay) bodyOverlay.getAndDeleteOverlay();
        if (tableDropDown.className.includes('active'))
          tableDropDown.classList.remove('active');
        setTimeout(() => {
          tableDropDown.closest('.drop__menu-wrapper').remove();
        }, 1000);
      }

      localStorageService.set('reports', REPORTS);
      pullValuesToTable(date.split('/')[0], date.split('/')[1], td);
    });
  }
}
