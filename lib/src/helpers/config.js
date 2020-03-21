class HotCollectionConfiguration {
  static SAVE_MODE = {
    DEFAULT: 'default',
    SAFE: 'safe'
  };

  constructor (db, collection, options) {
    this.state = {
      db,
      collection: {
        title: collection,
        ref: db.collection(collection)
      },
      adapters: {
        itemToDoc: options?.adapters?.itemToDoc,
        docToItem: options?.adapters?.docToItem
      },
      saveMode: extractSaveMode(options)
    };
  }

  get collectionReference () {
    return this.state.collection.ref;
  }

  get itemToDocAdapter () {
    return this.state.adapters.itemToDoc;
  }

  get docToItemAdapter () {
    return this.state.adapters.docToItem;
  }

  get db () {
    return this.state.db;
  }

  get isSafeMode () {
    return this.state.saveMode === HotCollectionConfiguration.SAVE_MODE.SAFE;
  }
}

function extractSaveMode (options) {
  const saveMode = options?.saveMode || HotCollectionConfiguration.SAVE_MODE.DEFAULT;
  const validSaveModes = Object.values(HotCollectionConfiguration.SAVE_MODE);

  if (!validSaveModes.includes(saveMode)) {
    throw new TypeError('saveMode option is invalid');
  }

  return saveMode;
}

export { HotCollectionConfiguration };
