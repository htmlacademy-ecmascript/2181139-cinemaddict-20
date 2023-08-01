import FilmView from '../views/film-view.js';
import { Mode, UpdateType, UserAction } from '../utils/const.js';
import { RenderPosition, remove, render, replace } from '../framework/render.js';
import PopupView from '../views/popup-view.js';

/*
* FilmView,
* PopupView
*/
export default class FilmPresenter {
  #mode = Mode.GALLERY;
  #container = null;
  #filmView = null;
  #popupView = null;
  #film = null;
  #onModeChange = null;
  #handleDataChange = null;

  constructor({container, onModeChange, onDataChange}) {
    this.#container = container;
    this.#onModeChange = onModeChange;
    this.#handleDataChange = onDataChange;
  }

  init(film) {
    this.#film = film;

    const prevFilmView = this.#filmView;
    const prevPopupView = this.#popupView;

    this.#filmView = new FilmView({ film, onPopupClick: this.#handlePopupClick, onWatchlistClick: this.#handleWatchlistClick, onWatchedClick: this.#handleWatchClick, onFavoriteClick: this.#handleFavoriteClick});
    this.#popupView = new PopupView({ film, onCloseBtnClick: this.#handlePopupClose, onWatchlistClick: this.#handleWatchlistClick, onWatchedClick: this.#handleWatchClick, onFavoriteClick: this.#handleFavoriteClick});

    if (prevFilmView === null) {
      render(this.#filmView, this.#container);
    } else {
      replace(this.#filmView, prevFilmView);
    }

    if (this.#mode === Mode.POPUP) {
      if (prevPopupView === null) {
        render(this.#popupView, this.#container);
      } else {
        replace(this.#popupView, prevPopupView);
      }
    }

    remove(prevFilmView);
    remove(prevPopupView);
  }

  #handlePopupClick = () => {
    this.switchToPopup();
  };

  #handleWatchlistClick = () => {
    this.#handleDataChange(
      UserAction.UPDATE_FILM,
      UpdateType.WATCHLIST,
      { ...this.#film,
        'user_details': {
          ...this.#film.user_details,
          watchlist: !this.#film.user_details.watchlist
        }
      }
    );

  };

  #handleWatchClick = () => {
    this.#handleDataChange(
      UserAction.UPDATE_FILM,
      UpdateType.HISTORY,
      { ...this.#film,
        'user_details': {
          ...this.#film.user_details,
          'already_watched': !this.#film.user_details.already_watched
        }
      }
    );
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange(
      UserAction.UPDATE_FILM,
      UpdateType.FAVORITE,
      { ...this.#film,
        'user_details': {
          ...this.#film.user_details,
          favorite: !this.#film.user_details.favorite
        }
      }
    );
  };

  #handlePopupClose = (evt) => {
    if (evt.type === 'keyup' && evt.key !== 'Escape') {
      return;
    }
    this.switchToGallery();
  };

  switchToGallery = () => {
    remove(this.#popupView);
    this.#mode = Mode.GALLERY;
    this.#onModeChange(this.#film.id, Mode.GALLERY);
    document.removeEventListener('keyup', this.#handlePopupClose);
  };

  switchToPopup() {
    render(this.#popupView, document.querySelector('footer'), RenderPosition.AFTEREND);
    this.#mode = Mode.POPUP;
    this.#onModeChange(this.#film.id, Mode.POPUP);
    document.addEventListener('keyup', this.#handlePopupClose);
  }

  destroy() {
    remove(this.#filmView);
    if (this.#mode === Mode.POPUP) {
      remove(this.#popupView);
    }
  }
}
