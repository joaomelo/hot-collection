import { subscribe, publish } from '@joaomelo/bus';
import { HotCollectionConfiguration } from './helpers/config';
import { convertDocToItem, convertItemToDoc } from './helpers/conversion';
import { createQuery } from './helpers/query';
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
    const query = createQuery(this.config);
    query.onSnapshot(snapshot => this.__update(snapshot.docs));
  }

  __update (docs) {
    const adapter = this.config.docToItemAdapter;
    this.state.items = docs.map(doc => convertDocToItem(doc, adapter));
    publish(STATE_UPDATED, this.state.items);
  }

  subscribe (callback) {
    return subscribe(STATE_UPDATED, callback, true);
  }

  get items () {
    return this.state.items;
  }

  getItem (id) {
    return this.items.find(i => i.id === id);
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
