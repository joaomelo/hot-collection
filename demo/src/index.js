// enable the use of async functions
import 'core-js';
import 'regenerator-runtime/runtime';

import './styles.css';

import { byId } from './helpers';
import { renderAdapterChooser, adapterSubject } from './adapters';
import { renderExamples } from './examples';

renderAdapterChooser(byId('adapter'));
adapterSubject.subscribe(adapter => {
  renderExamples(byId('examples'), adapter);
});
