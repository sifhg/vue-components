<script setup lang="ts">
import { onMounted, ref } from "vue";
import {
  PGCanvas,
  PGColour,
  createColour,
  createVectorArray,
} from "./DateRangeInput2/GoodCanvas/index";

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

const canvas = ref<PGCanvas>();
onMounted(() => {
  if (!width.value) {
    width.value = document.getElementById(
      "date-selection-canvas"
    )?.parentElement?.clientWidth;
  }

  const CANVAS_SIZE = {
    w: width.value!,
    h: props.unitSize * props.displayFineness.length,
  };
  canvas.value = new PGCanvas("date-selection-canvas");
  canvas.value.setCanvasSize(CANVAS_SIZE.w, CANVAS_SIZE.h);
  canvas.value.background(new PGColour("GREYSCALE", 207));
  const SCROLL_BOX_SIZE = {
    x: props.unitSize * 1.5,
    y: CANVAS_SIZE.h,
  };
  const SCROLL_LEFT = {
    box: canvas.value.createRect(
      0,
      0,
      SCROLL_BOX_SIZE.x,
      SCROLL_BOX_SIZE.y,
      createColour("GREYSCALE", 255),
      "left-scroll"
    ),
    arrow: canvas.value.createPath(
      createVectorArray([
        {
          x: SCROLL_BOX_SIZE.x / 2 + props.unitSize / 4,
          y: SCROLL_BOX_SIZE.y / 2 + props.unitSize / 2,
        },
        {
          x: SCROLL_BOX_SIZE.x / 2 - props.unitSize / 4,
          y: SCROLL_BOX_SIZE.y / 2,
        },
        {
          x: SCROLL_BOX_SIZE.x / 2 + props.unitSize / 4,
          y: SCROLL_BOX_SIZE.y / 2 - props.unitSize / 2,
        },
      ]),
      createColour("GREYSCALE", 208),
      "left-scroll-arrow"
    ),
  };
  SCROLL_LEFT.box.setStroke(1, createColour("GREYSCALE", 0));

  const SCROLL_RIGHT = {
    box: canvas.value.createRect(
      CANVAS_SIZE.w - SCROLL_BOX_SIZE.x,
      0,
      SCROLL_BOX_SIZE.x,
      SCROLL_BOX_SIZE.y,
      createColour("GREYSCALE", 255),
      "right-scroll"
    ),
    arrow: canvas.value.createPath(
      createVectorArray([
        {
          x: CANVAS_SIZE.w - SCROLL_BOX_SIZE.x / 2 - props.unitSize / 4,
          y: SCROLL_BOX_SIZE.y / 2 + props.unitSize / 2,
        },
        {
          x: CANVAS_SIZE.w - SCROLL_BOX_SIZE.x / 2 + props.unitSize / 4,
          y: SCROLL_BOX_SIZE.y / 2,
        },
        {
          x: CANVAS_SIZE.w - SCROLL_BOX_SIZE.x / 2 - props.unitSize / 4,
          y: SCROLL_BOX_SIZE.y / 2 - props.unitSize / 2,
        },
      ]),
      createColour("GREYSCALE", 208),
      "left-scroll-arrow"
    ),
  };
  SCROLL_RIGHT.box.setStroke(1, createColour("GREYSCALE", 0));

  canvas.value.render(true);
});
</script>

<template>
  <canvas id="date-selection-canvas"></canvas>
</template>
