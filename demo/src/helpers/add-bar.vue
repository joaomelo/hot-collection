<template>
  <v-container>
    <v-row align="center">
      <v-col>
        <h1 class="text-center">
          {{ `${itemType}s` }}
        </h1>
      </v-col>
      <v-col
        cols="auto"
      >
        <v-btn
          color="primary"
          @click="addItem"
        >
          Add {{ itemType }}
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'AddBar',
  props: {
    itemType: {
      type: String,
      required: true
    }
  },
  methods: {
    addItem () {
      this.$router.push({ path: `/${this.itemType}/add` });
    }
  }
};
</script>
