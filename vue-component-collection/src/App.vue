<script setup lang="ts">
import DateRangeInput from "./components/DateRangeInput.vue";
</script>

<template>
  <h1>Vue Component Collection</h1>
  <p>Written by <em>Sif Høg-Getgood</em></p>
  <p>This is a collection of vue components I've created.</p>
  <h2>Date Range Input</h2>
  <DateRangeInput
    :display-fineness="['months', 'days', 'years']"
    :unit-size="16"
  ></DateRangeInput>
</template>

<style scoped></style>
