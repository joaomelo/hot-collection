import { BehaviorSubject } from 'rxjs';
import { resolveAdapter } from './adapters/resolver';

class HotCollection {
  constructor (collection, options = { adapter: 'in-memory' }) {
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

export { HotCollection };
