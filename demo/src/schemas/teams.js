import { collections } from './collections';

const teams = {
  labels: {
    singular: 'Team',
    plural: 'Teams'
  },
  collection: collections.teams,
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
