<script setup lang="ts">
import { onMounted, ref } from "vue";
import GoodCanvas from "./DateRangeInput2/GoodCanvas/CanvasAPI";
import { Colour } from "./DateRangeInput2/GoodCanvas/Colour";

type DateRangeInputProps = {
  displayFineness: Array<"days" | "months" | "years">;
  width?: number;
  unitSize?: number;
  lastDate?: Date;
};
const props = withDefaults(defineProps<DateRangeInputProps>(), {
  unitSize: 32,
  lastDate: () => {
    return new Date();
  },
});

const width = ref<number | undefined>(props.width);

const canvas = ref<GoodCanvas>();
onMounted(() => {
  if (!width.value) {
    width.value = document.getElementById(
      "date-selection-canvas"
    )?.parentElement?.clientWidth;
  }

  canvas.value = new GoodCanvas("date-selection-canvas");
  canvas.value.setCanvasSize(width.value!, props.unitSize * 5);
  canvas.value.background(new Colour("GREYSCALE", 207));
  canvas.value.render(true);
});
</script>

<template>
  <canvas id="date-selection-canvas"></canvas>
</template>
