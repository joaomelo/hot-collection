import merge from 'lodash.merge';
import { v4 as uuidv4 } from 'uuid';
import { Adapter } from '../adapter';

class LocalStorageAdapter extends Adapter {
  initState ({ collection, options }) {
    super.initState({ collection, options });
    this.db = this.options.adapter.localStorage;
  }

  setEventDynamics (adapterUpdateSignal) {
    super.setEventDynamics(adapterUpdateSignal);
    window.addEventListener('storage', () => this.serverStateChangedSignal.next());
  }

  fireSyntheticServerStateChangedSignal () {
    // storage events are only fired for different browser tabs
    // this makes a synthetic storage event fires in the same tab
    const event = new Event('storage');
    window.dispatchEvent(event);
  }

  promiseDocsFromDatabase () {
    const storage = this.db;
    const docs = [];
    for (let i = 0; i < storage.length; i++) {
      const id = storage.key(i);
      let doc;
      try { doc = JSON.parse(storage.getItem(id)); } catch { continue; };

      if (doc.collection === this.collection.name) {
        docs.push({ id, ...doc });
      }
    }
    return Promise.resolve(docs);
  }

  convertItemToDoc (item) {
    const doc = super.convertItemToDoc(item);
    doc.collection = this.collection.name;
    return doc;
  }

  addToDatabase (doc) {
    const id = uuidv4();
    this.db.setItem(id, JSON.stringify(doc));
    return Promise.resolve(id);
  }

  setToDatabase (id, doc) {
    this.db.setItem(id, JSON.stringify(doc));
    return Promise.resolve({ id, ...doc });
  }

  updateToDatabase (id, doc) {
    const originalDoc = JSON.parse(this.db.getItem(id));
    const mergedDoc = merge(originalDoc, doc);
    this.db.setItem(id, JSON.stringify(mergedDoc));
    return Promise.resolve({ id, ...doc });
  }

  delInDatabase (id) {
    this.db.removeItem(id);
    return Promise.resolve({ id });
  }

  addToVersions (version) {
    const id = uuidv4();
    version.collection = 'versions';
    return this.db.setItem(id, JSON.stringify(version));
  }
}

export { LocalStorageAdapter };
