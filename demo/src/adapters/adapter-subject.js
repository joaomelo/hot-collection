import { BehaviorSubject } from 'rxjs';
import { servicesSubject } from '__demo/services';
import { adapterChoiceSubject } from './adapter-ui';

const adapters = {
  'in-memory': 'in-memory',
  'local-storage': { localStorage: window.localStorage },
  firestore: { firestore: null },
  airtable: { airtable: null }
};

servicesSubject.subscribe(({ firestore, airtable }) => {
  adapters.firestore = { firestore: firestore || null };
  adapters.airtable = { airtable: airtable || null };
});

const adapterSubject = new BehaviorSubject(adapters.inMemory);
adapterChoiceSubject.subscribe(adapterChoosed => {
  adapterSubject.next(adapters[adapterChoosed]);
});

export { adapterSubject };
