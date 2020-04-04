import HotCollection from '__lib'; // '@joaomelo/hot-collection';
import { db } from '../services';
import { getById, resetAllInputs } from '../helpers';
import { renderEmployees } from './common';

export function renderAddExample (el) {
  const employeeCol = new HotCollection(db, 'employees');

  getById('add-save').addEventListener('click', () => {
    employeeCol.add({
      name: getById('add-name').value,
      dpto: getById('add-dpto').value
    });
    resetAllInputs();
  });

  employeeCol.subscribe(items => { el.innerHTML = renderEmployees(items, 'add'); });
};
