import { firestoreSubject } from './firebase';
import { airtableSubject } from './airtable';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

const servicesSubject = combineLatest(firestoreSubject, airtableSubject).pipe(
  map(([firestore, airtable]) => {
    return {
      firestore,
      airtable
    };
  })
);

export { servicesSubject };
