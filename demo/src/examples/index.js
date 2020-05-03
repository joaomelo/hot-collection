import { renderListItemsExample } from './list-items';
import { renderAddItemExample } from './add-item';
// import { renderGetItemExample } from './examples/get-item';
// import { renderSubExample } from './examples/sub';
// import { renderDelExample } from './examples/del';
// import { renderSetExample } from './examples/set';
// import { renderFilterBackendExample } from './examples/filter-backend';
// import { renderFilterClientExample } from './examples/filter-client';

function renderExamples (examplesEl, adapter) {
  examplesEl.innerHTML = '<h2>Examples</h2>';
  renderListItemsExample(examplesEl, adapter);
  renderAddItemExample(examplesEl, adapter);
}

export { renderExamples };
