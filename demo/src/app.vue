<template>
  <v-app>
    <v-content>
      <AddItem />
      <ListItems />
    </v-content>
    <v-overlay :value="overlay">
      <v-progress-circular
        indeterminate
        size="64"
      />
    </v-overlay>
  </v-app>
</template>

<script>
import { authMachine } from './services';
import ListItems from './list-items';
import AddItem from './add-item';

export default {
  name: 'App',
  components: { ListItems, AddItem },
  computed: {
    overlay () {
      return authMachine.status === 'UNSOLVED';
    }
  }
};
</script>
