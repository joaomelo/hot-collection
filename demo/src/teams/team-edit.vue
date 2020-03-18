<template>
  <ItemEdit
    v-slot="{ item: team }"
    item-type="team"
    :item-id="id"
    :hot-collection="teamsCol"
  >
    <v-text-field
      v-model="team.name"
      label="Name"
      :rules="[v => !!v || 'Name is required']"
      required
    />
  </ItemEdit>
</template>

<script>
import ItemEdit from '../items/item-edit';
import { teamsCol } from './teams-store';

export default {
  name: 'TeamEdit',
  components: { ItemEdit },
  props: {
    id: {
      type: String,
      default: 'add'
    }
  },
  data () {
    return {
      teamsCol
    };
  }
};
</script>
