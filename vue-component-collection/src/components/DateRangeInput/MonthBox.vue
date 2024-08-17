<script setup lang="ts">
import { ref } from "vue";
import DayBox from "./DayBox.vue";
import {
  _dateAddition,
  _dateSubtraction,
  _daysIn,
  _monthString,
} from "./supportFunctions";

type RangePropsEdges = {
  firstDate: Date;
  lastDate: Date;
};
type RangePropsFirst = {
  firstDate: Date;
  scope: `${number}${" " | ""}${"d" | "m" | "y"}`;
};
type RangePropsLast = {
  firstDate: Date;
  scope: `${number}${" " | ""}${"d" | "m" | "y"}`;
};
type RangeProps = RangePropsEdges | RangePropsFirst | RangePropsLast;
type MonthBoxProps = {
  month: number;
  year: number;
  displayFineness: Set<"days" | "months" | "years">;
  range: RangeProps;
  selected?: boolean;
};

const props = defineProps<MonthBoxProps>();
const selected = ref(props.selected ? props.selected : false);
const firstDate = ref<Date>();
if ("firstDate" in props.range) {
  firstDate.value = props.range.firstDate;
}
const lastDate = ref<Date>();
if ("lastDate" in props.range) {
  lastDate.value = props.range.lastDate;
}
if ("scope" in props.range) {
  if (!firstDate.value) {
    firstDate.value = _dateSubtraction(lastDate.value!, props.range.scope);
  }
  if (!lastDate.value) {
    lastDate.value = _dateAddition(firstDate.value!, props.range.scope);
  }
}

function toggledSelection() {
  selected.value = !selected.value;
}

const numberOfDays = ref<number>(_daysIn(props.month, props.year));
if (
  props.month === lastDate.value?.getMonth() &&
  props.year === lastDate.value?.getFullYear()
) {
  numberOfDays.value = lastDate.value.getDate();
}
if (
  props.month === firstDate.value?.getMonth() &&
  props.year === firstDate.value?.getFullYear()
) {
  numberOfDays.value -= firstDate.value.getDate();
}

const DAY_LIST: Array<number> = (() => {
  let dayArray: Array<number> = [];
  for (let d = 0; d < numberOfDays.value; d++) {
    if (
      props.month === firstDate.value?.getMonth() &&
      props.year === firstDate.value?.getFullYear()
    ) {
      dayArray.push(d + firstDate.value.getDate());
    } else {
      dayArray.push(d);
    }
  }
  return dayArray;
})();
</script>

<template>
  <div class="month-box">
    <div class="day-box-container" v-if="props.displayFineness.has('days')">
      <DayBox
        v-for="dayNum in DAY_LIST"
        :day="dayNum"
        :month="props.month"
        :year="props.year"
      />
    </div>
    <div
      :class="`selection-display ${selected ? 'selected' : ''}`"
      @click="toggledSelection"
    >
      {{ _monthString(props.month + 1) }}
    </div>
  </div>
</template>

<style scoped>
div {
  border: solid black 1px;
  min-height: 10px;
  min-width: 10px;
}
.day-box-container {
  display: flex;
}
.day-box {
  flex-grow: 1;
  align-content: center;
  text-align: center;
}
.selected {
  background-color: blue;
}
</style>
