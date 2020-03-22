import Vue from 'vue';
import HotCollection from '__lib';
import { firedb } from '../services';

function createHotCollection (schema) {
  const collectionName = schema.labels.plural.toLowerCase();
  const options = {
    orderBy: schema.fields[0].key,
    saveMode: 'safe'
  };
  const hotCollection = new HotCollection(firedb, collectionName, options);
  Vue.observable(hotCollection.state);
  return hotCollection;
};

export { createHotCollection };
