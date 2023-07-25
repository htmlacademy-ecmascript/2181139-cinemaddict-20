import Observable from '../framework/observable.js';
import { UpdateType } from '../utils/const.js';
import { filter } from '../presenters/filters-presenter.js';

const PAGE_SIZE = 5;

export default class FilmsModel extends Observable {
  #nextPage = 1;
  #films = [];
  #filmsApiService = null;

  constructor(filmsApiService){
    super();
    this.#filmsApiService = filmsApiService;
  }

  get films() {
    return this.#films;
  }

  getNextFilms(filterType) {
    const filteredFilms = filter[filterType](this.#films);
    const remaining = filteredFilms.length - ((this.#nextPage - 1) * PAGE_SIZE);
    if (remaining <= 0) {
      return [];
    }
    this.#nextPage++;
    const films = this.#films.slice(0, (this.#nextPage - 1) * PAGE_SIZE);

    return films;
  }

  resetPage() {
    this.#nextPage = 1;
  }

  async init() {
    try {
      this.#films = await this.#filmsApiService.films;
    } catch (err) {
      this.#films = [];
    }
    this._notify(UpdateType.FILMS_LOADED);
  }

  // userData/comment
  async update(updateType, updatedFilm) {

  }

  async getComments(movieId) {

  }
}
