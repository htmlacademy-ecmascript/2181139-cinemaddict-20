import ApiService from '../framework/api-service.js';

export default class FilmsApiService extends ApiService{
  get films() {
    return this._load({url: 'cinemaddict/movies'})
      .then(ApiService.parseResponse);
  }

  // get comments
}
