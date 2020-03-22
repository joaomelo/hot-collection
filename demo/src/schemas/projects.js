import { createHotCollection } from './collections';

const projects = {
  labels: {
    singular: 'Project',
    plural: 'Projects'
  },
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

projects.collection = createHotCollection(projects);

export { projects };
