import AbstractStatefulView from '../framework/view/abstract-stateful-view';

function sortTemplate(sortType) {
  return `<ul class="sort">
<li><a href="#" class="sort__button ${sortType === 'DEFAULT' ? 'sort__button--active' : ''}" data-sort-type='DEFAULT'>Sort by default</a></li>
<li><a href="#" class="sort__button ${sortType === 'DATE' ? 'sort__button--active' : ''}" data-sort-type='DATE'>Sort by date</a></li>
<li><a href="#" class="sort__button ${sortType === 'RATING' ? 'sort__button--active' : ''}" data-sort-type='RATING'>Sort by rating</a></li>
</ul>`;
}

export default class SortView extends AbstractStatefulView {
  #sortType = null;
  #onSortTypeChange = null;

  constructor({ sortType, onSortTypeChange }) {
    super();
    this.#sortType = sortType;
    this.#onSortTypeChange = onSortTypeChange;
    for (const btn of this.element.querySelectorAll('a.sort__button')) {
      btn.addEventListener('click', this.#handleSortChange);
    }
  }

  get template() {
    return sortTemplate(this.#sortType);
  }

  #handleSortChange = (evt) => {
    evt.preventDefault();
    this.#onSortTypeChange(evt.target.dataset.sortType);
  };
}
