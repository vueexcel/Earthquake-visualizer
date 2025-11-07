<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="custom-header">
      <q-toolbar>
        <q-toolbar-title> Earthquake Dashboard </q-toolbar-title>

        <q-space />

        <!--
          for larger screens
        -->
        <div v-if="$q.screen.gt.sm" class="row items-center q-gutter-x-lg">
          <q-input
            v-model="locationFilter"
            label="Filter by Location"
            debounce="300"
            dense
            standout
            dark
            style="width: 250px"
          />

          <div>
            
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
            style="width: 300px; margin-top: 20px"
            />
            <div class="range-filter-text">Magnitude</div>
          </div>
        </div>

        <!--
          for smaller screens
        -->
        <q-btn
          v-else
          flat
          round
          dense
          icon="filter_list"
          @click="filtersDialogOpen = true"
        />
      </q-toolbar>
    </q-header>

    <q-dialog v-model="filtersDialogOpen">
      <q-card>
        <q-card-section>
          <div class="text-h6">Filters</div>
        </q-card-section>

        <q-separator />

        <q-card-section class="q-gutter-y-lg">
          <q-input
            v-model="locationFilter"
            label="Filter by Location"
            debounce="300"
            dense
            outlined
          />

          <div>
            <div class="text-subtitle2 q-mb-md">Magnitude</div>
            <q-range
              v-model="magnitudeRange"
              :min="0"
              :max="10"
              :step="0.5"
              label-always
              color="primary"
            />
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn flat label="Close" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useQuasar } from 'quasar'; 
import { useEarthquakeStore } from 'src/stores/earthquake-store.ts';
import { storeToRefs } from 'pinia';

defineOptions({
  name: 'MainLayout',
});


const $q = useQuasar(); 
const filtersDialogOpen = ref(false); 

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
.range-filter-text{
  color: white;
  margin-bottom: 10px;
  font-size: 14px;
  text-align: center;
}
.q-card__section--vert {
    padding-top: 16px !important;
    padding-bottom: 16px !important;
    padding-left: 32px !important;
    padding-right: 32px !important;
}
.q-mb-md {
    margin-bottom: 31px !important;
}
</style>