import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import dayjs from 'dayjs';
import durationModule from 'dayjs/plugin/duration.js';
import { calcDuration } from './film-view.js';
dayjs.extend(durationModule);

function commentsTemplate(detailedComments) {
  if (!detailedComments) {
    return '';
  }
  const comments = detailedComments.map((comment) => `<li class="film-details__comment">
    <span class="film-details__comment-emoji">
      <img src="./images/emoji/${comment.emotion}.png" width="55" height="55" alt="emoji-smile">
    </span>
    <div>
      <p class="film-details__comment-text">${comment.comment}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${comment.author}</span>
        <span class="film-details__comment-day">${dayjs(comment.date).format('YYYY/MM/DD HH:mm')}</span>
        <button class="film-details__comment-delete">Delete</button>
      </p>
    </div>
  </li>`).join('');

  return `<ul class="film-details__comments-list">${comments}</ul>`;
}

function popupTemplate(film, state) {
  let popupComments = null;
  if (!film.comments || film.comments.length === 0) {
    popupComments = '0 comments';
  } else if (film.comments.length === 1) {
    popupComments = '1 comment';
  } else {
    popupComments = `${film.comments.length} comments`;
  }

  const genres = film.film_info.genre;
  let genresAmount = null;
  if (genres.length === 1) {
    genresAmount = 'Genre';
  } else {
    genresAmount = 'Genres';
  }
  return `<section class="film-details">
  <div class="film-details__inner">
    <div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="${film.film_info.poster}" alt="">

          <p class="film-details__age">${film.film_info.age_rating}+</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title"> ${film.film_info.title}</h3>
              <p class="film-details__title-original">Original: ${film.film_info.alternative_title}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${film.film_info.total_rating}</p>
            </div>
          </div>

          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${film.film_info.director}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${film.film_info.writers.join(', ')}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${film.film_info.actors.join(', ')}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${dayjs(film.film_info.release.date).format('DD MMMM YYYY')}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Duration</td>
              <td class="film-details__cell">${calcDuration(film.film_info.duration)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${film.film_info.release.release_country}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">${genresAmount}</td>
              <td class="film-details__cell">
              ${genres.map((genre) =>
    `<span class="film-details__genre">${genre}</span>`)}</td>
            </tr>
          </table>

          <p class="film-details__film-description">
          ${film.film_info.description}
          </p>
        </div>
      </div>

      <section class="film-details__controls">
        <button type="button" class="film-details__control-button film-details__control-button--watchlist ${film.user_details.watchlist && 'film-details__control-button--active'}" id="watchlist" name="watchlist">Add to watchlist</button>
        <button type="button" class="film-details__control-button film-details__control-button--watched ${film.user_details.already_watched && 'film-details__control-button--active'}" id="watched" name="watched">Already watched</button>
        <button type="button" class="film-details__control-button film-details__control-button--favorite ${film.user_details.favorite && 'film-details__control-button--active'}" id="favorite" name="favorite">Add to favorites</button>
      </section>
    </div>

    <div class="film-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title"><span class="film-details__comments-count">${popupComments}</span></h3>
        ${commentsTemplate(film.detailedComments)}

        <form class="film-details__new-comment" action="" method="get">
          <div class="film-details__add-emoji-label">${state.emotion ? `<img src="./images/emoji/${state.emotion}.png" width="30" height="30" alt="emoji">` : ''}
          </div>

          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${state.comment ? state.comment : ''}</textarea>
          </label>

          <div class="film-details__emoji-list">
            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
            <label class="film-details__emoji-label" for="emoji-smile">
              <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
            <label class="film-details__emoji-label" for="emoji-sleeping">
              <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
            <label class="film-details__emoji-label" for="emoji-puke">
              <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
            <label class="film-details__emoji-label" for="emoji-angry">
              <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
            </label>
          </div>
        </form>
      </section>
    </div>
  </div>
</section>`;
}

export default class PopupView extends AbstractStatefulView {
  #film = null;
  #onCloseBtnClick = null;
  #onWatchlistClick = null;
  #onWatchedClick = null;
  #onFavoriteClick = null;
  #handleFormSubmit = null;

  constructor({ film, onCloseBtnClick, onWatchlistClick, onWatchedClick, onFavoriteClick, onFormSubmit }) {
    super();
    this.#film = film;
    this.#onCloseBtnClick = onCloseBtnClick;
    this.#onWatchlistClick = onWatchlistClick;
    this.#onWatchedClick = onWatchedClick;
    this.#onFavoriteClick = onFavoriteClick;
    this.#handleFormSubmit = onFormSubmit;
    this._restoreHandlers();
    this._state = {
      isDeleting: false
    };
  }

  get template() {
    return popupTemplate(this.#film, this._state);
  }

  _restoreHandlers() {
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#handleCloseBtnClick);
    this.element.querySelector('.film-details__control-button--watchlist').addEventListener('click', this.#handleWatchlistBtn);
    this.element.querySelector('.film-details__control-button--watched').addEventListener('click', this.#handleWatchedBtn);
    this.element.querySelector('.film-details__control-button--favorite').addEventListener('click', this.#handleFavoriteBtn);
    this.element.querySelector('form').addEventListener('change', this.#handleFormChange);
    this.element.querySelector('.film-details__comment-input').addEventListener('keyup', this.#handleCmdEnter);
    // this.element.querySelector('form').addEventListener('submit', (evt) => {
    //   evt.preventDefault();
    //   // delete this._state.isDeleting;
    //   // delete this._state.isSaving;

    //   this.#handleFormSubmit(this._state);
    // });
  }

  #handleCmdEnter = (evt) => {
    if (!this._state.emotion) {
      return;
    }
    if (evt.type === 'keyup' && evt.returnValue && evt.key === 'Meta') {
      const form = this.element.querySelector('form');
      const formData = new FormData(form);
      const comment = formData.get('comment');
      this._setState({
        comment
      });
      // form.submit();
      this.#handleFormSubmit(this._state);
    }
  };

  #handleFormChange = (evt) => {
    evt.preventDefault();
    const form = this.element.querySelector('form');
    const formData = new FormData(form);
    const emotion = formData.get('comment-emoji');
    const comment = formData.get('comment');

    if (this._state.emotion === emotion) {
      this._setState({
        comment
      });
      return;
    }

    const scroll = this.element.scrollTop;
    this.updateElement({
      ...this._state,
      emotion,
      comment
    });
    this.element.scrollTop = scroll;
  };

  #handleCloseBtnClick = (evt) => {
    evt.preventDefault();
    this.#onCloseBtnClick(evt);

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

