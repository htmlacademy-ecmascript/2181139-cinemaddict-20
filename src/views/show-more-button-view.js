import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';

function showMoreButtonTemplate() {
  return '<button class="films-list__show-more">Show more</button>';
}

export default class ShowMoreButtonView extends AbstractStatefulView {
  #onBtnClick = null;

  constructor(onBtnClick){
    super();
    this.#onBtnClick = onBtnClick;
    this.element.addEventListener('click', this.#handleBtnClick);
  }

  get template() {
    return showMoreButtonTemplate();
  }

  #handleBtnClick = (evt) => {
    evt.preventDefault();
    this.#onBtnClick();
  };

}
