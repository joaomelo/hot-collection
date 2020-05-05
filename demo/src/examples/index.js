import { renderListItemsExample } from './list-items';
import { renderAddItemExample } from './add-item';
import { renderSetItemExample } from './set-item';
import { renderDelItemExample } from './del-item';
// import { renderSubExample } from './examples/sub';
// import { renderFilterBackendExample } from './examples/filter-backend';
// import { renderFilterClientExample } from './examples/filter-client';

function renderExamples (examplesEl, options) {
  examplesEl.innerHTML = '<h2>Examples</h2>';
  renderListItemsExample(examplesEl, options);
  renderAddItemExample(examplesEl, options);
  renderSetItemExample(examplesEl, options);
  renderDelItemExample(examplesEl, options);
}

export { renderExamples };
