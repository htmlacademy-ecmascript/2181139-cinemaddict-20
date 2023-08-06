import Observable from '../framework/observable.js';
import { UpdateType } from '../utils/const.js';

export default class FilmsModel extends Observable {
  #films = [];
  #filmsApiService = null;

  constructor(filmsApiService){
    super();
    this.#filmsApiService = filmsApiService;
  }

  get films() {
    return this.#films;
  }

  async init() {
    try {
      this.#films = await this.#filmsApiService.films;
    } catch (err) {
      this.#films = [];
    }
    this._notify(UpdateType.FILMS_LOADED);
  }

  async initComments(movieId) {
    const index = this.#films.findIndex((film) => film.id === movieId);
    if (index === -1) {
      throw new Error('Can\'t find unexisting film');
    }
    let updatedFilm = this.#films[index];
    try {
      const comments = await this.#filmsApiService.fetchComments(movieId);
      updatedFilm = {
        ...this.#films[index],
        comments: comments.map((comment) => comment.id),
        detailedComments: comments
      };
      this.#films = [
        ...this.#films.slice(0, index),
        updatedFilm,
        ...this.#films.slice(index + 1),
      ];

    } catch (err) {
      this.#films = [];
    }
    this._notify(UpdateType.COMMENTS_LOADED, updatedFilm);
  }

  async update(updateType, updatedFilm) {
    const payload = { ...updatedFilm };
    delete payload.detailedComments;
    const index = this.#films.findIndex((film) => film.id === payload.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    try {
      const response = await this.#filmsApiService.updateFilm(payload);
      // const point = this.#ApiService.transformPointForClient(response);
      this.#films = [
        ...this.#films.slice(0, index),
        response,
        ...this.#films.slice(index + 1),
      ];
      this._notify(updateType, { ...response, detailedComments: updatedFilm.detailedComments });
    } catch (err) {
      throw new Error('Can\'t update film');
    }
  }

  async updateComment(updateType, comment) {
    let updatedFilm;
    try {
      const { movie, comments: updatedComments } = await this.#filmsApiService.postComment(comment);
      const index = this.#films.findIndex((film) => film.id === movie.id);
      if (index === -1) {
        throw new Error('Can\'t find unexisting film');
      }
      updatedFilm = this.#films[index];
      updatedFilm = {
        ...this.#films[index],
        ...movie,
        comments: updatedComments.map((c) => c.id),
        detailedComments: updatedComments
      };
      this.#films = [
        ...this.#films.slice(0, index),
        updatedFilm,
        ...this.#films.slice(index + 1),
      ];

    } catch (err) {
      this.#films = [];
    }
    this._notify(UpdateType.COMMENTS_LOADED, updatedFilm);
  }
}
