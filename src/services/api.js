import ApiService from '../framework/api-service.js';

export default class FilmsApiService extends ApiService{
  get films() {
    return this._load({url: 'cinemaddict/movies'})
      .then(ApiService.parseResponse);
  }

  updateFilm(film) {
    return this._load({method: 'PUT', url: `cinemaddict/movies/${film.id}`, headers: new Headers({ 'Content-Type': 'application/json'}), body: JSON.stringify(film)})
      .then(ApiService.parseResponse);
  }

  fetchComments(movieId) {
    return this._load({method: 'GET', url: `cinemaddict/comments/${movieId}`, headers: new Headers({ 'Content-Type': 'application/json'})})
      .then(ApiService.parseResponse);
  }
}
