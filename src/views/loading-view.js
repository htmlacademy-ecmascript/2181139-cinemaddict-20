import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';

function loadingTemplate() {
  return '<h2 class="films-list__title">Loading...</h2>';
}

export default class LoadingView extends AbstractStatefulView {

  constructor(){
    super();
  }

  get template() {
    return loadingTemplate();
  }
}
