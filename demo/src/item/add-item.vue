<template>
  <div>
    <v-card
      max-width="350px"
      min-width="250px"
    >
      <v-card-title class="justify-center">
        Item
      </v-card-title>
      <v-card-text>
        <v-form>
          <v-text-field
            v-model="title"
            label="Title"
            :rules="[v => !!v || 'Title is required']"
            required
          />
          <v-text-field
            v-model="description"
            label="Description"
          />
        </v-form>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="success"
          @click="addItem"
        >
          Add Item
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { itemsCol } from './items-store';

export default {
  name: 'AddItem',
  data () {
    return {
      title: null,
      description: null
    };
  },
  methods: {
    addItem () {
      itemsCol.add({ title: this.title, description: this.description });
    }
  }
};
</script>
