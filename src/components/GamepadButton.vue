<template>
  <div :class="$style.button">
    <span>B{{ index }}&nbsp;</span>
    <input :class="$style.input" type="text" name="note" v-model="value" />
    <span>{{ button.pressed ? '🟢' : '🔴' }}</span>
  </div>
</template>

<script>
export default {
  props: {
    button: Object,
    index: Number,
    note: String,
  },
  computed: {
    value: {
      get() {
        return this.note
      },
      set(value) {
        this.$emit('map', value)
      },
    },
  },
  watch: {
    'button.pressed'(pressed, old) {
      if (!old && pressed) {
        this.$emit('press', this.button.value)
      }
    },
  },
}
</script>

<style module>
.button {
  margin: 0.25em;
  display: flex;
  justify-content: flex-end;
}

.input {
  width: 2em;
}
</style>
