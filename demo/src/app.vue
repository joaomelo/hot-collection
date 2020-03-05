<template>
  <v-app>
    <v-content>
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

export default {
  name: 'App',
  components: { ListItems },
  computed: {
    overlay () {
      return authMachine.status === 'UNSOLVED';
    }
  }
};
</script>
