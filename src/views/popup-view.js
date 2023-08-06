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
        <button class="film-details__comment-delete" ${comment.isDeleting ? 'disabled' : ''} data-comment-id=${comment.id}>${comment.isDeleting ? 'Deleting...' : 'Delete'}</button>
      </p>
    </div>
  </li>`).join('');

  return `<ul class="film-details__comments-list">${comments}</ul>`;
}

function popupTemplate(state) {
  let popupComments = null;
  const { film, comment } = state;
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
              ${genres.map((genre) => `<span class="film-details__genre">${genre}</span>`)}</td>
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
        ${commentsTemplate(film.detailedComments, comment)}

        <form class="film-details__new-comment" action="" method="get">
          <div class="film-details__add-emoji-label">${comment.emotion ? `<img src="./images/emoji/${comment.emotion}.png" width="30" height="30" alt="emoji">` : ''}
          </div>

          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" ${state.isPosting ? 'disabled' : ''} placeholder="Select reaction below and write comment here" name="comment" value="${comment.text ? comment.text : ''}">${comment.text ? comment.text : ''}</textarea>
          </label>

          <div class="film-details__emoji-list">
            <input class="film-details__emoji-item visually-hidden" ${state.isPosting ? 'disabled' : ''} name="comment-emoji" type="radio" id="emoji-smile" value="smile">
            <label class="film-details__emoji-label" for="emoji-smile">
              <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" ${state.isPosting ? 'disabled' : ''} name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
            <label class="film-details__emoji-label" for="emoji-sleeping">
              <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" ${state.isPosting ? 'disabled' : ''} name="comment-emoji" type="radio" id="emoji-puke" value="puke">
            <label class="film-details__emoji-label" for="emoji-puke">
              <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" ${state.isPosting ? 'disabled' : ''} name="comment-emoji" type="radio" id="emoji-angry" value="angry">
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
  #onCloseBtnClick = null;
  #onWatchlistClick = null;
  #onWatchedClick = null;
  #onFavoriteClick = null;
  #handleFormSubmit = null;
  #handleCommentDelete = null;
  #handleCommentDraft = null;

  constructor({ film, commentDraft, onCloseBtnClick, onWatchlistClick, onWatchedClick, onFavoriteClick, onCommentDraft, onFormSubmit, onCommentDelete }) {
    super();
    this.#onCloseBtnClick = onCloseBtnClick;
    this.#onWatchlistClick = onWatchlistClick;
    this.#onWatchedClick = onWatchedClick;
    this.#onFavoriteClick = onFavoriteClick;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleCommentDelete = onCommentDelete;
    this.#handleCommentDraft = onCommentDraft;
    this._setState({
      film,
      comment: commentDraft,
      isPosting: false
    });
    this._restoreHandlers();
  }

  get template() {
    return popupTemplate(this._state);
  }

  _restoreHandlers() {
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#handleCloseBtnClick);
    this.element.querySelector('.film-details__control-button--watchlist').addEventListener('click', this.#handleWatchlistBtn);
    this.element.querySelector('.film-details__control-button--watched').addEventListener('click', this.#handleWatchedBtn);
    this.element.querySelector('.film-details__control-button--favorite').addEventListener('click', this.#handleFavoriteBtn);
    this.element.querySelector('form').addEventListener('change', this.#handleFormChange);
    this.element.querySelector('.film-details__comment-input').addEventListener('keyup', this.#handleCmdEnter);
    for (const deleteBtn of this.element.querySelectorAll('.film-details__comment-delete')) {
      deleteBtn.addEventListener('click', (evt) => {
        const commentId = evt.target.dataset.commentId;
        this.setIsDeleting(commentId, true);
        this.#handleCommentDelete(commentId);
      });
    }
  }

  setIsDeleting = (commentId, isDeleting) => {
    const commentIndex = this._state.film.detailedComments.findIndex((c) => c.id === commentId);
    const detailedComments = [
      ...this._state.film.detailedComments.slice(0, commentIndex),
      {
        ...this._state.film.detailedComments[commentIndex],
        isDeleting
      },
      ...this._state.film.detailedComments.slice(commentIndex + 1),
    ];
    this.updateElement({
      ...this._state,
      film: {
        ...this._state.film,
        detailedComments
      }
    });
  };

  setIsPosting = (isPosting) => {
    this.updateElement({
      isPosting
    });
  };

  updateElement = (state, recoverScroll = true) => {
    const scroll = this.element.scrollTop;
    super.updateElement(state);

    if (recoverScroll) {
      this.element.scrollTop = scroll;
    }
  };

  #handleCmdEnter = (evt) => {
    if (evt.type === 'keyup' && evt.ctrlKey && evt.keyCode === 13) {
      const form = this.element.querySelector('form');
      const formData = new FormData(form);
      const commentText = formData.get('comment');
      if (commentText.trim() === '') {
        return;
      }
      const comment = {
        ...this._state.comment,
        text: commentText
      };
      this.#handleCommentDraft(comment);
      this.updateElement({
        isPosting: true,
        comment
      });
      this.#handleFormSubmit(comment);
    }
  };

  #handleFormChange = (evt) => {
    evt.preventDefault();

    if (evt.target.type === 'textarea') {
      const text = evt.target.value;
      const comment = {
        ...this._state.comment,
        text
      };
      this._setState({ comment });
      this.#handleCommentDraft(comment);
      return;
    }

    if (evt.target.name === 'comment-emoji') {
      const form = this.element.querySelector('form');
      const formData = new FormData(form);
      const emotion = formData.get('comment-emoji');
      const text = formData.get('comment');
      this.updateElement({
        ...this._state,
        comment: {
          ...this._state.comment,
          emotion,
          text
        }
      });
    }
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

