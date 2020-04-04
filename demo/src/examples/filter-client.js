import HotCollection from '__lib'; // '@joaomelo/hot-collection';
import { db } from '../services';
import { getById } from '../helpers';
import { renderEmployees } from './common';

let employees, filterEl;

export function renderFilterClientExample (el) {
  filterEl = el;
  const employeeCol = new HotCollection(db, 'employees');
  employeeCol.subscribe(items => {
    employees = items;
    update();
  });

  getById('cli-filter').addEventListener('click', update);
};

function update () {
  const filterText = getById('cli-name').value;
  const filterEmployees = filterText === '' ? employees : employees.filter(i => i.name.includes(filterText));
  filterEl.innerHTML = renderEmployees(filterEmployees, 'add');
}
