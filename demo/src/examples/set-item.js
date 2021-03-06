import HotCollection from '__lib'; // '@joaomelo/hot-collection';
import { byId, query, resetAllTextInputs } from '../helpers';

function renderSetItemExample (examplesEl, options) {
  const sectionEl = document.createElement('section');
  sectionEl.innerHTML = `
    <h3 class="example-title">Example: Set Employee</h3>
    <form>
      <input type="text" id="ipt-set-item-id" readonly />
      <input type="text" id="ipt-set-item-name" placeholder="name" />
      <button id="btn-set-item-set" type="button">set</button>
      <button id="btn-set-item-update" type="button">update</button>
    </form>
    <div id="set-item-example" class="example-content"></div>
    `;
  examplesEl.appendChild(sectionEl);

  renderSetItem(byId('set-item-example'), options);
};

function renderSetItem (el, options) {
  const employeeCollection = new HotCollection('employees', options);

  byId('btn-set-item-set').onclick = () => editEmployee(employeeCollection, 'set');
  byId('btn-set-item-update').onclick = () => editEmployee(employeeCollection, 'update');

  employeeCollection.subscribe(employees => {
    el.innerHTML = employees.length <= 0
      ? '<p>no employees found</p>'
      : `<ul>${employees.reduce((a, e) => a + `${renderListItem(e)}`, '')}</ul>`;

    query('.btn-set-item-edit').forEach(btn => {
      btn.onclick = () => {
        byId('ipt-set-item-id').value = btn.dataset.id;
        byId('ipt-set-item-name').value = btn.dataset.name;
      };
    });
  });
};

function renderListItem (e) {
  const btn = `<button data-id="${e.id}" data-name="${e.name}" class="btn-set-item-edit" type="button">Edit</button>`;
  const li = `<li>${e.name}:${e.dpto || 'no dpto'}${btn}</li>`;
  return li;
};

function editEmployee (collection, method) {
  const id = byId('ipt-set-item-id').value;
  const name = byId('ipt-set-item-name').value;

  if (!(id || name)) return;

  collection[method]({ id, name });
  resetAllTextInputs();
}

export { renderSetItemExample };
