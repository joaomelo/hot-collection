<template>
  <v-data-table
    :headers="headers"
    :items="items"
    sort-by="title"
  >
    <template v-slot:item.action="{ item }">
      <v-icon
        small
        class="mr-2"
        @click="editItem(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        small
        @click="deleteItem(item)"
      >
        mdi-delete
      </v-icon>
    </template>
  </v-data-table>
</template>

<script>
import { itemsCol } from './items-store';

export default {
  name: 'ItemsList',
  data () {
    return {
      headers: [
        { text: 'Title', value: 'title' },
        { text: 'Description', value: 'description' },
        { text: 'Actions', value: 'action', sortable: false, align: 'end' }
      ],
      items: []
    };
  },
  mounted () {
    itemsCol.subscribe(items => { this.items = items; });
  },
  methods: {
    deleteItem (item) {
      itemsCol.del(item.id);
    },
    editItem (item) {
      this.$emit('edit', item);
    }
  }
};
</script>
