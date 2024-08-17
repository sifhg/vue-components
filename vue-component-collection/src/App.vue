<script setup lang="ts">
import DateRangeInput from "./components/DateRangeInput.vue";
import DateRangeInput2 from "./components/DateRangeInput2.vue";
</script>

<template>
  <h1>Vue Component COllection</h1>
  <p>Written by <em>Sif Høg-Getgood</em></p>
  <p>This is a collection of vue components I've created.</p>
  <h2>Date Range Input</h2>
  <h3>First attempt</h3>
  <DateRangeInput :display-fineness="['months', 'days', 'years']" />
  <h3>Second attempt</h3>
  <DateRangeInput2
    :display-fineness="['months', 'days', 'years']"
    :unit-size="16"
  ></DateRangeInput2>
</template>

<style scoped></style>
