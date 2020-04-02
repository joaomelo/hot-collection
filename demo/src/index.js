// enable the use of async functions
import 'core-js';
import 'regenerator-runtime/runtime';

import { userPromise } from './services';
import { getById } from './helpers';
import { renderGetExample } from './examples/get';
import { renderSubExample } from './examples/sub';
import { renderAddExample } from './examples/add';
import { renderSetExample } from './examples/set';

userPromise.then(() => {
  getById('title').innerHTML = 'HotCollection';
  renderGetExample(getById('get-example'));
  renderSubExample(getById('sub-example'));
  renderAddExample(getById('add-example'));
  renderSetExample(getById('set-example'));
});
