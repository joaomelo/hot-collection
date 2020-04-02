// enable the use of async functions
import 'core-js';
import 'regenerator-runtime/runtime';

import { userPromise } from './services';
import { getById } from './helpers';
import { renderLoadExample } from './examples/load';
import { renderSubExample } from './examples/sub';
import { renderAddExample } from './examples/add';

userPromise.then(() => {
  getById('title').innerHTML = 'HotCollection';
  renderLoadExample(getById('load-example'));
  renderSubExample(getById('sub-example'));
  renderAddExample(getById('add-example'));
});
