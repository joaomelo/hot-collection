// enable the use of async functions
import 'core-js';
import 'regenerator-runtime/runtime';

import './styles.css';

import { byId } from './helpers';
import { renderAdapterChooser, newOptionsSignal } from './options';
import { renderExamples } from './examples';

renderAdapterChooser(byId('adapter'));
newOptionsSignal.subscribe(options => {
  renderExamples(byId('examples'), options);
});
