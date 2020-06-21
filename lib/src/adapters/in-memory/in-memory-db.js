import { v4 as uuidv4 } from 'uuid';
import { Subject } from 'rxjs';

const inMemoryDb = {
  collections: new Map(),

  getCollection (name) {
    if (!this.collections.has(name)) {
      this.collections.set(name, {
        map: new Map(),
        subject: new Subject([])
      });
    }
    return this.collections.get(name);
  },

  getSubject (name) {
    const collection = this.getCollection(name);
    return collection.subject;
  },

  getMap (name) {
    const collection = this.getCollection(name);
    return collection.map;
  },

  subscribe (name, observer) {
    const subject = this.getSubject(name);
    subject.subscribe(observer);
  },

  notify (name) {
    const docs = [];
    const map = this.getMap(name);
    map.forEach((doc, id) => docs.push({
      id,
      collection: name,
      ...doc
    }));

    const subject = this.getSubject(name);
    subject.next(docs);
  },

  get (name, id) {
    const map = this.getMap(name);
    const doc = map.get(id);
    return doc;
  },

  add (name, item) {
    const map = this.getMap(name);
    const id = uuidv4();
    map.set(id, item);
    this.notify(name);
    return id;
  },

  set (name, id, item) {
    const map = this.getMap(name);
    map.set(id, item);

    this.notify(name);
  },

  del (name, id) {
    const map = this.getMap(name);
    map.delete(id);
    this.notify(name);
  }
};

export { inMemoryDb };
