import ApiService from '../framework/api-service.js';

export default class FilmsApiService extends ApiService {
  get films() {
    return this._load({ url: 'cinemaddict/movies' })
      .then(ApiService.parseResponse);
  }

  updateFilm(film) {
    const requestBody = this.#filmToRequestBody(film);
    return this._load({ method: 'PUT', url: `cinemaddict/movies/${film.id}`, headers: new Headers({ 'Content-Type': 'application/json' }), body: JSON.stringify(requestBody) })
      .then(ApiService.parseResponse);
  }

  fetchComments(filmId) {
    return this._load({ method: 'GET', url: `cinemaddict/comments/${filmId}`, headers: new Headers({ 'Content-Type': 'application/json' }) })
      .then(ApiService.parseResponse);
  }

  postComment(comment) {
    const requestBody = this.#commentToRequestBody(comment);
    return this._load({ method: 'POST', url: `cinemaddict/comments/${comment.filmId}`, headers: new Headers({ 'Content-Type': 'application/json' }), body: JSON.stringify(requestBody) })
      .then(ApiService.parseResponse);
  }

  deleteComment(commentId) {
    return this._load({ method: 'DELETE', url: `cinemaddict/comments/${commentId}`, headers: new Headers({ 'Content-Type': 'application/json' }) });
  }

  #commentToRequestBody(comment) {
    const commentBody = { ...comment, comment: comment.text };
    delete commentBody.text;
    delete commentBody.filmId;
    delete commentBody.isDeleting;

    return commentBody;
  }

  #filmToRequestBody(film) {
    const filmBody = { ...film };
    delete filmBody.detailedComments;

    return filmBody;
  }
}

