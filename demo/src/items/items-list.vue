<template>
  <v-data-table
    :headers="tableHeader.headers"
    :sort-by="tableHeader.sortField"
    :items="items"
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
export default {
  name: 'ItemsList',
  props: {
    schema: {
      type: Object,
      required: true
    }
  },
  computed: {
    items () {
      return this.schema.collection.items;
    },
    tableHeader () {
      const tableHeader = {};
      tableHeader.sortField = this.schema.fields[0].key;
      tableHeader.headers = this.schema.fields
        .filter(field => field.header)
        .map(field => ({ text: field.label, value: field.key }));
      tableHeader.headers.push({ text: 'actions', value: 'action', sortable: false, align: 'end' });

      return tableHeader;
    }
  },
  methods: {
    deleteItem (item) {
      this.schema.collection.del(item.id);
    },
    editItem (item) {
      const collectionType = this.schema.labels.plural.toLowerCase();
      this.$router.push({ path: `/item/${collectionType}/${item.id}` });
    }
  }
};
</script>
