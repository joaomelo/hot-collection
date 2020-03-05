<template>
  <v-app>
    <v-app-bar
      dense
      app
      dark
      color="primary"
    >
      <v-toolbar-title>Hot Collection Demo</v-toolbar-title>
      <v-spacer />
      <v-btn
        text
        to="/single"
      >
        Single
      </v-btn>
      <v-btn
        text
        to="/relationship"
      >
        Relationships
      </v-btn>
    </v-app-bar>
    <v-content>
      <router-view />
    </v-content>
  </v-app>
</template>

<script>

export default {
  name: 'App'
};
</script>
