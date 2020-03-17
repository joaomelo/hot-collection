<template>
  <v-data-table
    :headers="headers"
    :sort-by="sortField"
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
import { reactive } from '@vue/composition-api';

export default {
  name: 'ItemsList',
  props: {
    itemType: {
      type: String,
      required: true
    },
    fields: {
      type: Array,
      required: true
    },
    hotCollection: {
      type: Object,
      required: true
    }
  },
  setup (props, context) {
    const { headers, sortField } = mountDataTableHeader(props.fields);

    const items = reactive(props.hotCollection.items);
    const deleteItem = (item) => props.hotCollection.del(item.id);
    const editItem = (item) => context.root.$router.push({ path: `/${props.itemType}/${item.id}` });

    return {
      sortField,
      headers,
      items,
      deleteItem,
      editItem
    };
  }
};

function mountDataTableHeader (fields) {
  const sortField = fields[0];

  const headers = fields.map(field => ({ text: field, value: field }));
  headers.push({ text: 'actions', value: 'action', sortable: false, align: 'end' });

  return { headers, sortField };
}

</script>
