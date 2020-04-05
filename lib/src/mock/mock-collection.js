import { subscribe, publish } from '@joaomelo/bus';
import { MockRef } from './mock-ref';

class MockCollection {
  constructor (name) {
    this.name = name;
    this.docsRefs = new Map();
    this.UPDATE_EVENT_TAG = `${name}_UPDATED`;
  }

  add (doc) {
    const docRef = new MockRef(this, { docData: doc });
    this.docsRefs.set(docRef.id, docRef);
    this.publishUpdate();

    const promise = new Promise((resolve, reject) => {
      resolve(docRef);
    });

    return promise;
  }

  doc (id) {
    if (!this.docsRefs.has(id)) {
      const docRef = new MockRef(this, { id });
      this.docsRefs.set(docRef.id, docRef);
    }
    return this.docsRefs.get(id);
  }

  delete (id) {
    this.docsRefs.delete(id);
    this.publishUpdate();
  }

  orderBy () {
    return this;
  }

  onSnapshot (callback) {
    subscribe(this.UPDATE_EVENT_TAG, callback);
    this.publishUpdate();
  }

  publishUpdate () {
    const docs = Array.from(this.docsRefs.values());
    publish(this.UPDATE_EVENT_TAG, { docs });
  }
}

export { MockCollection };
