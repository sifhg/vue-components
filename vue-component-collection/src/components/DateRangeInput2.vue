<script setup lang="ts">
import { onMounted, ref } from "vue";
import {
  PGCanvas,
  PGColour,
  PGShape,
  createColour,
  createVectorArray,
} from "./DateRangeInput2/GoodCanvas/index";
import { Size } from "./DateRangeInput2/GoodCanvas/types";
import {
  _dateAddition,
  _dateSubtraction,
  _getYearArray,
} from "./DateRangeInput2/supportFunctions";

type DateRangeInputProps = {
  displayFineness: Array<"days" | "months" | "years">;
  width?: number;
  unitSize?: number;
  firstDate?: Date;
  lastDate?: Date;
};
const props = withDefaults(defineProps<DateRangeInputProps>(), {
  unitSize: 32,
  lastDate: () => {
    return new Date();
  },
});

type ScrollBox = {
  box: PGShape;
  arrow: PGShape;
};

const width = ref<number | undefined>(props.width);
const parentElement = ref<HTMLElement | null>();
const FIRST_DATE = props.firstDate
  ? props.firstDate
  : _dateSubtraction(props.lastDate, "1y");
const YEAR_ARRAY = _getYearArray(
  FIRST_DATE,
  props.lastDate,
  props.unitSize,
  props.displayFineness
);
console.log(FIRST_DATE);
console.log(props.lastDate);
YEAR_ARRAY.forEach((year) => {
  year.months.forEach((month) => {
    console.log(month.toString());
  });
});

// Canvas state
const canvas = ref<PGCanvas>();
const scrollBoxLeft = ref<ScrollBox>();
const scrollBoxRight = ref<ScrollBox>();
const scrollBoxSize = ref<Size>();

function adjustWidth() {
  if (
    !canvas.value ||
    !scrollBoxLeft.value ||
    !scrollBoxRight.value ||
    !scrollBoxSize.value
  ) {
    throw new Error(`adjustWidth cannot be called without all canvas states set
    canvas.value: "${canvas !== undefined ? "set" : "false"}"
    scrollBoxLeft.value: "${scrollBoxLeft !== undefined ? "set" : "false"}"
    scrollBoxRight.value: "${scrollBoxRight !== undefined ? "set" : "false"}"
    scrollBoxSize.value: "${scrollBoxSize !== undefined ? "set" : "false"}"`);
  }

  width.value = parentElement.value?.clientWidth;
  canvas.value?.setCanvasSize(width.value!, canvas.value.height);
  const OLD_POS = scrollBoxRight.value.box.x;
  scrollBoxRight.value.box.x = canvas.value.width - scrollBoxSize.value.w;
  scrollBoxRight.value.arrow.path = scrollBoxRight.value.arrow.path.map(
    (coord) => {
      const NEW_COORD = coord.clone();
      NEW_COORD.x = NEW_COORD.x + (scrollBoxRight.value!.box.x - OLD_POS);
      return NEW_COORD;
    }
  );
  canvas.value?.render(true);
}

onMounted(() => {
  parentElement.value = document.getElementById(
    "date-selection-canvas"
  )?.parentElement;
  width.value = parentElement.value?.clientWidth;
  canvas.value = new PGCanvas("date-selection-canvas");
  canvas.value.setCanvasSize(
    width.value!,
    props.unitSize * props.displayFineness.length
  );
  canvas.value.background(new PGColour("GREYSCALE", 207));
  scrollBoxSize.value = {
    w: props.unitSize * 2,
    h: canvas.value.height,
  };

  scrollBoxLeft.value = {
    box: canvas.value.createRect(
      0,
      0,
      scrollBoxSize.value.w,
      scrollBoxSize.value.h,
      createColour("GREYSCALE", 255),
      "left-scroll"
    ),
    arrow: canvas.value.createPath(
      createVectorArray([
        {
          x: scrollBoxSize.value.w / 2 + props.unitSize / 4,
          y: scrollBoxSize.value.h / 2 + props.unitSize / 2,
        },
        {
          x: scrollBoxSize.value.w / 2 - props.unitSize / 4,
          y: scrollBoxSize.value.h / 2,
        },
        {
          x: scrollBoxSize.value.w / 2 + props.unitSize / 4,
          y: scrollBoxSize.value.h / 2 - props.unitSize / 2,
        },
      ]),
      createColour("GREYSCALE", 208),
      "left-scroll-arrow"
    ),
  };
  scrollBoxLeft.value.box.setStroke(1, createColour("GREYSCALE", 0));
  scrollBoxRight.value = {
    box: canvas.value.createRect(
      canvas.value.width - scrollBoxSize.value.w,
      0,
      scrollBoxSize.value.w,
      scrollBoxSize.value.h,
      createColour("GREYSCALE", 255),
      "right-scroll"
    ),
    arrow: canvas.value.createPath(
      createVectorArray([
        {
          x:
            canvas.value.width - scrollBoxSize.value.w / 2 - props.unitSize / 4,
          y: scrollBoxSize.value.h / 2 + props.unitSize / 2,
        },
        {
          x:
            canvas.value.width - scrollBoxSize.value.w / 2 + props.unitSize / 4,
          y: scrollBoxSize.value.h / 2,
        },
        {
          x:
            canvas.value.width - scrollBoxSize.value.w / 2 - props.unitSize / 4,
          y: scrollBoxSize.value.h / 2 - props.unitSize / 2,
        },
      ]),
      createColour("GREYSCALE", 208),
      "left-scroll-arrow"
    ),
  };
  scrollBoxRight.value.box.setStroke(1, createColour("GREYSCALE", 0));

  canvas.value.render(true);

  // Resize observer
  const RESIZE_OBSERVER = new ResizeObserver(adjustWidth);
  RESIZE_OBSERVER.observe(parentElement.value!);
});
</script>

<template>
  <canvas id="date-selection-canvas"></canvas>
</template>
