function setInstructions() {
  const instrWrapper = document.createElement('div');
  const deleteInstr = document.createElement('div');

  instrWrapper.classList.add('instr__wrapper');
  deleteInstr.classList.add('delete__instr');
  monthHTML.container.prepend(instrWrapper);

  let quantityParagraphs = [
    'При первом запуске твоего нового помощника, счетовода драгоценного времени и бесценного труда, хочется с тобой поздороваться: "Привээээт, родненький(ая)!!!"',

    'Каждое первое число нового месяца, я буду создавать новую таблицу с названием наступившего месяца. Тебе нужно будет лишь вносить в неё данные.',

    'Данные можно вносить тапнув на соответствующую ячейку прямо в таблице, когда ты переключишься на новую ячейку, данные автоматически сохраняются. Также заметь, что кнопка удаления данных меняется на кнопку сохранения данных с изображением моей прекрасной улыбки в солнечных очках. На эту кнопку можно сохранять данные.',

    'Каждая ячейка промаркирована для твоего удобства. Там где числа, в верхней строчке таблицы, проставлены дни недели. Все ячейки, кроме ячейки "Часы" принимают число. Ячейка "Часы" принимает разные форматы, например, если вы ведёте просто число, оно зафиксируется, как просто минуты, также вы можете ввести данные в следующих форматах: 1ч/час; 50м/мин; 1ч 50м либо 150 мин, либо 150 = 2ч.30мин. В итоге ты получишь формат: чч:мин. В один день можно вводить значения сколько тебе удобно раз, все они будут суммироваться.',

    'В меню ты можешь: посмотреть инструкцию и даже прочитать её; выбрать таблицу любого месяца для просмотра и редактирования, между месяцами можно переключаться с помощью стрелок; сменить тему; посмотреть итоги за месяц и за год; очистить все данные.',

    'При необходимости есть возможность удалить данные конкретного дня. Это можно сделать на кнопку под ячекой "Из.". На этой кнопке всегда меняются иконки. Во время ввода она становится кнопкой сохранения и улыбается тебе. Иконка меняется в зависимости от количества проведённого времени в важном деле. От 2ч. 30 мин в день вера с горчичное зерно прорастает из лампочки дающей свет.',

    'В пункте "Итоги за месяц" выбери необходимый месяц, чтобы подвести итоги и сделать скриншот.',
  ];

  const template = `
  <h4 class="instr__title" style="text-align: center; margin-bottom: 10px">Здравствуй, дорогой друг!!!</h4>
  ${quantityParagraphs
    .map(
      (item, idx) =>
        `<p class="instr__item instr__text${idx + 1}">${idx + 1}.  ${item}</p>`
    )
    .join('')}
  <h4 class="instr__bye" style="text-align: center; margin-bottom: 10px">Успехов тебе, дорогой мой друг!!!</h4>
  <p class="prava release">Все не защищённые права, не защищены</p>
  <p class="inc release">Eternity Corporation</p>
  <p class="instr__footer release">Release 3.0</p>
 `;
  instrWrapper.innerHTML = template;
  instrWrapper.append(deleteInstr);

  setTimeout(() => {
    instrWrapper.classList.add('active');
  }, 100);
  deleteInstr.addEventListener('click', () => {
    monthHTML.getAndDeleteOverlay();
    instrWrapper.classList.remove('active');
    setTimeout(() => {
      instrWrapper.remove();
    }, 1000);
  });
  const goTopBtn = document.createElement('div');
  goTopBtn.className = 'back_to_top';
  goTopBtn.innerHTML = '&#9757';
  instrWrapper.addEventListener('scroll', function () {
    if (instrWrapper.scrollTop >= 50) {
      monthHTML.container.append(goTopBtn);
      goTopBtn.classList.add('show');
      goTopBtn.addEventListener('click', () => {
        instrWrapper.scrollBy(0, -instrWrapper.scrollTop);
      });
    } else {
      goTopBtn.classList.remove('show');
      goTopBtn.remove();
    }
  });
}
