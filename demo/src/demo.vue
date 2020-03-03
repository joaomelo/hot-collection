<template>
  <v-form>
    <v-text-field
      v-model="a"
      type="number"
    />
    <v-text-field
      v-model="b"
      type="number"
    />
    <v-btn
      color="primary"
      @click="add"
    >
      add
    </v-btn>
    <v-text-field
      v-model="total"
      type="number"
    />
  </v-form>
</template>

<script>
import { add } from '__lib';

export default {
  name: 'Demo',
  data () {
    return {
      a: 0,
      b: 0,
      total: 0
    };
  },
  methods: {
    add () {
      this.total = add(this.a, this.b);
    }
  }
};
</script>
