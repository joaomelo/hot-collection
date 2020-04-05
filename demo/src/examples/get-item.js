import HotCollection from '__lib'; // '@joaomelo/hot-collection';
import { db } from '../services';
import { getById } from '../helpers';

export function renderGetItemExample (el) {
  const employeeCol = new HotCollection(db, 'employees');

  getById('get-item-get').onclick = () => {
    const id = getById('get-item-id').value;
    employeeCol.getItem(id).then(e => {
      el.innerHTML = `<pre>${JSON.stringify(e)}</pre>`;
    });
  };
}
