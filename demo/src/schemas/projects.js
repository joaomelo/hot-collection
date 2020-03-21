import { collections } from './collections';

const projects = {
  labels: {
    singular: 'Project',
    plural: 'Projects'
  },
  collection: collections.projects,
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
