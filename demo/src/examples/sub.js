import HotCollection from '__lib'; // '@joaomelo/hot-collection';
import { db } from '../services';
import { renderEmployees } from './common';

export function renderSubExample (el) {
  const employeeCol = new HotCollection(db, 'employees');
  employeeCol.subscribe(items => { el.innerHTML = renderEmployees(items); });
}
