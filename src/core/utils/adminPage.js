let adminPageWord;

function getInputAdminPage() {
  return `
  <form class="menu__retriever">
  <label class="menu__retriever" for="menu__retriever">
  Введите кодовое слово:
  </label>
  <input class="menu__retriever__input" type="text" id="menu__retriever" name="retriever" oninput="getRetriever(event)"
</form>
  `;
}

function getRetriever(event) {
  const { target } = event;
  adminPageWord = target.value.trim();
}

function startAdminPage() {
  if (adminPageWord === 'sum') {
    localStorageService.set(adminActivate, true);
    initAdminPage()
  } else if (adminPageWord === 'values') {
    localStorageService.set(adminActivateValues, true);
    initAdminPageValues()
  } else if (adminPageWord === 'cancel') {
    localStorageService.remove(adminActivate);
    localStorageService.remove(adminActivateValues);
  }
  location.reload();
}

function initAdminPage() {
  const keyMonth = app.querySelector('.wrapper-table_title').dataset.key
  const dataLocal = Object.entries(localStorageService.get('reports')[keyMonth].values.sum)
  const str = `
  <h4 class="month__name">Данные из локалки</h4>
  <table class="table__total">
    <tbody>
    ${dataLocal
      .map(
        (punct, idx) => `
      <tr>
        <th class="total__modal">
          ${punct[0]}:
        </th>
        <td class="total__modal">
          ${
            idx > 3
              ? convertMinutesToHours(punct[1])
              : punct[1]
          }
        </td>
      </tr>
      `
      )
      .join('')}
    </tbody>
  </table>
  `;
  imitationAlert(str, monthHTML)
}

function initAdminPageValues() {
  const keyMonth = app.querySelector('.wrapper-table_title').dataset.key
  const dataLocal = Object.entries(localStorageService.get('reports')[keyMonth].values)
  const str = `
  <h4 class="month__name">Данные из локалки</h4>
  <table class="table__total">
    <tbody>
    ${dataLocal
      .map(
        (punct, idx) => {
          if(idx === dataLocal.length -1) {
            return`
            <tr>
              <th class="total__modal">
                ${punct[0]}:
              </th>
              <td class="total__modal">
              ${punct[1]['hoursSumTotal']} / ${convertMinutesToHours(punct[1]['hoursSumTotal'])}
              </td>
            </tr>
            `
          }
          return `
      <tr>
        <th class="total__modal">
          ${punct[0]} число:
        </th>
        <td class="total__modal">
        ${punct[1][0].hours} / ${convertMinutesToHours(punct[1][0]['hours'])}
        </td>
      </tr>
      `}
      )
      .join('')}
    </tbody>
  </table>
  `;
  imitationAlert(str, monthHTML)
}

