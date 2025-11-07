<template>
  <div class="map-container" style="height: 600px; position: relative">
    <q-inner-loading :showing="isLoading">
      <q-spinner-gears size="50px" color="primary" />
      <div class="q-mt-md">Preparing map...</div>
    </q-inner-loading>

    <ol-map
      :load-tiles-while-animating="true"
      :load-tiles-while-interacting="true"
      style="height: 100%"
    >
      <ol-view
        ref="view"
        :center="center"
        :zoom="zoom"
        projection="EPSG:4326"
      />

      <ol-tile-layer>
        <ol-source-osm />
      </ol-tile-layer>

      <ol-vector-layer>
        <ol-source-vector :features="mapFeatures"></ol-source-vector>
      </ol-vector-layer>

      <ol-interaction-select @select="handleFeatureSelect"></ol-interaction-select>

      <ol-overlay v-if="selectedQuake" :position="popupPosition">
        <div class="popup">
          <strong>{{ selectedQuake.properties.place }}</strong>
          <br />
          <span>Magnitude: {{ selectedQuake.properties.mag }}</span>
          <q-btn
            icon="close"
            flat
            round
            dense
            size="sm"
            @click="selectedQuake = null"
            class="popup-close"
          />
        </div>
      </ol-overlay>
    </ol-map>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { EarthquakeFeature } from 'src/stores/earthquake-store.ts';
import type { SelectEvent } from 'ol/interaction/Select';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { createEmpty, extend, isEmpty } from 'ol/extent';

defineOptions({ name: 'EarthquakeMap' });

const props = defineProps<{ earthquakes: EarthquakeFeature[] }>();

const view = ref();
const isLoading = ref(false);
const center = ref([0, 0]);
const zoom = ref(2);
const selectedQuake = ref<EarthquakeFeature | null>(null);
const popupPosition = ref<number[]>([]);
// this computed transforms our raw data into OpenLayers Feature objects.
const mapFeatures = computed(() => {
  return props.earthquakes.map((quake) => {
    const feature = new Feature({
      geometry: new Point(quake.geometry.coordinates.slice(0, 2)),
      properties: quake,
    });
    feature.setId(quake.id);
    return feature;
  });
});

const displayPopup = (quake: EarthquakeFeature) => {
  selectedQuake.value = quake;
  popupPosition.value = quake.geometry.coordinates.slice(0, 2);
};

const handleFeatureSelect = (event: SelectEvent) => {
  if (event.selected.length > 0) {
    const selectedFeature = event.selected[0];
    const properties = selectedFeature.getProperties();
    const quakeData = properties.properties as EarthquakeFeature;
    displayPopup(quakeData);
  } else {
    selectedQuake.value = null;
  }
};
//the auto-zoom functionalty when the filter chnages.
watch(
  () => props.earthquakes,
  (newQuakes) => {
    isLoading.value = true;
    setTimeout(() => {
      isLoading.value = false;
      if (!view.value) return;

      const extent = createEmpty();
      if (newQuakes && newQuakes.length > 0) {
        newQuakes.forEach((quake) => {
          extend(extent, quake.geometry.coordinates.slice(0, 2));
        });
      }

      if (!isEmpty(extent)) {
        view.value.fit(extent, {
          padding: [80, 80, 80, 80],
          duration: 500,
        });
      } else {
        view.value.animate({ center: [0, 0], zoom: 2, duration: 500 });
      }
    }, 100);
  },
  {
    immediate: true,
  }
);
</script>

<style scoped>
@import 'ol/ol.css';

.popup {
  background: white;
  border: 1px solid #cccccc;
  border-radius: 4px;
  padding: 10px 15px;
  padding-top: 25px !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  position: relative;
  min-width: 220px;
  pointer-events: auto;
}

.popup-close {
  position: absolute;
  top: 2px;
  right: 2px;
}
</style>