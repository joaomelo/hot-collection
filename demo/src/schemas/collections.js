import Vue from 'vue';
import HotCollection from '__lib';
import { firedb } from '../services';

const collections = {
  __projects: null,
  __teams: null,

  get projects () {
    return getCollection('projects');
  },

  get teams () {
    return getCollection('teams');
  }

};

function getCollection (key) {
  const privateRef = `__${key}`;
  if (!collections[privateRef]) {
    collections[privateRef] = new HotCollection(firedb, key, getOptions());
    Vue.observable(collections[privateRef].state);
  }
  return collections[privateRef];
}

function getOptions () {
  const options = {};

  if (process.env.SAVE_MODE) {
    options.saveMode = process.env.SAVE_MODE;
  }

  return options;
}

export { collections };
