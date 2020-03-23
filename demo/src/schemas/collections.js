import Vue from 'vue';
import HotCollection from '__lib';
import { firedb } from '../services';

const SHOULD_MOCK = true;

function createHotCollection (schema) {
  const collectionName = schema.labels.plural.toLowerCase();
  const options = {
    orderBy: schema.fields[0].key,
    saveMode: 'safe'
  };
  const db = SHOULD_MOCK ? 'mock' : firedb;
  const hotCollection = new HotCollection(db, collectionName, options);
  Vue.observable(hotCollection.state);
  return hotCollection;
};

export { createHotCollection };
