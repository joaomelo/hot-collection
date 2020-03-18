<template>
  <v-container>
    <v-row align="center">
      <v-col>
        <h1 class="text-center">
          {{ schema.labels.plural }}
        </h1>
      </v-col>
      <v-col
        cols="auto"
      >
        <v-btn
          color="primary"
          @click="addItem"
        >
          Add {{ schema.labels.singular }}
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'ItemAdd',
  props: {
    schema: {
      type: Object,
      required: true
    }
  },
  methods: {
    addItem () {
      const route = this.schema.labels.singular.toLowerCase();
      this.$router.push({ path: `/${route}/add` });
    }
  }
};
</script>
