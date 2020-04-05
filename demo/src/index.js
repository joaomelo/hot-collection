// enable the use of async functions
import 'core-js';
import 'regenerator-runtime/runtime';

import { userPromise } from './services';
import { getById } from './helpers';
import { renderGetItemsExample } from './examples/get-items';
import { renderGetItemExample } from './examples/get-item';
import { renderSubExample } from './examples/sub';
import { renderAddExample } from './examples/add';
import { renderDelExample } from './examples/del';
import { renderSetExample } from './examples/set';
import { renderFilExample } from './examples/fil';
import { renderFilterClientExample } from './examples/filter-client';

userPromise.then(() => {
  getById('title').innerHTML = 'Hot-Collection';
  renderGetItemsExample(getById('get-items-example'));
  renderGetItemExample(getById('get-item-example'));
  renderSubExample(getById('sub-example'));
  renderAddExample(getById('add-example'));
  renderDelExample(getById('del-example'));
  renderSetExample(getById('set-example'));
  renderFilExample(getById('fil-example'));
  renderFilterClientExample(getById('cli-example'));
});
