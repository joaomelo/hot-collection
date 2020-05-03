import { BehaviorSubject } from 'rxjs';
import { resolveAdapter } from './adapters/resolver';

class HotCollection {
  constructor (collection, options = { adapter: 'in-memory' }) {
    const collectionUpdatedSubject = new BehaviorSubject([]);
    this.collectionUpdatedSubject = collectionUpdatedSubject;
    this.adapter = resolveAdapter({
      collection,
      options,
      collectionUpdatedSubject
    });
  }

  subscribe (observer) {
    return this.collectionUpdatedSubject.subscribe(observer);
  }

  add (item) {
    return this.adapter.add(item);
  };

  set (item) {
    return this.adapter.set(item);
  }

  del (id) {
    return this.adapter.del(id);
  }
}

export { HotCollection };
