import { BehaviorSubject, Subject } from 'rxjs';
import { resolveAdapter } from './adapters/resolver';

class HotCollection {
  constructor (collection, options) {
    this.collection = collection;
    this.collectionUpdatedSignal = new BehaviorSubject([]);
    this.collectionUpdatedSignal.subscribe(items => { this.items = items; });

    if (options) {
      this.connect(options);
    }
  }

  connect (options) {
    validateOptions(this.collection, options);

    this.disconnect();

    this.adapterUpdateSignal = new Subject();
    this.adapterUpdateSignalSubscription = this.adapterUpdateSignal.subscribe(items => {
      this.collectionUpdatedSignal.next(items);
    });
    this.adapter = resolveAdapter({
      options,
      collection: this.collection,
      adapterUpdateSignal: this.adapterUpdateSignal
    });
  }

  disconnect () {
    if (!this.adapter) return;

    // disable adapter setup
    this.adapterUpdateSignalSubscription.unsubscribe();
    this.adapterUpdateSignal.complete();
    this.adapter = null;

    // clean and signal empty array state
    this.collectionUpdatedSignal.next([]);
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

function validateOptions (collection, options) {
  if (!options.adapter) {
    throw new Error('no adapter setup was found in options');
  }

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
