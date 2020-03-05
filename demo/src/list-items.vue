<template>
  <div>
    <v-list-item
      v-for="(item, i) in items"
      :key="i"
      two-line
    >
      <v-list-item-content>
        <v-list-item-title>item.title</v-list-item-title>
        <v-list-item-subtitle>item.description</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
  </div>
</template>

<script>
import { itemsCol } from './store';

export default {
  name: 'ListItems',
  data () {
    return {
      items: []
    };
  },
  mounted () {
    itemsCol.subscribe(items => { this.items = items; });
  }
};
</script>

<style>

</style>
