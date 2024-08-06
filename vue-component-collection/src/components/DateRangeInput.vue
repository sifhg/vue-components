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

const props = withDefaults(defineProps<DateRangeInputProps>(), {
  width: "100%",
});
</script>

<template>
  <div class="date-range-input" :style="`width:${props.width}`">
    <div class="scroll-left"></div>
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
    <div class="scroll-right"></div>
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
.scroll-left {
  flex-basis: 3rem;
}
.scroll-right {
  flex-basis: 3rem;
}
.date-range-input {
  display: flex;
}
</style>
