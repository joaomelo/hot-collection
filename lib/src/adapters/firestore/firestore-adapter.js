import { Adapter } from '../adapter';
import { createQuery } from './query';

class FirestoreAdapter extends Adapter {
  initState ({ collection, options }) {
    super.initState({ collection, options });
    this.db = options.adapter.firestore;
    this.collection.reference = this.db.collection(collection);
    this.query = createQuery(this.collection.reference, options.query || {});
  }

  setEventDynamics (adapterUpdateSignal) {
    super.setEventDynamics(adapterUpdateSignal);
    this.query.onSnapshot(snapshot => this.serverStateChangedSignal.next(snapshot.docs));
  }

  extractDocData (doc) {
    return doc.data();
  }

  addToDatabase (doc) {
    return this.collection.reference.add(doc).then(docRef => docRef.id);
  };

  setToDatabase (id, doc) {
    return this.collection.reference.doc(id).set(doc);
  }

  updateToDatabase (id, doc) {
    return this.collection.reference.doc(id).update(doc);
  }

  delInDatabase (id) {
    return this.collection.reference.doc(id).delete();
  }

  addToVersions (version) {
    return this.db.collection('versions').add(version);
  }
}

export { FirestoreAdapter };
