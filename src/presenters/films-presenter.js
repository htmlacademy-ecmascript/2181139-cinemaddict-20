import { render } from '../framework/render.js';
import FilmView from '../views/film-view.js';

export default class FilmsPresenter{
  #container = null;
  constructor({container}) {
    this.#container = container;
    this.renderFilms();
  }

  renderFilms() {
    for (let i = 0; i < 5; i++) {
      const filmView = new FilmView();
      render(filmView, this.#container);
    }
  }
}
