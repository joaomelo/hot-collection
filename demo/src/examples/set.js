import HotCollection from '__lib'; // '@joaomelo/hot-collection';
import { db } from '../services';
import { getById, getAll, resetAllInputs } from '../helpers';
import { renderEmployees } from './common';

const employeeCol = new HotCollection(db, 'employees');

export function renderSetExample (el) {
  getById('set-save').onclick = addOrSetEmployee;

  employeeCol.subscribe(items => {
    el.innerHTML = renderEmployees(items, 'set');
    getAll('.set-editbtn').forEach(btn => { btn.onclick = loadEmployee; });
  });
};

function addOrSetEmployee () {
  const employee = {
    name: getById('set-name').value,
    dpto: getById('set-dpto').value
  };

  if (getById('set-id').value) {
    employee.id = getById('set-id').value;
    employeeCol.set(employee);
  } else {
    employeeCol.add(employee);
  }

  resetAllInputs();
}

function loadEmployee () {
  employeeCol.getItem(this.dataset.id).then(e => {
    getById('set-id').value = e.id;
    getById('set-name').value = e.name;
    getById('set-dpto').value = e.dpto;
  });
}
