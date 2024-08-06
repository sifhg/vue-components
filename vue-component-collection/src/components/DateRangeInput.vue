<script setup lang="ts">
type DateRangeInputProps = {
  displayFineness: Array<"days" | "months" | "years">;
  width?: CSSUnit;
};
type _CSSUnitSuffix = `${"" | " "}${
  | "cm"
  | "mm"
  | "in"
  | "px"
  | "pt"
  | "pc"
  | "em"
  | "ex"
  | "ch"
  | "rem"
  | "vw"
  | "vh"
  | "vmin"
  | "vmax"
  | "%"}`;
type CSSUnit = `${number}${_CSSUnitSuffix}` | "0";
const test = "100%";

type _digit = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
type _year = `${_digit}${_digit}${_digit}${_digit}`;
type _month = `${"0" | "1"}${_digit}`;

function _daysIn(year: _year): number;
function _daysIn(month: _month, year: _year): number;
function _daysIn(arg0: _month | _year, arg1?: _year): number {
  let firstDay: number;
  let lastDay: number;
  if (arg1) {
    if (Number(arg0) >= 12 || Number(arg0) < 0) {
      throw new Error(
        `month parameter is ${arg0}. It must be a non-negative integer less than 12.`
      );
    }
    firstDay = new Date(Number(arg1), Number(arg0)).getTime();
    lastDay = new Date(Number(arg1), Number(arg0) + 1).getTime();
  } else {
    firstDay = new Date(Number(arg0), 0).getTime();
    lastDay = new Date(Number(arg0) + 1, 0).getTime();
  }
  return (lastDay - firstDay) / 86400000;
}

const props = withDefaults(defineProps<DateRangeInputProps>(), {
  width: "100%",
});
</script>

<template>
  <div class="date-range-input" :style="`width:${props.width}`">
    <div class="scroll-left scroll">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
      >
        <path d="M560-280 360-480l200-200v400Z" />
      </svg>
    </div>
    <div class="date-container">
      <div
        v-if="props.displayFineness.includes('days')"
        class="day-container container"
      ></div>
      <div
        v-if="props.displayFineness.includes('months')"
        class="month-container container"
      ></div>
      <div
        v-if="props.displayFineness.includes('years')"
        class="year-container container"
      ></div>
    </div>
    <div class="scroll-right scroll">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
      >
        <path d="M400-280v-400l200 200-200 200Z" />
      </svg>
    </div>
  </div>
</template>

<style scoped>
div {
  border: solid black 1px;
  min-height: 10px;
  min-width: 10px;
}
.date-container {
  flex-grow: 1;
}
.scroll {
  flex-basis: 3rem;
  align-content: center;
  text-align: center;
}
.date-range-input {
  display: flex;
}
</style>
