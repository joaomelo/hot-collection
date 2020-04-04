// enable the use of async functions
import 'core-js';
import 'regenerator-runtime/runtime';

import { userPromise } from './services';
import { getById } from './helpers';
import { renderGetExample } from './examples/get';
import { renderSubExample } from './examples/sub';
import { renderAddExample } from './examples/add';
import { renderDelExample } from './examples/del';
import { renderSetExample } from './examples/set';
import { renderFilExample } from './examples/fil';
import { renderFilterClientExample } from './examples/filter-client';

userPromise.then(() => {
  getById('title').innerHTML = 'Hot-Collection';
  renderGetExample(getById('get-example'));
  renderSubExample(getById('sub-example'));
  renderAddExample(getById('add-example'));
  renderDelExample(getById('del-example'));
  renderSetExample(getById('set-example'));
  renderFilExample(getById('fil-example'));
  renderFilterClientExample(getById('cli-example'));
});
