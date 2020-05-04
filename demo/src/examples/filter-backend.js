import HotCollection from '__lib'; // '@joaomelo/hot-collection';
import { db } from '../services';
import { byId, query } from '../helpers';
import { renderEmployees } from './common';

export function renderFilterBackendExample (el) {
  let employeeCol;

  query('.fil-btn').forEach(btn => btn.addEventListener('click', e => {
    const options = {};
    if (e.target.id === 'fil-filter') {
      options.where = [
        {
          field: 'dpto',
          operator: '==',
          value: byId('fil-dpto').value
        }
      ];
    }

    employeeCol = new HotCollection(db, 'employees', options);
    employeeCol.subscribe(items => { el.innerHTML = renderEmployees(items, 'add'); });
  }));
};
