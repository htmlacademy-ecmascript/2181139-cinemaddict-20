import ProfileView from '../views/profile-view.js';
import { render, RenderPosition, remove } from '../framework/render.js';
import SortView from '../views/sort-view.js';
import FilmPresenter from './film-presenter.js';
import ShowMoreButtonView from '../views/show-more-button-view.js';
import { UpdateType, Mode, SortType, UserAction, FilterType } from '../utils/const.js';
import filter from '../utils/filter.js';
import FilmsTitleView from '../views/films-title-view.js';
import LoadingView from '../views/loading-view.js';

const PAGE_SIZE = 5;

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
    this.#profileView = new ProfileView();
    render(this.#profileView, this.#headerContainer);
  }

  #renderFooter() {
    // TODO
  }

  #renderMain() {
    this.#sortView = new SortView({ sortType: this.#sortType, onSortTypeChange: this.#handleSortTypeChange });
    render(this.#sortView, this.#mainContainer, RenderPosition.AFTERBEGIN);

    this.#renderFilms();
  }

  #renderFilms() {
    const films = this.films;

    if (this.#hasNext) {
      this.#showMoreButtonView = new ShowMoreButtonView(this.#handleShowMoreBtnClick);
      render(this.#showMoreButtonView, this.#listContainer, RenderPosition.AFTEREND);
    }

    if (films.length === 0) {
      // case when no movies satisfy filter conditions
      // this.#noPointsView = new NoPointsView({filterType: this.#filterType});
      // render(this.#noPointsView, this.#eventsContainer);
      this.#filmsTitleView = new FilmsTitleView(this.#filterType);
      render(this.#filmsTitleView, this.#listContainer, RenderPosition.BEFOREBEGIN);
      return;
    }

    films.forEach((film) => {
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

  #handleViewAction = async (userAction, updateType, updatedFilm) => {
    // this.#uiBlocker.block();

    try {
      switch (userAction) {
        case UserAction.UPDATE_FILM:
          // this.#filmPresenters.get(updatedFilm.id).setSaving();
          await this.#filmsModel.update(updateType, updatedFilm);
          break;
      }
    } catch (err) {
      // this.#filmPresenters.get(updatedFilm.id).handleError();
      console.log(err);
      throw err;
    } finally {
      // this.#uiBlocker.unblock();
    }
  };

  #handleModeChange = (filmId, mode) => {
    if (mode === Mode.GALLERY) {
      this.#filmIdInPopupMode = null;
      return;
    }

    this.#filmsModel.initComments(filmId);
    if (this.#filmIdInPopupMode !== null) {
      this.#filmPresenters.get(this.#filmIdInPopupMode).switchToGallery();
    }

    this.#filmIdInPopupMode = filmId;
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
          filmPresenter.destroy();
        } else {
          filmPresenter.init(film);
        }
        break;
      case UpdateType.HISTORY:
        filmPresenter = this.#filmPresenters.get(film.id);
        if (this.#filtersModel.filter === FilterType.HISTORY && !film.user_details.history) {
          filmPresenter.destroy();
        } else {
          filmPresenter.init(film);
        }
        break;
      case UpdateType.WATCHLIST:
        filmPresenter = this.#filmPresenters.get(film.id);
        if (this.#filtersModel.filter === FilterType.WATCHLIST && !film.user_details.watchlist) {
          filmPresenter.destroy();
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
    remove(this.#filmsTitleView);
    this.#filmsTitleView = null;

    remove(this.#sortView);
    this.#sortView = null;

    this.#clearFilms();
  };

  #clearFilms = () => {
    remove(this.#showMoreButtonView);
    this.#showMoreButtonView = null;

    this.#filmPresenters.forEach((presenter) => presenter.destroy());
    this.#filmPresenters.clear();
  };

  #handleShowMoreBtnClick = () => {
    this.#lastPage++;
    this.#clearFilms();
    this.#renderFilms();
  };

}
