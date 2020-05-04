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
    return docs;
  }

  convertItemToDoc (item) {
    const doc = { ...item };
    delete doc.id;
    delete doc.collection;
    return doc;
  }

  add (item) {
    const doc = this.convertItemToDoc(item);
    this.db.add(this.collection.name, doc);
  }

  set (item) {
    const doc = this.convertItemToDoc(item);
    this.db.set(this.collection.name, item.id, doc);
  }

  update (item) {
    const originalDoc = this.db.get(this.collection.name, item.id);
    const mergedDoc = merge(originalDoc, item);
    const newDoc = this.convertItemToDoc(mergedDoc);
    this.db.set(this.collection.name, item.id, newDoc);
  }
}

export { InMemoryAdapter };
