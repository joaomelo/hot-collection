<template>
  <div>
    <v-container>
      <v-row align="center">
        <v-col>
          <h1 class="text-center">
            Items
          </h1>
        </v-col>
        <v-col
          cols="auto"
        >
          <v-btn
            color="primary"
            @click="addItem"
          >
            Add Item
          </v-btn>
        </v-col>
      </v-row>
    </v-container>

    <ItemEdit
      ref="itemEdit"
      @cancel="editCancel"
      @save="editSave"
    />
    <ItemsList @edit="edit" />
  </div>
</template>

<script>
import ItemEdit from './item-edit';
import ItemsList from './items-list';

import { itemsCol } from './items-store';

export default {
  name: 'CrudItem',
  components: { ItemEdit, ItemsList },
  methods: {
    add () {
      this.$refs.itemEdit.add();
    },
    edit (item) {
      this.$refs.itemEdit.edit(item);
    },
    save (data) {
      if (data.mode === 'add') {
        itemsCol.add(data.item);
      }
    }
  }
};
</script>
