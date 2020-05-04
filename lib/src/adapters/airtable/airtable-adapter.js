import { timer } from 'rxjs';
import { Adapter } from '../adapter';
import { requestUnderLimit } from './rate-limiter';

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
    const that = this;
    const doc = this.convertItemToDoc(item);
    const create = () => that.collection.reference.create(doc, { typecast: true });
    return requestUnderLimit(create);
  }

  set (item) {
    const that = this;
    const doc = this.convertItemToDoc(item);
    const replace = () => that.collection.reference.replace(item.id, doc, { typecast: true });
    return requestUnderLimit(replace);
  }

  update (item) {
    const that = this;
    const doc = this.convertItemToDoc(item);
    const update = () => that.collection.reference.replace(item.id, doc, { typecast: true });
    return requestUnderLimit(update);
  }

  del (id) {
    const that = this;
    const destroy = () => that.collection.reference.destroy(id);
    return requestUnderLimit(destroy);
  }
}

export { AirtableAdapter };
