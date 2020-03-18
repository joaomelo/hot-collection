<template>
  <v-card>
    <v-card-title
      class="justify-center"
    >
      {{ itemType }}
    </v-card-title>
    <v-card-text>
      <v-form ref="form">
        <slot :item="item" />
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
import { reactive } from '@vue/composition-api';

export default {
  name: 'ItemEdit',
  props: {
    itemType: {
      type: String,
      required: true
    },
    itemId: {
      type: String,
      required: true
    },
    hotCollection: {
      type: Object,
      required: true
    }
  },
  setup (props, context) {
    const mode = props.itemId === 'add' ? 'add' : 'edit';
    const modeOutfit = {
      add: {
        item: () => reactive({}),
        save: item => props.hotCollection.add(item)
      },
      edit: {
        item: () => reactive(props.hotCollection.getItem(props.itemId)),
        save: item => props.hotCollection.set(props.itemId, item)
      }
    };

    const item = modeOutfit[mode].item();
    const close = () => context.root.$router.go(-1);
    const save = () => {
      modeOutfit[mode].save(item);
      close();
    };

    return {
      item,
      save,
      close
    };
  }
};

</script>
