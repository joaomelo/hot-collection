import { byId, byName } from '__demo/helpers';
import { servicesSubject } from '__demo/services';
import { BehaviorSubject } from 'rxjs';

const adapterChoiceSubject = new BehaviorSubject('in-memory');

function renderAdapterChooser (containerEl) {
  containerEl.innerHTML = `
    <h2>Choose an Adapter</h2>
    <form>
      <input type="radio" id="rd-in-memory" name="rds-adapter" value="in-memory" checked>
      <label for="rd-in-memory">in-memory</label>
      <input type="radio" id="rd-local-storage" name="rds-adapter" value="local-storage">
      <label for="rd-local-storage">local storage</label>
      <input type="radio" id="rd-firestore" name="rds-adapter" value="firestore">
      <label for="rd-firestore">firestore</label>
      <input type="radio" id="rd-airtable" name="rds-adapter" value="airtable">
      <label for="rd-airtable">airtable</label>
    </form>
  `;

  servicesSubject.subscribe(({ firestore, airtable }) => {
    byId('rd-firestore').disabled = !firestore;
    byId('rd-airtable').disabled = !airtable;
  });

  const radios = byName('rds-adapter');
  radios.forEach(radio => radio.addEventListener('click', e => adapterChoiceSubject.next(e.target.value)));
}

export { renderAdapterChooser, adapterChoiceSubject };
