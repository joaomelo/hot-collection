import { Adapter } from '../adapter';
import { inMemoryDb } from './in-memory-db';

class InMemoryAdapter extends Adapter {
  initialization ({ collection, options, collectionUpdatedSubject }) {
    this.db = inMemoryDb;
  }

  startListeningToServer () {
    this.db.subscribe(this.collection.name, docs => this.serverFinishedUpdate.next(docs));
  }

  processDocsToItems (docs) {
    return docs;
  }

  add (item) {
    this.db.add(this.collection.name, item);
  }
}

export { InMemoryAdapter };
