import HotCollection from '__lib'; // '@joaomelo/hot-collection';
import { db } from '../services';
import { getAll } from '../helpers';
import { renderEmployees } from './common';

const employeeCol = new HotCollection(db, 'employees');

export function renderDelExample (el) {
  employeeCol.subscribe(items => {
    el.innerHTML = renderEmployees(items, 'del');
    getAll('.del-delbtn').forEach(btn => { btn.onclick = delEmployee; });
  });
};

function delEmployee () {
  employeeCol.del(this.dataset.id);
}
