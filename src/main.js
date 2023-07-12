import FiltersPresenter from './presenters/filters-presenter.js';
import MainPresenter from './presenters/main-presenter.js';

const mainContainer = document.querySelector('.main');
const headerContainer = document.querySelector('.header');
const listContainer = document.querySelector('.films-list__container');

const filtersPresenter = new FiltersPresenter({container: mainContainer});
const mainPresenter = new MainPresenter({headerContainer, mainContainer, listContainer});

