<template>
  <v-app>
    <v-content>
      <v-container>
        <v-row>
          <v-col cols="3" />
          <v-col
            cols="6"
            class="grey lighten-5"
          >
            <Demo />
          </v-col>
          <v-col cols="3" />
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import Demo from './demo';

export default {
  name: 'App',
  components: { Demo }
};
</script>
