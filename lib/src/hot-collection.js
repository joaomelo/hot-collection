import { BehaviorSubject, Subject } from 'rxjs';
import { resolveAdapter } from './adapters/resolver';

class HotCollection {
  constructor (collection, options) {
    this.collection = collection;
    this.connect(options);
  }

  connect (options) {
    validateSaveMode(this.collection, options);

    // disable an old adapter setup if exists
    if (this.adapter) {
      this.adapterUpdateSignalSubscription.unsubscribe();
      this.adapterUpdateSignal.complete();
      this.adapter = null;
    }

    // signal that items where rebooted
    if (this.collectionUpdatedSignal) {
      this.collectionUpdatedSignal.next([]);
    } else {
      this.collectionUpdatedSignal = new BehaviorSubject([]);
      this.collectionUpdatedSignal.subscribe(items => { this.items = items; });
    }

    if (!options.adapter) return;

    this.adapterUpdateSignal = new Subject();
    this.adapterUpdateSignalSubscription =
      this.adapterUpdateSignal.subscribe(items =>
        this.collectionUpdatedSignal.next(items)
      );
    this.adapter = resolveAdapter({
      options,
      collection: this.collection,
      adapterUpdateSignal: this.adapterUpdateSignal
    });
  }

  subscribe (observer) {
    return this.collectionUpdatedSignal.subscribe(observer);
  }

  getItems () {
    return this.items;
  }

  getItem (id) {
    return this.items.find(item => item.id === id);
  }

  add (item) {
    this.checkConnectionAndThrow();
    return this.adapter.add(item);
  }

  set (item) {
    this.checkConnectionAndThrow();
    return this.adapter.set(item);
  }

  update (item) {
    this.checkConnectionAndThrow();
    return this.adapter.update(item);
  }

  del (id) {
    this.checkConnectionAndThrow();
    return this.adapter.del(id);
  }

  checkConnectionAndThrow () {
    if (!this.adapter) {
      throw new Error('Data manipulation is impossible without an adapter connection');
    }
  }
}

function validateSaveMode (collection, options = {}) {
  // check save mode option
  const validSaveModes = ['safe', 'default'];
  const saveMode = options.saveMode || 'default';
  if (!validSaveModes.includes(saveMode)) {
    throw new TypeError('saveMode option value must equal "default" or "safe"');
  }

  if (collection === 'versions' && saveMode === 'safe') {
    throw new Error('"versions" collection name is incompatible with safe mode');
  }
}

export { HotCollection };
