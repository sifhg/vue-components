<script setup lang="ts">
import { ref } from "vue";

type DayBoxProps = {
  day: number;
  month: number;
  year: number;
  selected?: boolean;
};
const props = withDefaults(defineProps<DayBoxProps>(), {
  selected: false,
});
const selected = ref(props.selected);
function toggledSelection() {
  selected.value = !selected.value;
}
</script>

<template>
  <div
    :class="`day-box ${selected ? 'selected' : ''}`"
    @click="toggledSelection"
  ></div>
</template>
