import FiltersView from '../views/filters-view.js';
import { render, remove, replace, RenderPosition } from '../framework/render.js';
import { FilterType } from '../utils/const.js';
import filter from '../utils/filter.js';

export default class FiltersPresenter {
  #container = null;
  #filtersModel = null;
  #filmsModel = null;
  #filtersView = null;

  constructor({container, filtersModel, filmsModel}) {
    this.#container = container;
    this.#filmsModel = filmsModel;
    this.#filtersModel = filtersModel;

    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#filtersModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    const films = this.#filmsModel.films;

    return Object.values(FilterType).map((type) => ({
      type,
      count: filter[type](films).length
    }));
  }

  renderFilters() {
    // if (this.#filmsModel.films.length === 0) {
    //   return;
    // }
    const filters = this.filters;
    const prevFiltersView = this.#filtersView;

    this.#filtersView = new FiltersView({
      filters,
      currentFilterType: this.#filtersModel.filter,
      onFilterTypeChange: this.#handleFilterTypeChange
    });
    if (prevFiltersView === null){
      render(this.#filtersView, this.#container, RenderPosition.AFTERBEGIN);
      return;
    }
    replace(this.#filtersView, prevFiltersView);
    remove(prevFiltersView);
  }

  #handleModelEvent = () => {
    this.renderFilters();
  };

  #handleFilterTypeChange = (filterType) => {
    if (this.#filtersModel.filter === filterType) {
      return;
    }

    this.#filtersModel.filter = filterType;
  };
}

