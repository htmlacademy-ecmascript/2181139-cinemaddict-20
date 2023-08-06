import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';

function profileTemplate(filmsAmount) {
  let title;
  if (filmsAmount === 0) {
    title = '';
  } else if (filmsAmount > 0 && filmsAmount <= 10) {
    title = 'novice';
  } else if (filmsAmount > 10 && filmsAmount <= 20) {
    title = 'fan';
  } else if (filmsAmount > 20) {
    title = 'movie buff';
  }

  return `<section class="header__profile profile">
  <p class="profile__rating">${title}</p>
  <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;
}

export default class ProfileView extends AbstractStatefulView {
  #filmsAmount = null;

  constructor(filmsAmount) {
    super();
    this.#filmsAmount = filmsAmount;
  }

  get template() {
    return profileTemplate(this.#filmsAmount);
  }

}
