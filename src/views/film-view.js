import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import dayjs from 'dayjs';
import durationModule from 'dayjs/plugin/duration.js';

dayjs.extend(durationModule);

const MINUTES_IN_HOUR = 60;

function calcDuration(durationInMinutes) {
  const duration = dayjs.duration(durationInMinutes, 'm');
  if (duration.asMinutes() < MINUTES_IN_HOUR) {
    return duration.format('m[m]');
  } else {
    return duration.format('H[h] m[m]');
  }
}

function trim(text, maxLength = 140) {
  if (text.length > 140) {
    return `${text.substring(0, maxLength - 1)}...`;
  }

  return text;
}

function filmTemplate(film) {
  let commentQuantifier = null;
  if (!film.comments || film.comments.length === 0) {
    commentQuantifier = '0 comments';
  } else if (film.comments.length === 1) {
    commentQuantifier = '1 comment';
  } else {
    commentQuantifier = `${film.comments.length} comments`;
  }

  return `<article class="film-card">
  <a class="film-card__link">
    <h3 class="film-card__title">${film.film_info.title}</h3>
    <p class="film-card__rating">${film.film_info.total_rating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${dayjs(film.film_info.release.date).format('YYYY')}</span>
      <span class="film-card__duration">${calcDuration(film.film_info.duration)}</span>
      <span class="film-card__genre">${film.film_info.genre.join(', ')}</span>
    </p>
    <img src="${film.film_info.poster}" alt="" class="film-card__poster">
    <p class="film-card__description">${trim(film.film_info.description)}</p>
    <span class="film-card__comments">${commentQuantifier}</span>
  </a>
  <div class="film-card__controls">
    <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${film.user_details.watchlist && 'film-card__controls-item--active'}" type="button">Add to watchlist</button> 
    <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${film.user_details.already_watched && 'film-card__controls-item--active'}" type="button">Mark as watched</button>
    <button class="film-card__controls-item film-card__controls-item--favorite ${film.user_details.favorite && 'film-card__controls-item--active'}" type="button">Mark as favorite</button>
  </div>
</article>`;
}

export default class FilmView extends AbstractStatefulView {
  #film = null;
  #onWatchlistClick = null;
  #onWatchedClick = null;
  #onFavoriteClick = null;
  #onPopupClick = null;

  constructor({ film, onPopupClick, onWatchlistClick, onWatchedClick, onFavoriteClick }) {
    super();
    this.#film = film;
    this.#onWatchlistClick = onWatchlistClick;
    this.#onWatchedClick = onWatchedClick;
    this.#onFavoriteClick = onFavoriteClick;
    this.#onPopupClick = onPopupClick;
    this._restoreHandlers();
  }

  get template() {
    return filmTemplate(this.#film);
  }

  _restoreHandlers() {
    this.element.querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this.#handleWatchlistBtn);
    this.element.querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this.#handleWatchedBtn);
    this.element.querySelector('.film-card__controls-item--favorite').addEventListener('click', this.#handleFavoriteBtn);
    this.element.addEventListener('click', this.#handlePopupClick);
  }

  #handlePopupClick = (evt) => {
    evt.stopPropagation();
    this.#onPopupClick();
  };

  #handleWatchlistBtn = (evt) => {
    evt.stopPropagation();
    this.#onWatchlistClick();
  };

  #handleWatchedBtn = (evt) => {
    evt.stopPropagation();
    this.#onWatchedClick();
  };

  #handleFavoriteBtn = (evt) => {
    evt.stopPropagation();
    this.#onFavoriteClick();
  };
}

export { calcDuration };
