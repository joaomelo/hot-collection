<template>
  <v-dialog
    v-model="dialog"
  >
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
          @click="cancel"
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
  </v-dialog>
</template>

<script>
export default {
  name: 'ItemEdit',
  data () {
    return {
      dialog: false,
      mode: '',
      item: {}
    };
  },

  methods: {
    add () {
      this.mode = 'add';
      this.item.id = '';
      this.item.title = '';
      this.item.description = '';
      this.dialog = true;
    },
    edit (item) {
      this.mode = 'edit';
      this.item.id = item.id;
      this.item.title = item.title;
      this.item.description = item.description;
      this.dialog = true;
    },
    save () {
      if (this.$refs.form.validate()) {
        this.dialog = false;
        this.$emit('save', { mode: this.mode, item: { ...this.item } });
      }
    },
    cancel () {
      this.dialog = false;
    }
  }
};
</script>
