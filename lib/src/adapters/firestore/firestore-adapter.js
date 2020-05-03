import { Adapter } from '../adapter';
import { createQuery } from './query';
import { convertItemToDoc } from './conversion';
// import { solveConfig } from './config';
// import { saveVersion } from './version';

class FirestoreAdapter extends Adapter {
  initialization ({ collection, options, collectionUpdatedSubject }) {
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
    const adapter = null; // this.config.itemToDocAdapter
    const doc = convertItemToDoc(item, adapter);
    const promise = this.collection.reference.add(doc);

    // const hotCol = this;
    // promise.then(docRef => {
    //   if (this.config.isSafeMode) {
    //     const itemWithId = {
    //       id: docRef.id,
    //       ...item
    //     };
    //     saveVersion(hotCol, itemWithId);
    //   }
    // });

    return promise;
  };

  // set (item) {
  //   const docRef = this.config.collectionReference.doc(item.id);
  //   const newDocData = convertItemToDoc(item, this.config.itemToDocAdapter);
  //   const setPromise = docRef.set(newDocData);

  //   if (this.config.isSafeMode) {
  //     saveVersion(this, item);
  //   }

  //   return setPromise;
  // }

  // del (id) {
  //   if (this.config.isSafeMode) {
  //     return this.getItem(id)
  //       .then(item => {
  //         item.deleted = true;
  //         const promises = Promise.all([this.set(item), saveVersion(this, item)]);
  //         return promises;
  //       });
  //   } else {
  //     return this.config.collectionReference.doc(id).delete();
  //   }
  // }
}

export { FirestoreAdapter };
