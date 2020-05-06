import HotCollection from '__lib'; // '@joaomelo/hot-collection';
import { byId, query } from '../helpers';

function renderQueryItemsExample (examplesEl, options) {
  const sectionEl = document.createElement('section');
  sectionEl.innerHTML = `
    <h3>Example: Query Items</h3>
    <form>
        <input type="number" id="ipt-qry-items-max" name="ipt-qry-items-max" value="1" min="1" max="5" class="ctl-qry-items"/>
        <select name="sel-qry-items-sort" id="sel-qry-items-sort" class="ctl-qry-items">
          <option value="asc">asc</option>
          <option value="desc">desc</option>
        </select>
        <select name="sel-qry-items-filter" id="sel-qry-items-filter" class="ctl-qry-items">
          <option value="IT">IT</option>
          <option value="HR">HR</option>
          <option value="Finance">Finance</option>
        </select>
    </form>
    <div id="qry-items-example" class="example-content"></div>
  `;
  examplesEl.appendChild(sectionEl);

  query('.ctl-qry-items').forEach(sel => sel.addEventListener('change', () => renderQryItems(byId('qry-items-example'), options)));
};

function renderQryItems (el, options) {
  const max = parseInt(byId('ipt-qry-items-max').value);
  const sort = byId('sel-qry-items-sort').value;
  const dpto = byId('sel-qry-items-filter').value;

  if (options.adapter.airtable) {
    options.query = {
      maxRecords: max,
      sort: [{
        field: 'name',
        direction: sort
      }],
      filterByFormula: `dpto='${dpto}'`
    };
  };

  if (options.adapter.firestore) {
    options.query = {
      limit: max,
      orderBy: {
        field: 'name',
        sort
      },
      where: [{
        field: 'dpto',
        operator: '==',
        value: dpto
      }]
    };
  };

  const employeeCollection = new HotCollection('employees', options);
  employeeCollection.subscribe(employees => {
    el.innerHTML = employees.length <= 0
      ? '<p>no employees found</p>'
      : `<ul>${employees.reduce((a, e) => a + `<li>${e.name}: ${e.dpto || 'no dpto'}</li>`, '')}</ul>`;
  });
}

export { renderQueryItemsExample };
