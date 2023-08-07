import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { FilterType } from '../utils/const.js';

function filmsTitleViewTemplate(text) {
  return `<h2 class="films-list__title">${text}</h2>`;
}

export default class FilmsTitleView extends AbstractStatefulView {
  #filterType = null;

  constructor(filterType) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    let noFilmsFoundText;
    switch (this.#filterType) {
      case FilterType.ALL: {
        noFilmsFoundText = 'There are no movies in our database';
        break;
      }
      case FilterType.WATCHLIST: {
        noFilmsFoundText = 'There are no movies to watch now';
        break;
      }
      case FilterType.HISTORY: {
        noFilmsFoundText = 'There are no watched movies now';
        break;
      }
      case FilterType.FAVORITE: {
        noFilmsFoundText = 'There are no favorite movies now';
        break;
      }
    }
    return filmsTitleViewTemplate(noFilmsFoundText);
  }

}
