import Vue from 'vue';
import HotCollection from '__lib';
import { firedb } from '../services';

const users = {
  labels: {
    singular: 'User',
    plural: 'Users'
  },
  fields: [
    {
      label: 'Email',
      key: 'email',
      required: true,
      header: true,
      readonly: true
    }
  ],
  collection: new HotCollection(firedb, 'users', {
    saveMode: 'safe'
  })
};

Vue.observable(users.state);

export { users };
