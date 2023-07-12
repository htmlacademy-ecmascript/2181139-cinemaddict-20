import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';

function showMoreButtonTemplate() {
  return '<button class="films-list__show-more">Show more</button>';
}

export default class ShowMoreButtonView extends AbstractStatefulView {
  get template() {
    return showMoreButtonTemplate();
  }

}
