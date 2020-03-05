<template>
  <v-form ref="form">
    <v-container>
      <v-row>
        <v-col>
          <v-text-field
            v-model="title"
            label="Title"
            :rules="[v => !!v || 'Title is required']"
            required
          />
        </v-col>
        <v-col>
          <v-text-field
            v-model="description"
            label="Description"
          />
        </v-col>
        <v-col
          cols="auto"
          align-self="center"
        >
          <v-btn
            fab
            dark
            small
            color="primary"
            @click="addItem"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
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
      if (this.$refs.form.validate()) {
        itemsCol.add({ title: this.title, description: this.description });
      }
    }
  }
};
</script>
