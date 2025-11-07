<template>
  <q-page padding>
    <div v-if="store.isLoading" class="fullscreen text-center q-pa-md flex flex-center">
      <div>
        <q-spinner-gears color="primary" size="5em" />
        <div class="q-mt-md text-h6">Fetching latest earthquake data...</div>
      </div>
    </div>

    <div v-else-if="store.error" class="fullscreen text-center q-pa-md flex flex-center">
      <q-banner inline-actions class="text-white bg-red">
        <template v-slot:avatar>
          <q-icon name="signal_wifi_off" color="white" />
        </template>
        <b>Error:</b> {{ store.error }}
        <template v-slot:action>
          <q-btn flat color="white" label="Retry" @click="fetchData" />
        </template>
      </q-banner>
    </div>

    <div v-else>
      <q-card>
        <q-tabs
          v-model="currentTab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <q-tab name="table" label="Table View" icon="table_rows" />
          <q-tab name="chart" label="Chart View" icon="bar_chart" />
          <q-tab name="map" label="Map View" icon="map" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="currentTab" animated>
          <q-tab-panel name="table">
            <EarthquakeTable :earthquakes="filteredEarthquakes" />
          </q-tab-panel>

          <q-tab-panel name="chart">
            <EarthquakeChart :earthquakes="filteredEarthquakes" />
          </q-tab-panel>

          <q-tab-panel name="map">
            <EarthquakeMap :earthquakes="filteredEarthquakes" />
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useEarthquakeStore } from 'src/stores/earthquake-store';
import { storeToRefs } from 'pinia';
import EarthquakeTable from 'src/components/EarthquakeTable.vue';
import EarthquakeChart from 'src/components/EarthquakeChart.vue';
import EarthquakeMap from 'src/components/EarthquakeMap.vue';

defineOptions({
  name: 'IndexPage',
});

const store = useEarthquakeStore();

const { filteredEarthquakes } = storeToRefs(store);
const currentTab = ref('table');
const fetchData = () => {
  store.fetchEarthquakes();
};

onMounted(() => {
  if (store.earthquakes.length === 0) {
    fetchData();
  }
});
</script>