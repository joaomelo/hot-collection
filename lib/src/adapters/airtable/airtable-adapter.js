import { Subject } from 'rxjs';
import { Adapter } from '../adapter';
import { requestUnderLimit } from './rate-limiter';

class AirtableAdapter extends Adapter {
  initialization ({ collection, options, collectionUpdatedSignal }) {
    this.db = options.adapter.airtable;
    this.collection.reference = this.db(this.collection.name);
    this.query = this.collection.reference.select(options.query || {});
    this.state = 'IDLE';
  }

  startListeningToServer () {
    this.serverUpdateSignal = new Subject();
    this.serverUpdateSignal.subscribe(() => {
      if (this.state === 'LOADING') return;
      this.state = 'LOADING';
      const docs = [];
      this.query
        .eachPage((records, fetchNextPage) => {
          records.forEach(r => docs.push(r));
          fetchNextPage();
        })
        .then(() => {
          this.state = 'IDLE';
          this.serverFinishedUpdate.next(docs);
        });
    });
  }

  fireSyntheticServerUpdateSignal () {
    this.serverUpdateSignal.next();
  }

  processDocsToItems (docs) {
    const items = docs.map(doc => {
      const item = this.checkAndReturnFromDocToItem({
        id: doc.id,
        collection: this.collection.name,
        ...doc.fields
      });
      return item;
    });

    return items;
  }

  add (item) {
    const that = this;
    const doc = this.convertItemToDoc(item);

    const create = () => {
      const createPromise = that.collection.reference.create(doc, { typecast: true });
      createPromise.then(record => {
        this.fireSyntheticServerUpdateSignal();
        this.checkAndCreateVersion({ id: record.id, ...doc }, 'added');
      });
    };
    return requestUnderLimit(create);
  }

  set (item) {
    const that = this;
    const doc = this.convertItemToDoc(item);
    this.checkAndCreateVersion({ id: item.id, ...doc }, 'set');
    const replace = () => {
      that.collection.reference.replace(item.id, doc, { typecast: true })
        .then(() => that.fireSyntheticServerUpdateSignal());
    };
    return requestUnderLimit(replace);
  }

  update (item) {
    const that = this;
    const doc = this.convertItemToDoc(item);
    this.checkAndCreateVersion({ id: item.id, ...doc }, 'updated');
    const update = () => {
      that.collection.reference.replace(item.id, doc, { typecast: true })
        .then(() => that.fireSyntheticServerUpdateSignal());
    };
    return requestUnderLimit(update);
  }

  del (id) {
    const that = this;
    this.checkAndCreateVersion({ id }, 'deleted');
    const destroy = () => {
      that.collection.reference.destroy(id)
        .then(() => that.fireSyntheticServerUpdateSignal());
    };
    return requestUnderLimit(destroy);
  }

  checkAndCreateVersion (data, operation) {
    if (this.options.saveMode !== 'safe') return;

    const version = {
      modified: new Date(),
      source: this.collection.name,
      operation: operation,
      data: JSON.stringify(data)
    };

    const versionCollection = this.db('versions');
    const create = () => versionCollection.create(version, { typecast: true });
    return requestUnderLimit(create);
  }
}

export { AirtableAdapter };
