import { MockCollection } from './mock-collection';

class MockDb {
  constructor () {
    this.collections = new Map();
    this.app = {
      auth () {
        return {
          currentUser: {
            uid: 'mockid',
            email: 'mock@email.com'
          }
        };
      }
    };
  }

  collection (name) {
    if (!this.collections.has(name)) {
      const collection = new MockCollection(name);
      this.collections.set(name, collection);
    }
    return this.collections.get(name);
  }
}

export { MockDb };
