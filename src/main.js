import { FiltersPresenter } from './presenters/filters-presenter.js';
import MainPresenter from './presenters/main-presenter.js';
import FilmsApiService from './services/api.js';
import FilmsModel from './models/films-model.js';
import FiltersModel from './models/filters-model.js';

const ENDPOINT = 'https://20.ecmascript.pages.academy';
const AUTHORIZATION = 'Basic eo0w590ik275679a';

const filmsApiService = new FilmsApiService(ENDPOINT, AUTHORIZATION);
const filmsModel = new FilmsModel(filmsApiService);
const filtersModel = new FiltersModel();

const mainContainer = document.querySelector('.main');
const headerContainer = document.querySelector('.header');
const listContainer = document.querySelector('.films-list__container');

const filtersPresenter = new FiltersPresenter({container: mainContainer, filtersModel, filmsModel});
const mainPresenter = new MainPresenter({headerContainer, mainContainer, listContainer, filmsModel, filtersModel});

