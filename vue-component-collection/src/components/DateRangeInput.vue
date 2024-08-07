<script setup lang="ts">
import { ref } from "vue";
import DayBox from "./DateRangeInput/DayBox.vue";
import MonthBox from "./DateRangeInput/MonthBox.vue";
type DateRangeInputProps = {
  displayFineness: Array<"days" | "months" | "years">;
  width?: CSSUnit;
  lastDate?: Date;
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

const props = withDefaults(defineProps<DateRangeInputProps>(), {
  width: "100%",
  lastDay: new Date(),
});

const displayFineness = ref(new Set(props.displayFineness));
const mouseHoverDate = ref<Date | false>(false);

const MONTH_LIST = [1, 2, 3, 4];
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
      <MonthBox
        v-for="month in MONTH_LIST"
        :month="month"
        :year="2021"
        :range="{
          firstDate: new Date(2021, 1, 10),
          lastDate: new Date(2021, 4, 10),
        }"
        :displayFineness="displayFineness"
      />
      <!-- <DayBox v-for="day in DAY_LIST" :day="day" :selected="day > 5"></DayBox> -->
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
  user-select: none;
}
.date-container {
  flex-grow: 1;
  display: flex;
}
.month-box {
  flex-grow: 1;
  align-content: center;
  text-align: center;
}
.day-box {
  flex-grow: 1;
  align-content: center;
  text-align: center;
}
.scroll {
  flex-basis: 3rem;
  align-content: center;
  text-align: center;
}
.date-range-input {
  display: flex;
}
.selected {
  background-color: blue;
}
</style>
