<template>
  <label :for="port.id">
    <input type="radio" :id="port.id" :value="port.id" v-model="radioModel" />
    {{ port.name }}
  </label>
</template>

<script>
export default {
  props: {
    port: {
      type: Object,
      required: true,
    },
    modelValue: {
      validator: (x) => x === null || typeof x === 'string',
      required: true,
    },
  },
  computed: {
    radioModel: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      },
    },
  },
}
</script>