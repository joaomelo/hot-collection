import HotCollection from '__lib'; // '@joaomelo/hot-collection';
import { db } from '../services';

export async function renderGetExample (el) {
  const employeeCol = new HotCollection(db, 'employees');
  const employees = await employeeCol.getItems();

  if (employees.length === 0) {
    employeeCol.add({ name: 'John' });
  }

  el.innerHTML = `
    <ul> 
        ${employees.reduce((a, e) => (a += `<li>${e.name}</li>`), '')}
    </ul>
  `;
}
