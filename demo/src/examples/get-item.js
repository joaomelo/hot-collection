import HotCollection from '__lib'; // '@joaomelo/hot-collection';
import { db } from '../services';
import { byId } from '../helpers';

export function renderGetItemExample (el) {
  const employeeCol = new HotCollection(db, 'employees');

  byId('get-item-get').onclick = () => {
    const id = byId('get-item-id').value;
    employeeCol.getItem(id).then(e => {
      el.innerHTML = `<pre>${JSON.stringify(e)}</pre>`;
    });
  };
}
