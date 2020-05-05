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
    const items = docs.map(doc => this.checkAndReturnFromDocToItem(...doc));
    return items;
  }

  convertItemToDoc (item) {
    let doc = this.checkAndReturnFromItemToDoc({ ...item });
    delete doc.id;
    doc.collection = this.collection.name;

    doc = JSON.stringify(doc);
    return doc;
  }

  add (item) {
    const id = uuidv4();
    const doc = this.convertItemToDoc(item);
    this.checkAndCreateVersion({ id, ...JSON.parse(doc) }, 'added');
    this.db.setItem(id, doc);
    this.fireSyntheticServerUpdateSignal();
  }

  set (item) {
    const doc = this.convertItemToDoc(item);
    this.checkAndCreateVersion({ id: item.id, ...JSON.parse(doc) }, 'set');
    this.db.setItem(item.id, doc);
    this.fireSyntheticServerUpdateSignal();
  }

  update (item) {
    const originalDoc = JSON.parse(this.db.getItem(item.id));
    const mergedDoc = merge(originalDoc, item);
    const newDoc = this.convertItemToDoc(mergedDoc);
    this.checkAndCreateVersion({ id: item.id, ...JSON.parse(newDoc) }, 'updated');
    this.db.setItem(item.id, newDoc);
    this.fireSyntheticServerUpdateSignal();
  }

  del (id) {
    this.checkAndCreateVersion(JSON.stringify({ id }), 'deleted');
    this.db.removeItem(id);
    this.fireSyntheticServerUpdateSignal();
  }

  checkAndCreateVersion (data, operation) {
    if (this.options.saveMode !== 'safe') return;

    const id = uuidv4();
    const version = {
      modified: new Date(),
      source: this.collection.name,
      collection: 'versions',
      operation: operation,
      data: JSON.stringify(data)
    };

    return this.db.setItem(id, JSON.stringify(version));
  }
}

export { LocalStorageAdapter };
