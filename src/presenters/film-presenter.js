import FilmView from '../views/film-view.js';
import { Mode } from '../utils/const.js';
import { RenderPosition, remove, render } from '../framework/render.js';
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

  constructor({container, onModeChange}) {
    this.#container = container;
    this.#onModeChange = onModeChange;
  }

  init(film) {
    this.#film = film;
    this.#filmView = new FilmView({ film, onPopupClick: this.#handlePopupClick, onWatchlistClick: () => {}, onWatchedClick: () => {}, onFavoriteClick: () => {} });
    this.#popupView = new PopupView({ film, onCloseBtnClick: this.#handlePopupClose });

    render(this.#filmView, this.#container);

    if (this.#mode === Mode.POPUP){
      render(this.#popupView, this.#container);
    }
  }

  #handlePopupClick = () => {
    this.switchToPopup();
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
