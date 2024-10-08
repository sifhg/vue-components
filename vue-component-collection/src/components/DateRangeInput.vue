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
import {
  ArrayVector,
  Coordinate,
  Size,
} from "./DateRangeInput/GoodCanvas/types";
import {
  _dateAddition,
  _dateSubtraction,
  _getYearArray,
} from "./DateRangeInput/supportFunctions";
import Year from "./DateRangeInput/Year";
import Month from "./DateRangeInput/Month";
import Day from "./DateRangeInput/Day";

type DateRangeInputProps = {
  displayFineness: Array<"days" | "months" | "years">;
  width?: number;
  unitSize?: Coordinate | ArrayVector;
  firstDate?: Date;
  lastDate?: Date;
};
const props = withDefaults(defineProps<DateRangeInputProps>(), {
  unitSize: () => {
    return [32, 32];
  },
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
const offsetX = ref<number>(0);
const parentElement = ref<HTMLElement | null>();
const unitSize = ref(new PGVector(props.unitSize));
const FIRST_DATE = props.firstDate
  ? props.firstDate
  : _dateSubtraction(props.lastDate, "1y");
const yearArray = ref<Array<Year>>([]);

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
  yearArray.value = _getYearArray(
    FIRST_DATE,
    props.lastDate,
    unitSize.value.clone(),
    scrollBoxSize.value.w - offsetX.value,
    scrollBoxSize.value.w,
    canvas.value.width - scrollBoxSize.value.w,
    props.displayFineness
  );
  displayDates(yearArray.value as Array<Year>);
}

/**
 * Adds scrollboxes to the canvas and update the state of scroll boxes so they correspond to the current canvas dimensions.
 */
function updateScrollBoxes() {
  scrollBoxLeft.value = {
    box: canvas.value!.createRect(
      0,
      0,
      scrollBoxSize.value!.w,
      scrollBoxSize.value!.h,
      createColour("GREYSCALE", 255),
      "left-scroll"
    ),
    arrow: canvas.value!.createPath(
      createVectorArray([
        {
          x: scrollBoxSize.value!.w / 2 + unitSize.value.y / 4,
          y: scrollBoxSize.value!.h / 2 + unitSize.value.y / 2,
        },
        {
          x: scrollBoxSize.value!.w / 2 - unitSize.value.y / 4,
          y: scrollBoxSize.value!.h / 2,
        },
        {
          x: scrollBoxSize.value!.w / 2 + unitSize.value.y / 4,
          y: scrollBoxSize.value!.h / 2 - unitSize.value.y / 2,
        },
      ]),
      createColour("GREYSCALE", 208),
      "left-scroll-arrow"
    ),
  };
  scrollBoxLeft.value.box.setStroke(1, createColour("GREYSCALE", 0));

  scrollBoxRight.value = {
    box: canvas.value!.createRect(
      canvas.value!.width - scrollBoxSize.value!.w,
      0,
      scrollBoxSize.value!.w,
      scrollBoxSize.value!.h,
      createColour("GREYSCALE", 255),
      "right-scroll"
    ),
    arrow: canvas.value!.createPath(
      createVectorArray([
        {
          x:
            canvas.value!.width -
            scrollBoxSize.value!.w / 2 -
            unitSize.value.y / 4,
          y: scrollBoxSize.value!.h / 2 + unitSize.value.y / 2,
        },
        {
          x:
            canvas.value!.width -
            scrollBoxSize.value!.w / 2 +
            unitSize.value.y / 4,
          y: scrollBoxSize.value!.h / 2,
        },
        {
          x:
            canvas.value!.width -
            scrollBoxSize.value!.w / 2 -
            unitSize.value.y / 4,
          y: scrollBoxSize.value!.h / 2 - unitSize.value.y / 2,
        },
      ]),
      createColour("GREYSCALE", 208),
      "left-scroll-arrow"
    ),
  };
  scrollBoxRight.value.box.setStroke(1, createColour("GREYSCALE", 0));
}

function displayDates(yearArray: Array<Year>) {
  canvas.value?.clearCanvas();

  yearArray.forEach((year) => {
    year.display(
      canvas.value!,
      new Set(props.displayFineness),
      scrollBoxSize.value!.w,
      canvas.value!.width - scrollBoxSize.value!.w
    );
  });
  updateScrollBoxes();
  handleHover();
  canvas.value?.render(true);
}

// Mouse position
function searchYearPosition(mouseX: number): Year | null {
  for (const YEAR of yearArray.value as Array<Year>) {
    const X_INITIAL = YEAR.x;
    const X_TERMINAL = X_INITIAL + YEAR.width;
    if (mouseX >= X_INITIAL && mouseX <= X_TERMINAL) {
      return YEAR;
    }
  }
  return null;
}
function searchMonthPosition(mouseX: number, year?: Year): Month {
  const YEAR = year ?? searchYearPosition(mouseX);
  for (const MONTH of YEAR!.months) {
    const X_INITIAL = MONTH.x;
    const X_TERMINAL = X_INITIAL + MONTH.width;
    if (mouseX >= X_INITIAL && mouseX <= X_TERMINAL) {
      return MONTH;
    }
  }
  throw new Error(
    `Position ${mouseX} does not correspond to a position of a PGShape of a Month.`
  );
}
function searchDayPosition(mouseX: number, monthYear?: Month | Year): Day {
  const MONTH =
    monthYear instanceof Month
      ? monthYear
      : searchMonthPosition(mouseX, monthYear);
  for (const DAY of MONTH.days) {
    const X_INITIAL = DAY.x;
    const X_TERMINAL = X_INITIAL + DAY.width;
    if (mouseX >= X_INITIAL && mouseX <= X_TERMINAL) {
      return DAY;
    }
  }
  throw new Error(
    `Position ${mouseX} does not correspond to a position of a PGShape of a Day.`
  );
}

/**
 * Updates state of mouseposition.
 */
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
  const YEAR = searchYearPosition(POSITION.x);
  if (YEAR === null) {
    return;
  }
  if (depth === "years") {
    mousePositionState.value = {
      pos: POSITION,
      canvas: true,
      scroll: SCROLL_HOVER,
      layer: "year",
      year: YEAR.year,
    };
    return;
  }
  const MONTH = searchMonthPosition(POSITION.x, YEAR);
  if (depth === "months") {
    mousePositionState.value = {
      pos: POSITION,
      canvas: true,
      scroll: SCROLL_HOVER,
      layer: "month",
      year: YEAR.year,
      month: MONTH.month[0],
    };
    return;
  }
  const DAY = searchDayPosition(POSITION.x, MONTH);
  mousePositionState.value = {
    pos: POSITION,
    canvas: true,
    scroll: SCROLL_HOVER,
    layer: "day",
    year: YEAR.year,
    month: MONTH.month[0],
    day: DAY.day,
  };
  return;
}

/**
 * Offsets all Year, Month, and Day squares and renders the canvas with ned positions.
 * @param {number} step - number of pixels to offset by.
 * @param {boolean} skipCheck - if true, offset without checking mouse state.
 */
function handleScroll(step: number, skipCheck: boolean = false): void {
  if (skipCheck) {
    offsetX.value += step;
    return;
  }
  if (!mousePositionState.value.canvas) {
    return;
  }
  if (mousePositionState.value.scroll.left && offsetX.value - step >= 0) {
    offsetX.value -= step;
  }
  if (mousePositionState.value.scroll.right) {
    offsetX.value += step;
  }

  yearArray.value = _getYearArray(
    FIRST_DATE,
    props.lastDate,
    unitSize.value.clone(),
    scrollBoxSize.value!.w - offsetX.value,
    scrollBoxSize.value!.w,
    canvas.value!.width - scrollBoxSize.value!.w,
    props.displayFineness
  );
  displayDates(yearArray.value as Array<Year>);
}

/**
 * Informs an element if the mouse is hovering over it.
 */
function handleHover(): void {
  yearArray.value.forEach((eachYear) => {
    eachYear.mouseLeave();
  });
  if (!mousePositionState.value.canvas) {
    return;
  }
  let year: number | undefined;
  let month: number;
  let day: number;
  if (mousePositionState.value.layer) {
    year = mousePositionState.value.year;
  }
  switch (mousePositionState.value.layer) {
    case "day":
      day = mousePositionState.value.day;
    case "month":
      month = mousePositionState.value.month;
    case "year":
      year = mousePositionState.value.year;
  }

  for (const YEAR of yearArray.value) {
    if (YEAR.year === year) {
      YEAR.mouseEnter();
      return;
    }
  }
}

/**
 * Initiates a loop of updating mouse state and apply offsets to dates.
 * @param {number} frameRate - by what framerate the offset will be offset.
 */
function startScroll(frameRate: number): void {
  if (canvas.value === undefined) {
    throw new Error(`canvas is not defined yet.`);
  }
  canvas.value.frameRate = frameRate;
  canvas.value.startLoop();
  canvas.value.draw(() => {
    handleMousePosition();
    handleScroll(10);
  });
}
function stopScroll(): void {
  if (canvas.value === undefined) {
    throw new Error(`canvas is not defined yet.`);
  }
  canvas.value.stopLoop();
  canvas.value.draw(() => {});
}

onMounted(() => {
  parentElement.value = document.getElementById(
    "date-selection-canvas"
  )?.parentElement;
  width.value = parentElement.value?.clientWidth;
  canvas.value = new PGCanvas("date-selection-canvas");
  canvas.value.setCanvasSize(
    width.value!,
    unitSize.value.y * props.displayFineness.length
  );
  canvas.value.background(new PGColour("GREYSCALE", 255));
  scrollBoxSize.value = {
    w: unitSize.value.y * 2,
    h: canvas.value.height,
  };
  yearArray.value = _getYearArray(
    FIRST_DATE,
    props.lastDate,
    unitSize.value.clone(),
    scrollBoxSize.value.w - offsetX.value,
    scrollBoxSize.value.w,
    canvas.value.width - scrollBoxSize.value.w,
    props.displayFineness
  );

  displayDates(yearArray.value as Array<Year>);

  // Resize observer
  const RESIZE_OBSERVER = new ResizeObserver(adjustWidth);
  RESIZE_OBSERVER.observe(parentElement.value!);
});
</script>

<template>
  <canvas
    id="date-selection-canvas"
    @click="
      () => {
        const START = new Date();
        handleMousePosition();
        console.log(START.getTime() - new Date().getTime());
        handleScroll(5);
        console.log(START.getTime() - new Date().getTime());
      }
    "
    @mousedown="startScroll(16)"
    @mouseup="stopScroll"
    @mouseleave="stopScroll"
    @mousemove="() => {
      handleMousePosition();
      displayDates(yearArray as Array<Year>);
      console.log(mousePositionState.pos.toString());
      if(mousePositionState.canvas && mousePositionState.layer !== false) {
        console.log(mousePositionState.year);
      }
    }"
    @contextmenu.prevent
  ></canvas>
  <p>{{ offsetX }}</p>
  <button
    @click="
      () => {
        console.log(yearArray);
      }
    "
  >
    Print array
  </button>
  <button
    @click="
      () => {
        console.log(canvas?.shapes);
      }
    "
  >
    Print display
  </button>
  <button
    @click="
      () => {
        handleScroll(500, true);
      }
    "
  >
    --->>
  </button>
</template>
