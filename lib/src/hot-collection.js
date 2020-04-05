import { subscribe, publish } from '@joaomelo/bus';
import { HotCollectionConfiguration } from './helpers/config';
import { convertDocsToItems, convertItemToDoc } from './helpers/conversion';
import { saveVersion } from './helpers/version';

const STATE_UPDATED = Symbol('STATE_UPDATED');
const STATUSES = {
  IDLE: Symbol('STATUSES_IDLE'),
  LOADING: Symbol('STATUSES_LOADING')
};

class HotCollection {
  constructor (db, collection, options) {
    this.state = {
      status: STATUSES.LOADING,
      items: []
    };

    this.config = new HotCollectionConfiguration(db, collection, options);
    this.__ignite();
  }

  __ignite () {
    const query = this.config.queryReference;
    query.onSnapshot(snapshot => {
      // firestore dispatch this snapshot events even before send changes to the backend
      // https://firebase.google.com/docs/firestore/query-data/listen#events-local-changes

      this.state.status = STATUSES.LOADING;
      const docs = snapshot.docs;
      const adapter = this.config.docToItemAdapter;
      this.state.items = convertDocsToItems(docs, adapter);
      this.state.status = STATUSES.IDLE;
      publish(STATE_UPDATED, this.state.items);
    });
  }

  subscribe (callback) {
    return subscribe(STATE_UPDATED, callback, true);
  }

  getItems () {
    const hotCol = this;
    const promise = new Promise((resolve, reject) => {
      if (this.state.status === STATUSES.IDLE) {
        resolve(hotCol.state.items);
      } else {
        const unsub = subscribe(STATE_UPDATED, items => {
          unsub();
          resolve(items);
        });
      }
    });

    return promise;
  }

  getItem (id) {
    const hotCol = this;

    const promise = new Promise((resolve, reject) => {
      hotCol.getItems().then(items => {
        const item = items.find(i => i.id === id);
        resolve(item);
      });
    });

    return promise;
  }

  add (item) {
    const hotCol = this;
    const doc = convertItemToDoc(item, this.config.itemToDocAdapter);
    const promise = this.config.collectionReference.add(doc);

    promise.then(docRef => {
      if (this.config.isSafeMode) {
        const itemWithId = {
          id: docRef.id,
          ...item
        };
        saveVersion(hotCol, itemWithId);
      }
    });

    return promise;
  };

  set (item) {
    const docRef = this.config.collectionReference.doc(item.id);
    const newDocData = convertItemToDoc(item, this.config.itemToDocAdapter);
    const setPromise = docRef.set(newDocData);

    if (this.config.isSafeMode) {
      saveVersion(this, item);
    }

    return setPromise;
  }

  del (id) {
    if (this.config.isSafeMode) {
      const item = this.getItem(id);
      item.deleted = true;
      const setPromise = this.set(item);
      saveVersion(this, item);
      return setPromise;
    } else {
      return this.config.collectionReference.doc(id).delete();
    }
  }
}

export { HotCollection };
