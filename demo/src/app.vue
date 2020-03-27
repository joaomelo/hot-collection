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
        to="/pages/projects"
      >
        Projects
      </v-btn>
      <v-btn
        text
        to="/pages/teams"
      >
        Teams
      </v-btn>
      <v-btn
        text
        to="/pages/users"
      >
        Users
      </v-btn>
    </v-app-bar>
    <v-content>
      <v-row justify="center">
        <v-col cols="10">
          <router-view :key="$route.fullPath" />
        </v-col>
      </v-row>
    </v-content>
  </v-app>
</template>

<script>

export default {
  name: 'App'
};
</script>
