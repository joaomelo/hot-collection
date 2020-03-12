import { mountConfig, createQuery } from './helpers/plumbing';
import { subscribe, publish } from '@joaomelo/bus';

const STATE_UPDATED = Symbol('STATE_UPDATED');

class HotCollection {
  constructor (db, collection, options) {
    this.config = mountConfig(db, collection, options);

    this.state = {
      status: 'VIRGIN',
      items: []
    };

    this.__ignite();
  }

  __ignite () {
    const query = createQuery(this.config);
    query.onSnapshot(snapshot => this.__update(snapshot.docs));
  }

  __update (docs) {
    const newItems = [];
    docs.map(doc => newItems.push(this.config.adapters.docToItem(doc)));

    this.state = {
      status: 'UPDATED',
      items: newItems
    };

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
