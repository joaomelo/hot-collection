<template>
  <v-app>
    <v-content>
      <p>Demo<p>
    </v-content>
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>  
  </v-app>
</template>

<script>
import {authMachine} from './services';

export default {
  name: 'App',
  computed: {
    overlay(){
      return authMachine.status === 'UNSOLVED';
    }
  }
};
</script>
