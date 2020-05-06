import { Adapter } from '../adapter';
import { createQuery } from './query';

class FirestoreAdapter extends Adapter {
  initialization ({ collection, options, collectionUpdatedSignal }) {
    this.db = options.adapter.firestore;
    this.collection.reference = this.db.collection(collection);

    console.log(options.query);

    this.query = createQuery(this.collection.reference, options.query || {});
  }

  startListeningToServer () {
    this.query.onSnapshot(snapshot => this.serverFinishedUpdate.next(snapshot.docs));
  }

  processDocsToItems (docs) {
    const adapter = null; // this.config.docToItemAdapter;
    const items = docs.map(doc => {
      const docData = { ...doc.data() };
      const itemData = adapter ? adapter(docData) : docData;
      const item = this.checkAndReturnFromDocToItem({
        id: doc.id,
        collection: this.collection.name,
        ...itemData
      });
      return item;
    });
    return items;
  }

  add (item) {
    const doc = this.convertItemToDoc(item);
    const addPromise = this.collection.reference.add(doc);

    const that = this;
    addPromise.then(docRef => that.checkAndCreateVersion({ id: docRef.id, ...doc }, 'added'));

    return addPromise;
  };

  set (item) {
    const docRef = this.collection.reference.doc(item.id);
    const doc = this.convertItemToDoc(item);
    this.checkAndCreateVersion({ id: item.id, ...doc }, 'set');
    const promise = docRef.set(doc);
    return promise;
  }

  update (item) {
    const docRef = this.collection.reference.doc(item.id);
    const doc = this.convertItemToDoc(item);
    this.checkAndCreateVersion({ id: item.id, ...doc }, 'updated');
    const promise = docRef.update(doc);
    return promise;
  }

  del (id) {
    this.checkAndCreateVersion({ id }, 'deleted');
    const promise = this.collection.reference.doc(id).delete();
    return promise;
  }

  checkAndCreateVersion (data, operation) {
    if (this.options.saveMode !== 'safe') return;

    const version = {
      modified: new Date(),
      source: this.collection.name,
      operation: operation,
      data: JSON.stringify(data)
    };

    const versionCollection = this.db.collection('versions');
    const promise = versionCollection.add(version);
    return promise;
  }
}

export { FirestoreAdapter };
