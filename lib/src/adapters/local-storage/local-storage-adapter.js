import { v4 as uuidv4 } from 'uuid';
import { Adapter } from '../adapter';

class LocalStorageAdapter extends Adapter {
  initialization ({ collection, options, collectionUpdatedSubject }) {
    this.db = this.options.adapter.localStorage;
  }

  startListeningToServer () {
    const storage = this.db;
    window.addEventListener('storage', () => {
      const docs = [];
      for (let i = 0; i < storage.length; i++) {
        const id = storage.key(i);
        let doc;
        try { doc = JSON.parse(storage.getItem(id)); } catch { continue; };

        if (doc.collection === this.collection.name) {
          docs.push({ id, ...doc });
        }
      }
      this.serverFinishedUpdate.next(docs);
    });
  }

  fireSyntheticServerUpdateSignal () {
    // storage events are only fired for different browser tabs
    // this makes a synthetic storage event fires in the same tab
    const event = new Event('storage');
    window.dispatchEvent(event);
  }

  processDocsToItems (docs) {
    return docs;
  };

  add (item) {
    const id = uuidv4();
    const doc = {
      collection: this.collection.name,
      ...item
    };
    this.db.setItem(id, JSON.stringify(doc));
    this.fireSyntheticServerUpdateSignal();
  }
}

export { LocalStorageAdapter };
