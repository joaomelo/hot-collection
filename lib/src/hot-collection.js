import { subscribe, publish } from '@joaomelo/bus';
import { HotCollectionConfiguration } from './helpers/config';
import { convertSnapshotToItems, convertDocToItem, convertItemToDoc } from './helpers/conversion';
import { saveVersion } from './helpers/version';

const STATE_UPDATED = Symbol('STATE_UPDATED');

class HotCollection {
  constructor (db, collection, options) {
    this.config = new HotCollectionConfiguration(db, collection, options);

    this.state = {
      items: []
    };

    this.__ignite();
  }

  __ignite () {
    const query = this.config.queryReference;
    query.onSnapshot(snapshot => {
      this.state.items = convertSnapshotToItems(snapshot, this.config.docToItemAdapter);
      publish(STATE_UPDATED, this.state.items);
    });
  }

  subscribe (callback) {
    return subscribe(STATE_UPDATED, callback, true);
  }

  async loadItems () {
    const snapshot = await this.config.queryReference.get();
    const items = convertSnapshotToItems(snapshot, this.config.docToItemAdapter);
    return items;
  }

  async loadItem (id) {
    const doc = await this.config.collectionReference.doc(id).get();
    const item = convertDocToItem(doc, this.config.docToItemAdapter);
    return item;
  }

  async add (item) {
    const doc = convertItemToDoc(item, this.config.itemToDocAdapter);
    const addedDocReference = await this.config.collectionReference.add(doc);

    if (this.config.isSafeMode) {
      const itemWithid = {
        id: addedDocReference.id,
        ...item
      };
      saveVersion(this, itemWithid);
    }

    return addedDocReference;
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
