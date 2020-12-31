<template>
  <div :class="$style.axis">
    <div :class="$style.text">A{{ index }}: {{ value.toFixed(2) }}</div>
    <div :class="$style.bar">
      <div :class="$style.marker" :style="{ left: `${(0.5 * value + 0.5) * 100}%`}" />
    </div>
    <input :class="$style.input" type="text" name="note" v-model="controlModel">
  </div>
</template>

<script>
export default {
  props: {
    value: Number,
    index: Number,
    control: String
  },
  computed: {
    controlModel: {
      get () { return this.control },
      set (value) { this.$emit('map', value) }
    }
  },
  watch: {
    value (value, old) {
      if (value !== old) {
        this.$emit('change', value)
      }
    }
  }
}
</script>

<style module>
.axis {
  margin: 0.5em;
  display: flex;
  flex-direction: column;
}

.text {
  display: flex;
}

.bar {
  position: relative;
  height: 4px;
  margin: 1px;
  background-color: rgb(212, 212, 212);
}

.marker {
  position: absolute;
  width: 1px;
  height: 4px;
  background-color: black;
  top: 0;
  left: 50%;
}

.input {
  width: 8em;
}
</style>
