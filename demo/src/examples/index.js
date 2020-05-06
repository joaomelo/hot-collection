import { renderListItemsExample } from './list-items';
import { renderAddItemExample } from './add-item';
import { renderSetItemExample } from './set-item';
import { renderDelItemExample } from './del-item';
import { renderQueryItemsExample } from './query-items';

function renderExamples (examplesEl, options) {
  examplesEl.innerHTML = '<h2>Examples</h2>';
  renderListItemsExample(examplesEl, options);
  renderAddItemExample(examplesEl, options);
  renderSetItemExample(examplesEl, options);
  renderDelItemExample(examplesEl, options);
  renderQueryItemsExample(examplesEl, options);
}

export { renderExamples };
