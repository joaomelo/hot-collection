import merge from 'lodash.merge';
import { Adapter } from '../adapter';
import { inMemoryDb } from './in-memory-db';

class InMemoryAdapter extends Adapter {
  initialization ({ collection, options, collectionUpdatedSignal }) {
    this.db = inMemoryDb;
  }

  startListeningToServer () {
    this.db.subscribe(this.collection.name, docs => this.serverFinishedUpdate.next(docs));
  }

  processDocsToItems (docs) {
    const items = docs.map(doc => this.checkAndReturnFromDocToItem(...doc));
    return items;
  }

  add (item) {
    const doc = this.convertItemToDoc(item);
    const id = this.db.add(this.collection.name, doc);
    this.checkAndCreateVersion({ id, ...doc }, 'added');
  }

  set (item) {
    const doc = this.convertItemToDoc(item);
    this.checkAndCreateVersion({ id: item.id, ...doc }, 'set');
    return this.db.set(this.collection.name, item.id, doc);
  }

  update (item) {
    const originalDoc = this.db.get(this.collection.name, item.id);
    const mergedDoc = merge(originalDoc, item);
    const newDoc = this.convertItemToDoc(mergedDoc);
    this.checkAndCreateVersion({ id: item.id, ...newDoc }, 'updated');
    return this.db.set(this.collection.name, item.id, newDoc);
  }

  del (id) {
    this.checkAndCreateVersion({ id }, 'deleted');
    return this.db.del(this.collection.name, id);
  }

  checkAndCreateVersion (data, operation) {
    if (this.options.saveMode !== 'safe') return;

    const version = {
      modified: new Date(),
      source: this.collection.name,
      operation: operation,
      data: JSON.stringify(data)
    };

    return this.db.add('versions', version);
  }
}

export { InMemoryAdapter };
