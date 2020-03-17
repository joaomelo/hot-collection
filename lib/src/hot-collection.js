import { mountConfig, createQuery } from './helpers/plumbing';
import { subscribe, publish } from '@joaomelo/bus';

const STATE_UPDATED = Symbol('STATE_UPDATED');

class HotCollection {
  constructor (db, collection, options) {
    this.config = mountConfig(db, collection, options);

    this.state = {
      items: []
    };

    this.__ignite();
  }

  __ignite () {
    const query = createQuery(this.config);
    query.onSnapshot(snapshot => {
      this.__update(snapshot.docs);
    });
  }

  __update (docs) {
    // replace the array content without loosing reference to it
    // so app code that rely on the original reference won't break
    const items = this.state.items;
    const newItemsContent = docs.map(doc => this.config.adapters.docToItem(doc));
    items.splice(0, items.length, ...newItemsContent);

    publish(STATE_UPDATED, items);
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

  add (item) {
    const doc = this.config.adapters.itemToDoc(item);
    return this.config.collection.ref.add(doc);
  }

  set (id, item) {
    const doc = this.config.adapters.itemToDoc(item);
    return this.config.collection.ref.doc(id).set(doc);
  }

  del (id) {
    return this.config.collection.ref.doc(id).delete();
  }
}

export { HotCollection };
