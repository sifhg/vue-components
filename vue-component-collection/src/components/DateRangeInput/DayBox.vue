<script setup lang="ts">
import { ref } from "vue";

type DayBoxProps = {
  day: number;
  selected?: boolean;
};
const props = withDefaults(defineProps<DayBoxProps>(), {
  selected: false,
});
let selected = ref(props.selected);
function toggledSelection() {
  selected.value = !selected.value;
}
</script>

<template>
  <div
    :class="`day-box ${selected ? 'selected' : ''}`"
    v-on:click="toggledSelection"
  >
    {{ props.day }}
  </div>
</template>

<style>
.selected {
  background-color: blue;
}
</style>
