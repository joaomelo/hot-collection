import Vue from 'vue';
import HotCollection from '__lib';
import { firedb } from '../services';

const projectsCollection = new HotCollection(firedb, 'projects');
Vue.observable(projectsCollection.items);

const projects = {
  labels: {
    singular: 'Project',
    plural: 'Projects'
  },
  collection: projectsCollection,
  fields: [
    {
      label: 'Title',
      key: 'title',
      required: true,
      header: true
    },
    {
      label: 'Description',
      key: 'description',
      header: true
    }
  ]
};

export { projects };
