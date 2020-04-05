import HotCollection from '__lib'; // '@joaomelo/hot-collection';
import { db } from '../services';
import { renderEmployees } from './common';

export async function renderGetItemsExample (el) {
  const employeeCol = new HotCollection(db, 'employees');
  const employees = await employeeCol.getItems();
  el.innerHTML = renderEmployees(employees);
}
