import { convertDocToItem, convertItemToDoc } from './adapters';

function mountConfig (db, collection, options) {
  const itemToDocAdapter = convertItemToDoc;
  const docToItemAdapter = convertDocToItem;

  return {
    db,
    collection: {
      title: collection,
      ref: db.collection(collection)
    },
    adapters: {
      itemToDoc: itemToDocAdapter,
      docToItem: docToItemAdapter
    }
  };
}

function createQuery (config) {
  return config.collection.ref;
}

export { mountConfig, createQuery };
