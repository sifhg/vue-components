<script setup lang="ts">
import DateRangeInput from "./components/DateRangeInput.vue";
</script>

<template>
  <h1>Vue Component COllection</h1>
  <p>Written by <em>Sif Høg-Getgood</em></p>
  <p>This is a collection of vue components I've created.</p>
  <DateRangeInput :display-fineness="['months', 'days', 'years']" />
</template>

<style scoped></style>
