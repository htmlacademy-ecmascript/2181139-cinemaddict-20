import ProfileView from '../views/profile-view.js';
import { render, RenderPosition, remove } from '../framework/render.js';
import SortView from '../views/sort-view.js';
import FilmPresenter from './film-presenter.js';
import ShowMoreButtonView from '../views/show-more-button-view.js';
import { UpdateType, Mode } from '../utils/const.js';
import { filter } from './filters-presenter.js';
import FilmsTitleView from '../views/films-title-view.js';

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

  constructor({headerContainer, mainContainer, listContainer, filmsModel, filtersModel}) {
    this.#headerContainer = headerContainer;
    this.#mainContainer = mainContainer;
    this.#listContainer = listContainer;
    this.#filmsModel = filmsModel;
    this.#filtersModel = filtersModel;

    this.#filmsModel.addObserver(this.#handleFilmsModelEvent);
    this.#filmsModel.init();
    this.#filtersModel.addObserver(this.#handleFiltersModelEvent);
    // this.#renderLoading();
  }

  #renderProfileView() {
    this.#profileView = new ProfileView();
    render(this.#profileView, this.#headerContainer);
  }

  #renderFooter() {
    // TODO
  }

  #renderMain() {
    this.#sortView = new SortView();
    render(this.#sortView, this.#mainContainer, RenderPosition.AFTERBEGIN);
    this.#showMoreButtonView = new ShowMoreButtonView();
    render(this.#showMoreButtonView, this.#listContainer, RenderPosition.AFTEREND);

    const films = this.films;

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
    const filmPresenter = new FilmPresenter({ container: this.#listContainer, onModeChange: this.#handleModeChange });
    filmPresenter.init(film);

    this.#filmPresenters.set(film.id, filmPresenter);
  }

  get films() {
    //  filtering
    this.#filterType = this.#filtersModel.filter;
    const filteredFilms = this.#filmsModel.getNextFilms(this.#filterType);

    //   switch (this.#sortType) {
    //     case SortType.DAY:
    //       return filteredPoints.sort((a, b) => Date.parse(a.dateFrom) - Date.parse(b.dateFrom));
    //     case SortType.TIME:
    //       return filteredPoints.sort((a, b) => {
    //         const duration1 = Date.parse(a.dateTo) - Date.parse(a.dateFrom);
    //         const duration2 = Date.parse(b.dateTo) - Date.parse(b.dateFrom);
    //         return duration2 - duration1;
    //       });
    //     case SortType.PRICE:
    //       return filteredPoints.sort((a, b) => b.basePrice - a.basePrice);
    //   }

    //   return filteredPoints;
    return filteredFilms;
  }

  #handleModeChange = (filmId, mode) => {
    if (mode === Mode.GALLERY) {
      this.#filmIdInPopupMode = null;
      return;
    }

    if (this.#filmIdInPopupMode !== null) {
      this.#filmPresenters.get(this.#filmIdInPopupMode).switchToGallery();
    }

    this.#filmIdInPopupMode = filmId;
  };

  // updateType: userData changes/comments changes
  #handleFilmsModelEvent = (updateType, film) => {
    switch (updateType) {
      case UpdateType.FILMS_LOADED:
        this.#renderFooter();
        if (this.#filmsModel.films.length === 0) {
        // show no movies available
        } else {
          this.#renderProfileView();
          this.#renderMain();
        }
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
    this.#clearBoard();
    this.#renderMain();
  };

  #clearBoard = () => {
    remove(this.#filmsTitleView);
    this.#filmsTitleView = null;

    remove(this.#sortView);
    this.#sortView = null;

    remove(this.#showMoreButtonView);
    this.#showMoreButtonView = null;

    this.#filmPresenters.forEach((presenter) => presenter.destroy());
    this.#filmPresenters.clear();
  };
}
