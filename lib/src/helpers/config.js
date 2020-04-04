import { mockDb } from '../mock';
import { createQuery } from './query';

const SAVE_MODE = {
  DEFAULT: 'default',
  SAFE: 'safe'
};

class HotCollectionConfiguration {
  constructor (db, collection, options = {}) {
    this.state = {
      db: (typeof db === 'string') ? mockDb : db,
      saveMode: resolveSaveMode(options),
      collection: {
        name: collection,
        reference: undefined
      },
      query: {
        reference: undefined,
        where: options.where,
        orderBy: options.orderBy
      },
      adapters: {
        itemToDoc: options.adapters && options.adapters.itemToDoc,
        docToItem: options.adapters && options.adapters.docToItem
      }
    };
  }

  get db () {
    return this.state.db;
  }

  get isSafeMode () {
    return this.state.saveMode === SAVE_MODE.SAFE;
  }

  get collectionReference () {
    if (!this.state.collection.reference) {
      this.state.collection.reference = this.state.db.collection(this.state.collection.name);
    }
    return this.state.collection.reference;
  }

  get queryReference () {
    if (!this.state.query.reference) {
      this.state.query.reference = createQuery(
        this.collectionReference,
        this.state.query.where,
        this.state.query.orderBy
      );
    }

    return this.state.query.reference;
  }

  get itemToDocAdapter () {
    return this.state.adapters.itemToDoc;
  }

  get docToItemAdapter () {
    return this.state.adapters.docToItem;
  }
}

function resolveSaveMode (options) {
  const saveMode = options.saveMode || SAVE_MODE.DEFAULT;
  const validSaveModes = Object.values(SAVE_MODE);

  if (!validSaveModes.includes(saveMode)) {
    throw new TypeError('saveMode option is invalid');
  }

  return saveMode;
}

export { HotCollectionConfiguration };
