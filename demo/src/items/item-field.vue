<template>
  <component
    :is="fieldType"
    :label="options.label"
    :required="options.required"
    :rules="rules"
    :value="value"
    @input="changed"
  />
</template>

<script>
import { VTextField } from 'vuetify/lib';

export default {
  components: { VTextField },
  props: {
    value: {
      type: [String],
      default: null
    },
    options: {
      type: Object,
      required: true
    }
  },
  data () {
    const fieldType = VTextField;
    const rules = [];
    return {
      fieldType,
      rules
    };
  },
  methods: {
    changed (newValue) {
      this.$emit('input', newValue);
    }
  }
};
</script>
