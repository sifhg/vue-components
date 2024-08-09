<script setup lang="ts">
import { onMounted, ref } from "vue";
import GoodCanvas from "./DateRangeInput2/GoodCanvas/CanvasAPI";

type DateRangeInputProps = {
  displayFineness: Array<"days" | "months" | "years">;
  width?: number;
  unitSize?: number;
  lastDate?: Date;
};
const props = withDefaults(defineProps<DateRangeInputProps>(), {
  width: 500,
  unitSize: 32,
  lastDate: () => {
    return new Date();
  },
});

const canvas = ref<GoodCanvas>();
onMounted(() => {
  canvas.value = new GoodCanvas("date-selection-canvas");
});
</script>

<template>
  <canvas id="date-selection-canvas"></canvas>
</template>
