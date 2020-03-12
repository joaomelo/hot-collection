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

    <ItemsList />
  </div>
</template>

<script>
import ItemsList from './items-list';

export default {
  name: 'CrudItem',
  components: { ItemsList },
  methods: {
    addItem () {
      this.$router.push({ path: '/item/add' });
    }
  }
};
</script>
