import HotCollection from '__lib'; // '@joaomelo/hot-collection';
import { db } from './services';

async function renderLoadExample () {
  const employeeCol = new HotCollection(db, 'employes');
  const employees = await employeeCol.loadItems();

  if (employees.length === 0) {
    employeeCol.add({ name: 'John' });
  }

  const html = `
    <h3> Employees List </h3>
    <ul> 
        ${employees.map(e => `<li>${e.name}</li>`)}
    </ul>
  `;
  return html;
}

export { renderLoadExample };
