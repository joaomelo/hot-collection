import { createHotCollection } from './collections';

const deliveries = {
  labels: {
    singular: 'Delivery',
    plural: 'Deliveries'
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

deliveries.collection = createHotCollection(deliveries);

export { deliveries };
