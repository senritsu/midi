<template>
  <div
    class="note"
    :class="{white: !black, black, active}"
  />
</template>

<script>
export default {
  props: {
    active: Boolean,
    black: Boolean
  }
}
</script>

<style scoped>
.white {
  border-right: 1px solid black;
}

.white.active {
  background-color: skyblue;
}

.black {
  margin: 0 0.05em;
  background-color: black;
}

.black.active {
  background-color: goldenrod;
}
</style>