import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';

function createFilterTemplate(filters, currentFilterType) {
  return `(<nav class="main-navigation">
<a href="#all" id="filter-ALL" data-filter-type='ALL' class="main-navigation__item ${currentFilterType === 'ALL' ? 'main-navigation__item--active' : ''}">All movies</a>
<a href="#watchlist" id="filter-WATCHLIST" data-filter-type='WATCHLIST' class="main-navigation__item ${currentFilterType === 'WATCHLIST' ? 'main-navigation__item--active' : ''}">Watchlist <span class="main-navigation__item-count">${filters.find((f) => f.type === 'WATCHLIST').count}</span></a>
<a href="#history" id="filter-HISTORY" data-filter-type='HISTORY' class="main-navigation__item ${currentFilterType === 'HISTORY' ? 'main-navigation__item--active' : ''}">History <span class="main-navigation__item-count">${filters.find((f) => f.type === 'HISTORY').count}</span></a>
<a href="#favorites" id="filter-FAVORITE" data-filter-type='FAVORITE' class="main-navigation__item ${currentFilterType === 'FAVORITE' ? 'main-navigation__item--active' : ''}">Favorites <span class="main-navigation__item-count">${filters.find((f) => f.type === 'FAVORITE').count}</span></a>
</nav>)`;
}


export default class FiltersView extends AbstractStatefulView {
  #filters = null;
  #currentFilterType = null;
  #onFilterTypeChange = null;

  constructor({filters, currentFilterType, onFilterTypeChange}) {
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
    // this.element.querySelector(`#filter-${this.#currentFilterType}`).classList.remove('main-navigation__item--active');
    // this.element.querySelector(`#filter-${evt.target.dataset.filterType}`).classList.add('main-navigation__item--active');
    this.#onFilterTypeChange(evt.target.dataset.filterType);
  };
}


