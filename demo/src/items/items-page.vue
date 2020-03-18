<template>
  <div>
    <ItemAdd :schema="schema" />
    <ItemsList :schema="schema" />
  </div>
</template>

<script>
import { schemas } from '../schema';
import ItemAdd from './item-add';
import ItemsList from './items-list';

export default {
  name: 'ItemsPage',
  components: { ItemAdd, ItemsList },
  props: {
    itemsType: {
      type: String,
      required: true
    }
  },
  computed: {
    schema () { return schemas[this.itemsType]; }
  }
};
</script>
