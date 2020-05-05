import HotCollection from '__lib'; // '@joaomelo/hot-collection';
import { byId } from '__demo/helpers';

function renderListItemsExample (examplesEl, adapter) {
  const sectionEl = document.createElement('section');
  sectionEl.innerHTML = `
  <h3 class="example-title">Example: List Employees</h3>
  <small>The list updates automatically if data changes on the database</small>
  <div id="list-items-example" class="example-content"></div>`;
  examplesEl.appendChild(sectionEl);

  renderListItems(byId('list-items-example'), adapter);
};

function renderListItems (el, options) {
  const employeeCollection = new HotCollection('employees', options);
  employeeCollection.subscribe(employees => {
    el.innerHTML = employees.length <= 0
      ? '<p>no employees found</p>'
      : `<ul>${employees.reduce((a, e) => a + `<li>${e.id}: ${e.name}</li>`, '')}</ul>`;
  });
}

export { renderListItemsExample };
