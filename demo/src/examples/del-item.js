import HotCollection from '__lib'; // '@joaomelo/hot-collection';
import { byId, query } from '../helpers';

function renderDelItemExample (examplesEl, options) {
  const sectionEl = document.createElement('section');
  sectionEl.innerHTML = `
    <h3 class="example-title">Example: Del Employee</h3>
    <div id="del-item-example" class="example-content"></div>
    `;
  examplesEl.appendChild(sectionEl);
  renderDelItem(byId('del-item-example'), options);
};

function renderDelItem (el, options) {
  const employeeCollection = new HotCollection('employees', options);

  employeeCollection.subscribe(employees => {
    el.innerHTML = employees.length <= 0
      ? '<p>no employees found</p>'
      : `<ul>${employees.reduce((a, e) => a + `${renderListItem(e)}`, '')}</ul>`;
    query('.btn-del-item-del').forEach(btn => { btn.onclick = () => employeeCollection.del(btn.dataset.id); });
  });
};

function renderListItem (e) {
  const btn = `<button data-id="${e.id}" class="btn-del-item-del" type="button">Del</button>`;
  const li = `<li>${e.name}:${e.dpto || 'no dpto'}${btn}</li>`;
  return li;
};

export { renderDelItemExample };
