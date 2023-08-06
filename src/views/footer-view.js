import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';

function footerTemplate(filmsAmount){
  return `<p>${filmsAmount} movies inside</p>`;
}

export default class FooterView extends AbstractStatefulView {
  #filmsAmount = null;
  constructor(filmsAmount) {
    super();
    this.#filmsAmount = filmsAmount;
  }

  get template(){
    return footerTemplate(this.#filmsAmount);
  }
}
