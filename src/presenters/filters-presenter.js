import FiltersView from '../views/filters-view.js';
import { render, RenderPosition } from '../framework/render.js';

export default class FiltersPresenter {
  #container = null;

  constructor({container}) {
    this.#container = container;
    this.renderFilters();
  }

  renderFilters() {
    const filtersView = new FiltersView();
    render(filtersView, this.#container, RenderPosition.AFTERBEGIN);
  }
}
