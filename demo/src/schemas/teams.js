import Vue from 'vue';
import HotCollection from '__lib';
import { firedb } from '../services';

const teamsCollection = new HotCollection(firedb, 'teams');
Vue.observable(teamsCollection.items);

const teams = {
  labels: {
    singular: 'Team',
    plural: 'Teams'
  },
  collection: teamsCollection,
  fields: [
    {
      label: 'Name',
      key: 'name',
      required: true,
      header: true
    }
  ]
};

export { teams };
