import FilmView from '../views/film-view.js';
import { Mode, UpdateType, UserAction } from '../utils/const.js';
import { RenderPosition, remove, render, replace } from '../framework/render.js';
import PopupView from '../views/popup-view.js';

const DEFAULT_COMMENT = {
  emotion: 'smile',
  text: ''
};

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
  #commentDraft = DEFAULT_COMMENT;

  constructor({ container, onModeChange, onDataChange }) {
    this.#container = container;
    this.#onModeChange = onModeChange;
    this.#handleDataChange = onDataChange;
  }

  init(film) {
    this.#film = film;

    const prevFilmView = this.#filmView;
    const prevPopupView = this.#popupView;

    this.#filmView = new FilmView({ film, onPopupClick: this.#handlePopupClick, onWatchlistClick: this.#handleWatchlistClick, onWatchedClick: this.#handleWatchClick, onFavoriteClick: this.#handleFavoriteClick });
    this.#popupView = new PopupView({ film, commentDraft: this.#commentDraft, onCloseBtnClick: this.#handlePopupClose, onWatchlistClick: this.#handleWatchlistClick, onWatchedClick: this.#handleWatchClick, onFavoriteClick: this.#handleFavoriteClick, onCommentDraft: this.#handleCommentDraft, onFormSubmit: this.#handleFormSubmit, onCommentDelete: this.#handleCommentDelete });

    if (prevFilmView === null) {
      render(this.#filmView, this.#container);
    } else {
      replace(this.#filmView, prevFilmView);
    }

    if (this.#mode === Mode.POPUP) {
      if (prevPopupView === null) {
        render(this.#popupView, this.#container);
      } else {
        const scroll = prevPopupView.element.scrollTop;
        replace(this.#popupView, prevPopupView);
        this.#popupView.element.scrollTop = scroll;
      }
    }

    remove(prevFilmView);
    remove(prevPopupView);
  }

  #handlePopupClick = () => {
    this.#onModeChange(this.#film.id, Mode.POPUP);
  };

  resetCommentDraft = () => {
    this.#commentDraft = DEFAULT_COMMENT;
  };

  #handleFormSubmit = async (comment) => {
    comment.filmId = this.#film.id;
    await this.#handleDataChange(
      UserAction.UPDATE_COMMENT,
      UpdateType.COMMENT_SUBMITTED,
      comment);
  };

  #handleCommentDelete = async (commentId) => {
    await this.#handleDataChange(
      UserAction.UPDATE_COMMENT,
      UpdateType.COMMENT_DELETED,
      {
        filmId: this.#film.id,
        commentId
      }
    );
  };

  #handleWatchlistClick = () => {
    this.#handleDataChange(
      UserAction.UPDATE_FILM,
      UpdateType.WATCHLIST,
      {
        ...this.#film,
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
      {
        ...this.#film,
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
      {
        ...this.#film,
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
    this.#onModeChange(this.#film.id, Mode.GALLERY);
  };

  #handleCommentDraft = (commentDraft) => {
    this.#commentDraft = {
      ...commentDraft
    };
  };

  switchToGallery = () => {
    remove(this.#popupView);
    this.#mode = Mode.GALLERY;
    document.removeEventListener('keyup', this.#handlePopupClose);
  };

  switchToPopup() {
    render(this.#popupView, document.querySelector('footer'), RenderPosition.AFTEREND);
    this.#mode = Mode.POPUP;
    document.addEventListener('keyup', this.#handlePopupClose);
  }

  handleError(updateType, payload) {
    switch (updateType) {
      case UpdateType.UPDATE_FILM: {
        if (this.#mode === Mode.POPUP) {
          this.#popupView.shake(() => {
          }, '.film-details__controls');
        } else {
          this.#filmView.shake(() => { });
        }
        break;
      }
      case UpdateType.COMMENT_DELETED: {
        this.#popupView.shake(() => {
          this.#popupView.setIsDeleting(payload.commentId, false);
        }, `.film-details__comment:has([data-comment-id="${payload.commentId}"])`);
        break;
      }
      case UpdateType.COMMENT_SUBMITTED: {
        this.#popupView.shake(() => {
          this.#popupView.setIsPosting(false);
        }, '.film-details__new-comment');
        break;
      }
    }

  }

  destroy() {
    remove(this.#filmView);
    if (this.#mode === Mode.POPUP) {
      remove(this.#popupView);
    }
  }
}
