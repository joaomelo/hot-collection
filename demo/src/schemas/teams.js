import { createHotCollection } from './collections';

const teams = {
  labels: {
    singular: 'Team',
    plural: 'Teams'
  },
  fields: [
    {
      label: 'Name',
      key: 'name',
      required: true,
      header: true
    }
  ]
};

teams.collection = createHotCollection(teams);

export { teams };
