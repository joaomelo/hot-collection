import { BehaviorSubject } from 'rxjs';
import { resolveAdapter } from './adapters/resolver';

class HotCollection {
  constructor (collection, options = { adapter: 'in-memory' }) {
    validateSaveMode(collection, options);

    const collectionUpdatedSignal = new BehaviorSubject([]);
    this.collectionUpdatedSignal = collectionUpdatedSignal;
    this.adapter = resolveAdapter({
      collection,
      options,
      collectionUpdatedSignal
    });
  }

  subscribe (observer) {
    return this.collectionUpdatedSignal.subscribe(observer);
  }

  add (item) {
    return this.adapter.add(item);
  }

  set (item) {
    return this.adapter.set(item);
  }

  update (item) {
    return this.adapter.update(item);
  }

  del (id) {
    return this.adapter.del(id);
  }
}

function validateSaveMode (collection, options) {
  const validSaveModes = ['safe', 'default'];
  const saveMode = options.saveMode || 'default';
  if (!validSaveModes.includes(saveMode)) {
    throw new TypeError("saveMode option must be equal do 'default' or 'safe'");
  }

  if (collection === 'versions' && options.saveMode === 'safe') {
    throw new Error('versions collection name is compatible with safe mode');
  }
}

export { HotCollection };
