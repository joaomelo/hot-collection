import merge from 'lodash.merge';
import { Adapter } from '../adapter';
import { inMemoryDb } from './in-memory-db';

class InMemoryAdapter extends Adapter {
  initState ({ collection, options }) {
    super.initState({ collection, options });
    this.db = inMemoryDb;
  }

  setEventDynamics (adapterUpdateSignal) {
    super.setEventDynamics(adapterUpdateSignal);
    this.db.subscribe(this.collection.name, docs => this.serverStateChangedSignal.next(docs));
  }

  addToDatabase (doc) {
    const id = this.db.add(this.collection.name, doc);
    return Promise.resolve(id);
  }

  setToDatabase (id, doc) {
    return Promise.resolve(this.db.set(this.collection.name, id, doc));
  }

  updateToDatabase (id, doc) {
    const originalDoc = this.db.get(this.collection.name, id);
    const mergedDoc = merge(originalDoc, doc);
    return Promise.resolve(this.db.set(this.collection.name, id, mergedDoc));
  }

  delInDatabase (id) {
    return Promise.resolve(this.db.del(this.collection.name, id));
  }

  addToVersions (version) {
    return this.db.add('versions', version);
  }
}

export { InMemoryAdapter };
