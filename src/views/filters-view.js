import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';

function createFilterTemplate(filters, currentFilterType) {
  return `(<nav class="main-navigation">
<a href="#all" data-filter-type='ALL' class="main-navigation__item ${currentFilterType === 'ALL' ? 'main-navigation__item--active' : ''}">All movies</a>
<a href="#watchlist" data-filter-type='WATCHLIST' class="main-navigation__item ${currentFilterType === 'WATCHLIST' ? 'main-navigation__item--active' : ''}">Watchlist <span class="main-navigation__item-count">${filters.find((f) => f.type === 'WATCHLIST').count}</span></a>
<a href="#history" data-filter-type='HISTORY' class="main-navigation__item ${currentFilterType === 'HISTORY' ? 'main-navigation__item--active' : ''}">History <span class="main-navigation__item-count">${filters.find((f) => f.type === 'HISTORY').count}</span></a>
<a href="#favorites" data-filter-type='FAVORITE' class="main-navigation__item ${currentFilterType === 'FAVORITE' ? 'main-navigation__item--active' : ''}">Favorites <span class="main-navigation__item-count">${filters.find((f) => f.type === 'FAVORITE').count}</span></a>
</nav>)`;
}


export default class FiltersView extends AbstractStatefulView {
  #filters = null;
  #currentFilterType = null;
  #onFilterTypeChange = null;

  constructor({ filters, currentFilterType, onFilterTypeChange }) {
    super();
    this.#filters = filters;
    this.#currentFilterType = currentFilterType;
    this.#onFilterTypeChange = onFilterTypeChange;
    for (const btn of this.element.querySelectorAll('a.main-navigation__item')) {
      btn.addEventListener('click', this.#handleFilterChange);
    }
  }

  get template() {
    return createFilterTemplate(this.#filters, this.#currentFilterType);
  }

  #handleFilterChange = (evt) => {
    evt.preventDefault();
    this.#onFilterTypeChange(evt.currentTarget.dataset.filterType);
  };
}


