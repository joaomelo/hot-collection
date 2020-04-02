import HotCollection from '__lib'; // '@joaomelo/hot-collection';
import { db } from '../services';
import { getById, resetAllInputs } from '../helpers';
import { renderEmployees } from './common';

export function renderAddExample (el) {
  getById('add-save').addEventListener('click', () => {
    employeeCol.add({ name: getById('add-name').value });
    resetAllInputs();
  });

  const employeeCol = new HotCollection(db, 'employees');
  employeeCol.subscribe(items => { getById('add-example').innerHTML = renderEmployees(items); });
};
