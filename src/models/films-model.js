import Observable from '../framework/observable.js';
import { UpdateType } from '../utils/const.js';

export default class FilmsModel extends Observable {
  #films = [];
  #filmsApiService = null;

  constructor(filmsApiService) {
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

  async initComments(filmId) {
    const index = this.#films.findIndex((film) => film.id === filmId);
    if (index === -1) {
      throw new Error('Can\'t find unexisting film');
    }
    let updatedFilm = this.#films[index];
    try {
      const comments = await this.#filmsApiService.fetchComments(filmId);
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
      throw new Error('Can\'t fetch comments');
    }
    this._notify(UpdateType.COMMENTS_LOADED, updatedFilm);
  }

  async update(updateType, updatedFilm) {
    const index = this.#films.findIndex((film) => film.id === updatedFilm.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    try {
      const response = await this.#filmsApiService.updateFilm(updatedFilm);
      const film = { ...response, detailedComments: updatedFilm.detailedComments };
      this.#films = [
        ...this.#films.slice(0, index),
        film,
        ...this.#films.slice(index + 1),
      ];
      this._notify(updateType, film);
    } catch (err) {
      throw new Error('Can\'t update film');
    }
  }

  async updateComment(updateType, comment) {
    let existingFilm;
    try {
      const { movie: updatedFilm, comments: updatedComments } = await this.#filmsApiService.postComment(comment);
      const index = this.#films.findIndex((film) => film.id === updatedFilm.id);
      if (index === -1) {
        throw new Error('Can\'t find unexisting film');
      }
      existingFilm = this.#films[index];
      existingFilm = {
        ...this.#films[index],
        ...updatedFilm,
        comments: updatedComments.map((c) => c.id),
        detailedComments: updatedComments
      };
      this.#films = [
        ...this.#films.slice(0, index),
        existingFilm,
        ...this.#films.slice(index + 1),
      ];

    } catch (err) {
      throw new Error('Can\'t post comment');
    }
    this._notify(updateType, existingFilm);
  }

  async deleteComment(updateType, comment) {
    let updatedFilm;
    try {
      await this.#filmsApiService.deleteComment(comment.commentId);
      const index = this.#films.findIndex((film) => film.id === comment.filmId);
      if (index === -1) {
        throw new Error('Can\'t find unexisting film');
      }
      updatedFilm = this.#films[index];
      updatedFilm.comments = updatedFilm.comments.filter((c) => c !== comment.commentId);
      updatedFilm.detailedComments = updatedFilm.detailedComments.filter((c) => c.id !== comment.commentId);

      this.#films = [
        ...this.#films.slice(0, index),
        updatedFilm,
        ...this.#films.slice(index + 1),
      ];

    } catch (err) {
      throw new Error('Can\'t delete comment');
    }
    this._notify(updateType, updatedFilm);
  }
}
