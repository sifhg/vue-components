<script setup lang="ts">
import { onMounted, ref } from "vue";
import {
  PGCanvas,
  PGColour,
  PGShape,
  PGVector,
  createColour,
  createVectorArray,
} from "./DateRangeInput/GoodCanvas/index";
import { Size } from "./DateRangeInput/GoodCanvas/types";
import {
  _dateAddition,
  _dateSubtraction,
  _getYearArray,
} from "./DateRangeInput/supportFunctions";

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

type NoLayer = {
  layer: false;
};
type YearLayer = {
  layer: "year";
  year: number;
};
type MonthLayer = {
  layer: "month";
  year: number;
  month: number;
};
type DayLayer = {
  layer: "day";
  year: number;
  month: number;
  day: number;
};
type OffCanvas = {
  canvas: false;
};
type OnCanvas = {
  canvas: true;
  scroll: { left: boolean; right: boolean };
} & (NoLayer | YearLayer | MonthLayer | DayLayer);
type PositionState = {
  pos: PGVector;
} & (OffCanvas | OnCanvas);

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

// Canvas state
const canvas = ref<PGCanvas>();
const scrollBoxLeft = ref<ScrollBox>();
const scrollBoxRight = ref<ScrollBox>();
const scrollBoxSize = ref<Size>();
const mousePositionState = ref<PositionState>({
  pos: canvas.value?.mousePos ?? new PGVector(0, 0),
  canvas: false,
});

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

  let yearX = scrollBoxSize.value.w;
  YEAR_ARRAY.forEach((year) => {
    year.display(
      yearX,
      props.unitSize * 2,
      canvas.value!,
      new Set(props.displayFineness)
    );
    yearX += year.width;
  });

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

  // Mouse position
  function handleMousePosition(): void {
    const POSITION =
      canvas.value?.mousePos.clone() ?? mousePositionState.value.pos.clone();
    const SCROLL_HOVER = {
      left: (() => {
        return POSITION.x < scrollBoxSize.value!.w;
      })(),
      right: (() => {
        return (
          POSITION.x > scrollBoxRight.value!.box.x &&
          POSITION.x < canvas.value!.width
        );
      })(),
    };
    let depth: false | "days" | "months" | "years";
    function compareFinenes(
      a: "days" | "months" | "years",
      b: "days" | "months" | "years"
    ): number {
      if (a === b) {
        return 0;
      }
      if (a === "days" || b === "years") {
        return -1;
      }
      return 1;
    }
    if (SCROLL_HOVER.left || SCROLL_HOVER.right) {
      depth = false;
    } else {
      if (POSITION.y < canvas.value!.height / props.displayFineness.length) {
        depth = props.displayFineness.sort(compareFinenes)[0];
      } else if (
        POSITION.y <
        (canvas.value!.height * 2) / props.displayFineness.length
      ) {
        depth = props.displayFineness.sort(compareFinenes)[1];
      } else {
        depth = props.displayFineness.sort(compareFinenes)[2];
      }
    }
    if (!depth) {
      mousePositionState.value = {
        pos: POSITION,
        canvas: true,
        scroll: SCROLL_HOVER,
        layer: false,
      };
      return;
    }
    const YEAR = new Date().getFullYear(); //complete later
    if (depth === "years") {
      mousePositionState.value = {
        pos: POSITION,
        canvas: true,
        scroll: SCROLL_HOVER,
        layer: "year",
        year: YEAR,
      };
      return;
    }
    const MONTH = new Date().getMonth(); //complete later
    if (depth === "months") {
      mousePositionState.value = {
        pos: POSITION,
        canvas: true,
        scroll: SCROLL_HOVER,
        layer: "month",
        year: YEAR,
        month: MONTH,
      };
      return;
    }
    const DAY = new Date().getDate(); //complete later
    mousePositionState.value = {
      pos: POSITION,
      canvas: true,
      scroll: SCROLL_HOVER,
      layer: "day",
      year: YEAR,
      month: MONTH,
      day: DAY,
    };
    return;
  }
  canvas.value.HTMLElement.addEventListener("mouseleave", () => {
    mousePositionState.value = {
      ...mousePositionState.value,
      canvas: false,
    };
    console.log(mousePositionState.value.canvas);
  });
  canvas.value.HTMLElement.addEventListener("mousemove", () => {
    handleMousePosition();
    if (mousePositionState.value.canvas) {
      console.log(mousePositionState.value.layer);
    }
  });
});
</script>

<template>
  <canvas id="date-selection-canvas"></canvas>
</template>
