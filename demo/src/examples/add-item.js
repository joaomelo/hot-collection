import HotCollection from '__lib'; // '@joaomelo/hot-collection';
import { byId, resetAllTextInputs } from '../helpers';

function renderAddItemExample (examplesEl, adapter) {
  const sectionEl = document.createElement('section');
  sectionEl.innerHTML = `
    <h3 class="example-title">Example: Add Employee</h3>
    <form>
      <input type="text" id="ipt-add-item-name" placeholder="name" />
      <select id="sel-add-item-dpto">
        <option value="IT">IT</option>
        <option value="HR">HR</option>
        <option value="Finance">Finance</option>
      </select>
      <button id="btn-add-item" type="button">add</button>
    </form>
    <div id="add-item-example" class="example-content"></div>
  `;
  examplesEl.appendChild(sectionEl);

  renderAddItems(byId('add-item-example'), adapter);
};

function renderAddItems (el, adapter) {
  const employeeCollection = new HotCollection('employees', { adapter });

  byId('btn-add-item').addEventListener('click', () => {
    employeeCollection.add({
      name: byId('ipt-add-item-name').value,
      dpto: byId('sel-add-item-dpto').value
    });
    resetAllTextInputs();
  });

  employeeCollection.subscribe(employees => {
    el.innerHTML = employees.length <= 0
      ? '<p>no employees found</p>'
      : `<ul>${employees.reduce((a, e) => a + `<li>${e.name}: ${e.dpto || 'no dpto'}</li>`, '')}</ul>`;
  });
};

export { renderAddItemExample };
