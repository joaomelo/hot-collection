<template>
  <v-card>
    <v-card-title
      class="justify-center"
    >
      Item
    </v-card-title>
    <v-card-text>
      <v-form ref="form">
        <v-text-field
          v-model="item.title"
          label="Title"
          :rules="[v => !!v || 'Title is required']"
          required
        />
        <v-text-field
          v-model="item.description"
          label="Description"
        />
      </v-form>
    </v-card-text>
    <v-divider />
    <v-card-actions
      class="justify-end"
    >
      <v-btn
        color="secondary"
        @click="close"
      >
        Cancel
      </v-btn>
      <v-btn
        color="primary"
        @click="save"
      >
        Confirm
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { itemsCol } from './items-store';

export default {
  name: 'ItemEdit',
  props: {
    id: {
      type: String,
      default: 'add'
    }
  },
  data () {
    return {
      item: {
        title: '',
        description: ''
      }
    };
  },
  computed: {
    mode () {
      return this.id === 'add' ? 'add' : 'edit';
    }
  },
  created () {
    if (this.mode === 'edit') {
      const dbItem = itemsCol.getItem(this.id);
      this.item.title = dbItem.title;
      this.item.description = dbItem.description;
    }
  },
  methods: {
    save () {
      if (this.$refs.form.validate()) {
        if (this.mode === 'add') {
          itemsCol.add(this.item);
        } else if (this.mode === 'edit') {
          itemsCol.set(this.id, this.item);
        }
        this.close();
      }
    },
    close () {
      this.$router.go(-1);
    }
  }
};
</script>
