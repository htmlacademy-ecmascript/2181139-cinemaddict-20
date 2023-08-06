import ProfileView from '../views/profile-view.js';
import { render, RenderPosition, remove, replace } from '../framework/render.js';
import SortView from '../views/sort-view.js';
import FilmPresenter from './film-presenter.js';
import ShowMoreButtonView from '../views/show-more-button-view.js';
import { UpdateType, Mode, SortType, UserAction, FilterType } from '../utils/const.js';
import filter from '../utils/filter.js';
import FilmsTitleView from '../views/films-title-view.js';
import LoadingView from '../views/loading-view.js';
import FooterView from '../views/footer-view.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';

const PAGE_SIZE = 5;
const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export default class MainPresenter {
  #filmPresenters = new Map(); // <movieId, FilmPresenter>
  #headerContainer = null;
  #mainContainer = null;
  #listContainer = null;
  #filmsModel = null;
  #filmIdInPopupMode = null;
  #filterType = null;
  #filtersModel = null;
  #sortView = null;
  #showMoreButtonView = null;
  #profileView = null;
  #filmsTitleView = null;
  #lastPage = 1;
  #hasNext = false;
  #sortType = SortType.DEFAULT;
  #loadingView = new LoadingView();
  #displayedFilms = [];

  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  constructor({ headerContainer, mainContainer, listContainer, filmsModel, filtersModel }) {
    this.#headerContainer = headerContainer;
    this.#mainContainer = mainContainer;
    this.#listContainer = listContainer;
    this.#filmsModel = filmsModel;
    this.#filtersModel = filtersModel;

    this.#filmsModel.addObserver(this.#handleFilmsModelEvent);
    this.#filmsModel.init();
    this.#filtersModel.addObserver(this.#handleFiltersModelEvent);

    render(this.#loadingView, this.#listContainer, RenderPosition.BEFOREBEGIN);
  }

  #renderProfileView() {
    const allFilms = this.#filmsModel.films;
    const prevProfileView = this.#profileView;
    this.#profileView = new ProfileView(filter[FilterType.HISTORY](allFilms).length);
    if (prevProfileView === null){
      render(this.#profileView, this.#headerContainer);
    } else {
      replace(this.#profileView, prevProfileView);
    }
  }

  #renderFooter() {
    const footer = new FooterView(this.#filmsModel.films.length);
    render(footer, document.querySelector('.footer__statistics'));
  }

  #renderMain() {
    this.#sortView = new SortView({ sortType: this.#sortType, onSortTypeChange: this.#handleSortTypeChange });
    render(this.#sortView, this.#mainContainer, RenderPosition.AFTERBEGIN);

    this.#renderFilms();
  }

  #renderFilms() {
    this.#displayedFilms = this.films;

    this.#refresh();

    this.#displayedFilms.forEach((film) => {
      this.#renderFilm(film);
    });
  }

  #renderFilm(film) {
    const filmPresenter = new FilmPresenter({ container: this.#listContainer, onModeChange: this.#handleModeChange, onDataChange: this.#handleViewAction });
    filmPresenter.init(film);

    this.#filmPresenters.set(film.id, filmPresenter);
  }

  get films() {
    this.#filterType = this.#filtersModel.filter;

    const allFilms = this.#filmsModel.films;
    const filteredFilms = filter[this.#filterType](allFilms);
    const displayedFilmsCounter = this.#lastPage * PAGE_SIZE;
    this.#hasNext = filteredFilms.length > displayedFilmsCounter;

    const displayedFilms = filteredFilms.slice(0, displayedFilmsCounter);

    switch (this.#sortType) {
      case SortType.DATE:
        return displayedFilms.sort((a, b) => Date.parse(b.film_info.release.date) - Date.parse(a.film_info.release.date));
      case SortType.RATING:
        return displayedFilms.sort((a, b) => b.film_info.total_rating - a.film_info.total_rating);
      default:
        return displayedFilms;
    }
  }

  #refresh() {
    if (this.#hasNext) {
      const prevShowMoreButton = this.#showMoreButtonView;
      this.#showMoreButtonView = new ShowMoreButtonView(this.#handleShowMoreBtnClick);
      if (prevShowMoreButton) {
        replace(this.#showMoreButtonView, prevShowMoreButton);
      } else {
        render(this.#showMoreButtonView, this.#listContainer, RenderPosition.AFTEREND);
      }
    } else {
      this.#removeShowMoreButton();
    }

    if (this.#displayedFilms.length === 0) {
      const prevFilmsTitleView = this.#filmsTitleView;
      this.#filmsTitleView = new FilmsTitleView(this.#filterType);
      if (prevFilmsTitleView) {
        replace(this.#filmsTitleView, prevFilmsTitleView);
      } else {
        render(this.#filmsTitleView, this.#listContainer, RenderPosition.BEFOREBEGIN);
      }
    } else {
      this.#removeFilmsTitleView();
    }
  }

  #handleViewAction = async (userAction, updateType, payload) => {
    let filmId;
    this.#uiBlocker.block();
    try {
      switch (userAction) {
        case UserAction.UPDATE_FILM:
          filmId = payload.id;
          // this.#filmPresenters.get(updatedFilm.id).setSaving();
          await this.#filmsModel.update(updateType, payload);
          break;
        case UserAction.UPDATE_COMMENT:
          filmId = payload.filmId;
          await this.#filmsModel.updateComment(updateType, payload);
          break;
      }
    } catch (err) {
      this.#filmPresenters.get(filmId).handleError();
      throw err;
    } finally {
      this.#uiBlocker.unblock();
    }
  };

  #handleModeChange = (filmId, mode) => {
    if (mode === Mode.GALLERY) {
      document.querySelector('body').classList.remove('hide-overflow');
      this.#filmPresenters.get(filmId).switchToGallery();
      this.#filmIdInPopupMode = null;
      return;
    }

    this.#filmsModel.initComments(filmId);
    if (this.#filmIdInPopupMode !== null) {
      this.#filmPresenters.get(this.#filmIdInPopupMode).switchToGallery();
    }

    if (filmId !== this.#filmIdInPopupMode) {
      document.querySelector('body').classList.add('hide-overflow');
      this.#filmPresenters.get(filmId).switchToPopup();
      this.#filmIdInPopupMode = filmId;
    } else {
      this.#filmIdInPopupMode = null;
    }
  };

  #handleSortTypeChange = (sortType) => {
    this.#sortType = sortType;
    this.#clearBoard();
    this.#renderMain();
  };

  // updateType: userData changes/comments changes
  #handleFilmsModelEvent = (updateType, film) => {
    let filmPresenter;
    switch (updateType) {
      case UpdateType.FAVORITE:
        filmPresenter = this.#filmPresenters.get(film.id);
        if (this.#filtersModel.filter === FilterType.FAVORITE && !film.user_details.favorite) {
          // filmPresenter.destroy();
          this.#removeFilm(filmPresenter);
        } else {
          filmPresenter.init(film);
        }
        break;
      case UpdateType.HISTORY:
        filmPresenter = this.#filmPresenters.get(film.id);
        if (this.#filtersModel.filter === FilterType.HISTORY && !film.user_details.history) {
          this.#removeFilm(filmPresenter);
        } else {
          filmPresenter.init(film);
        }
        this.#renderProfileView();
        break;
      case UpdateType.WATCHLIST:
        filmPresenter = this.#filmPresenters.get(film.id);
        if (this.#filtersModel.filter === FilterType.WATCHLIST && !film.user_details.watchlist) {
          this.#removeFilm(filmPresenter);
        } else {
          filmPresenter.init(film);
        }
        break;

      case UpdateType.FILMS_LOADED:
        remove(this.#loadingView);
        this.#loadingView = null;
        this.#renderFooter();
        if (this.#filmsModel.films.length === 0) {
          // show no movies available
        } else {
          this.#renderProfileView();
          this.#renderMain();
        }
        break;

      case UpdateType.COMMENTS_LOADED:
        filmPresenter = this.#filmPresenters.get(film.id);
        filmPresenter.init(film);
        break;
    }
  };

  #handleFiltersModelEvent = () => {
    // switch (updateType) {
    //   case UpdateType.PATCH:
    //   case UpdateType.MINOR:
    //   case UpdateType.MAJOR:
    //     this.#clearBoard({ resetSorting: true });
    //     this.#renderBoard();
    //     break;
    // }
    // this.#filmsModel.resetPage();
    this.#lastPage = 1;
    this.#sortType = SortType.DEFAULT;
    this.#clearBoard();
    this.#renderMain();
  };

  #clearBoard = () => {
    remove(this.#sortView);
    this.#sortView = null;

    this.#clearFilms();
  };

  #removeFilmsTitleView = () => {
    remove(this.#filmsTitleView);
    this.#filmsTitleView = null;
  };

  #clearFilms = () => {
    this.#removeShowMoreButton();

    this.#filmPresenters.forEach((presenter) => presenter.destroy());
    this.#filmPresenters.clear();
  };

  #removeShowMoreButton = () => {
    remove(this.#showMoreButtonView);
    this.#showMoreButtonView = null;
  };

  #handleShowMoreBtnClick = () => {
    this.#lastPage++;
    this.#clearFilms();
    this.#renderFilms();
  };

  #removeFilm = (filmPresenter) => {
    filmPresenter.destroy();
    const renderNext = this.#hasNext;
    this.#displayedFilms = this.films;
    if (renderNext) {
      this.#renderFilm(this.#displayedFilms[this.#displayedFilms.length - 1]);
    }
    this.#refresh();
  };
}
