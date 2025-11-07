<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="custom-header">
      <q-toolbar>
        <q-toolbar-title>Earthquake Dashboard </q-toolbar-title>

        <q-space />

        <q-input
          v-model="locationFilter"
          label="Filter by Location"
          debounce="300"
          dense
          standout
          dark
          class="q-mr-md"
          style="width: 250px; margin-right: 40px;"
        />

        <div class="q-mr-md" style="width: 300px ; margin-top: 30px">
          <q-range
            v-model="magnitudeRange"
            :min="0"
            :max="10"
            :step="0.5"
            label
            color="white"
            right-label-color="dark"
            left-label-color="dark"
            dark
          />
          <div class="range-filter">Magnitude</div>
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useEarthquakeStore } from 'src/stores/earthquake-store.ts';
import { storeToRefs } from 'pinia';

defineOptions({
  name: 'MainLayout',
});

const store = useEarthquakeStore();

const { filters } = storeToRefs(store);

const locationFilter = computed({
  get: () => filters.value.location,
  set: (val) => store.setLocationFilter(val),
});

const magnitudeRange = computed({
  get: () => filters.value.magnitudeRange,
  set: (val) => store.setMagnitudeRange(val.min, val.max),
});
</script>

<style scoped>
.custom-header {
  margin-top: 10px;
  background-color: #1976d2;
  color: white;
}
.range-filter{
  color: white;
  margin-bottom: 10px;
  font-size: 14px;
  text-align: center;
}
</style>