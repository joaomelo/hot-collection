import HotCollection from '__lib'; // '@joaomelo/hot-collection';
import { db } from '../services';
import { getById, getAll, resetAllInputs } from '../helpers';
import { renderEditableEmployee } from './common';

const employeeCol = new HotCollection(db, 'employees');

export function renderSetExample (el) {
  getById('set-save').onclick = addOrSetEmployee;

  employeeCol.subscribe(items => {
    el.innerHTML = `
      <ul>
        ${items.reduce((a, e) => a + renderEditableEmployee(e, 'set'), '')}
      </ul>
    `;
    getAll('.set-btn').forEach(btn => { btn.onclick = loadEmployee; });
  });
};

function addOrSetEmployee () {
  const employee = { name: getById('set-name').value };

  if (getById('set-id').value) {
    employee.id = getById('set-id').value;
    employeeCol.set(employee);
  } else {
    employeeCol.add(employee);
  }

  resetAllInputs();
}

function loadEmployee () {
  employeeCol.loadItem(this.id).then(e => {
    getById('set-id').value = e.id;
    getById('set-name').value = e.name;
  });
}
