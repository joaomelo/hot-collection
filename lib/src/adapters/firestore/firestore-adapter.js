import { Adapter } from '../adapter';
import { createQuery } from './query';

class FirestoreAdapter extends Adapter {
  initialization ({ collection, options, collectionUpdatedSignal }) {
    this.db = options.adapter.firestore;
    this.collection.reference = this.db.collection(collection);
    this.query = createQuery(this.collection.reference, this.options);
  }

  startListeningToServer () {
    this.query.onSnapshot(snapshot => this.serverFinishedUpdate.next(snapshot.docs));
  }

  processDocsToItems (docs) {
    const adapter = null; // this.config.docToItemAdapter;
    const items = docs.map(doc => {
      const docData = { ...doc.data() };
      const itemData = adapter ? adapter(docData) : docData;
      const item = {
        id: doc.id,
        collection: this.collection.name,
        ...itemData
      };
      return item;
    });
    return items;
  }

  add (item) {
    const doc = this.convertItemToDoc(item);
    const promise = this.collection.reference.add(doc);
    return promise;
  };

  set (item) {
    const docRef = this.collection.reference.doc(item.id);
    const doc = this.convertItemToDoc(item);
    const promise = docRef.set(doc);
    return promise;
  }

  update (item) {
    const docRef = this.collection.reference.doc(item.id);
    const doc = this.convertItemToDoc(item);
    const promise = docRef.update(doc);
    return promise;
  }

  del (id) {
    const promise = this.collection.reference.doc(id).delete();
    return promise;
  }
}

export { FirestoreAdapter };
