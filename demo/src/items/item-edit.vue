<template>
  <v-card>
    <v-card-title
      class="justify-center"
    >
      {{ collectionType }}
    </v-card-title>
    <v-card-text>
      <v-form ref="form">
        <ItemField
          v-for="field in schema.fields"
          :key="field.key"
          v-model="item[field.key]"
          :options="field"
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
import { schemas } from '../schemas';
import ItemField from './item-field';

export default {
  name: 'ItemEdit',
  components: { ItemField },
  props: {
    itemId: {
      type: String,
      required: true
    },
    collectionType: {
      type: String,
      required: true
    }
  },
  data () {
    const mode = this.itemId === 'add' ? 'add' : 'edit';
    const schema = schemas[this.collectionType];

    return {
      mode,
      schema,
      item: mode === 'add' ? {} : schema.collection.getItem(this.itemId)
    };
  },
  methods: {
    save () {
      if (this.mode === 'add') {
        this.schema.collection.add(this.item);
      } else {
        this.schema.collection.set(this.itemId, this.item);
      };
      this.close();
    },
    close () {
      this.$router.go(-1);
    }
  }
};

</script>
