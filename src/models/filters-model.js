import { FilterType } from '../utils/const.js';
import Observable from '../framework/observable.js';

export default class FiltersModel extends Observable {
  #filter = FilterType.ALL;

  get filter() {
    return this.#filter;
  }

  set filter(filter) {
    this.#filter = filter;
    this._notify('filterChanged', filter);
  }
}
