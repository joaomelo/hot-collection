import { timer } from 'rxjs';
import { Adapter } from '../adapter';

class AirtableAdapter extends Adapter {
  initialization ({ collection, options, collectionUpdatedSignal }) {
    this.db = options.adapter.airtable;
    this.interval = (options.adapter.interval || 2) * 1000;
    this.collection.reference = this.db(this.collection.name);
    this.query = this.collection.reference.select();
  }

  startListeningToServer () {
    const serverUpdateSignal = timer(this.interval, this.interval);
    serverUpdateSignal.subscribe(x => {
      const docs = [];
      this.query
        .eachPage((records, fetchNextPage) => {
          records.forEach(r => docs.push(r));
          fetchNextPage();
        })
        .then(() => this.serverFinishedUpdate.next(docs));
    });
  }

  processDocsToItems (docs) {
    const items = docs.map(doc => ({
      id: doc.id,
      collection: this.collection.name,
      ...doc.fields
    }));
    return items;
  }

  add (item) {
    return this.collection.reference.create(item, { typecast: true });
  }

  set (item) {
    console.log('airtable set');
  }

  update (item) {
    console.log('airtable update');
  }
}

export { AirtableAdapter };
