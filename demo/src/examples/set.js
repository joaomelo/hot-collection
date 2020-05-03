import HotCollection from '__lib'; // '@joaomelo/hot-collection';
import { db } from '../services';
import { byId, getAll, resetAllTextInputs } from '../helpers';
import { renderEmployees } from './common';

const employeeCol = new HotCollection(db, 'employees');

export function renderSetExample (el) {
  byId('set-save').onclick = addOrSetEmployee;

  employeeCol.subscribe(items => {
    el.innerHTML = renderEmployees(items, 'set');
    getAll('.set-editbtn').forEach(btn => { btn.onclick = loadEmployee; });
  });
};

function addOrSetEmployee () {
  const employee = {
    name: byId('set-name').value,
    dpto: byId('set-dpto').value
  };

  if (byId('set-id').value) {
    employee.id = byId('set-id').value;
    employeeCol.set(employee);
  } else {
    employeeCol.add(employee);
  }

  resetAllTextInputs();
}

function loadEmployee () {
  employeeCol.getItem(this.dataset.id).then(e => {
    byId('set-id').value = e.id;
    byId('set-name').value = e.name;
    byId('set-dpto').value = e.dpto;
  });
}
