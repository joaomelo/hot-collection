import merge from 'lodash.merge';
import { v4 as uuidv4 } from 'uuid';
import { Adapter } from '../adapter';

class LocalStorageAdapter extends Adapter {
  initialization ({ collection, options, collectionUpdatedSignal }) {
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

  convertItemToDoc (item) {
    let doc = { ...item };
    delete doc.id;
    doc.collection = this.collection.name;

    doc = JSON.stringify(doc);
    return doc;
  }

  add (item) {
    const id = uuidv4();
    const doc = this.convertItemToDoc(item);
    this.db.setItem(id, doc);
    this.fireSyntheticServerUpdateSignal();
  }

  set (item) {
    const doc = this.convertItemToDoc(item);
    this.db.setItem(item.id, doc);
    this.fireSyntheticServerUpdateSignal();
  }

  update (item) {
    const originalDoc = JSON.parse(this.db.getItem(item.id));
    const mergedDoc = merge(originalDoc, item);
    const newDoc = this.convertItemToDoc(mergedDoc);
    this.db.setItem(item.id, newDoc);
    this.fireSyntheticServerUpdateSignal();
  }

  del (id) {
    this.db.removeItem(id);
    this.fireSyntheticServerUpdateSignal();
  }
}

export { LocalStorageAdapter };
