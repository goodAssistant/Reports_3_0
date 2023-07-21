function setInstructions() {
  const instrWrapper = document.createElement('div');

  instrWrapper.classList.add('instr__wrapper');
  monthHTML.container.prepend(instrWrapper);

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
  <p class="instr__footer release">${RELEASE}</p>
 `;
  instrWrapper.innerHTML = template;
  const deleteInstr = new DeleteButton(instrWrapper, 'delete__button');
  deleteInstr.deleteBody(monthHTML);

  setTimeout(() => {
    instrWrapper.classList.add('active');
  }, 100);

  getAndDeleteGoTopBtn(monthHTML.container, instrWrapper);
}
