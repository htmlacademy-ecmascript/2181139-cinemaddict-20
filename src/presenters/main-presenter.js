import ProfileView from '../views/profile-view.js';
import { render, RenderPosition } from '../framework/render.js';
import SortView from '../views/sort-view.js';
import FilmsPresenter from './films-presenter.js';
import ShowMoreButtonView from '../views/show-more-button-view.js';

export default class MainPresenter {
  #headerContainer = null;
  #mainContainer = null;
  #filmsPresenter = null;
  #listContainer = null;
  constructor({headerContainer, mainContainer, listContainer}) {
    this.#headerContainer = headerContainer;
    this.#mainContainer = mainContainer;
    this.#listContainer = listContainer;
    this.#filmsPresenter = new FilmsPresenter({container: listContainer});
    this.renderMain();
  }

  renderMain() {
    const profileView = new ProfileView();
    render(profileView, this.#headerContainer);
    const sortView = new SortView();
    render(sortView, this.#mainContainer, RenderPosition.AFTERBEGIN);
    const showMoreButtonView = new ShowMoreButtonView();
    render(showMoreButtonView, this.#listContainer, RenderPosition.AFTEREND);
  }
}
