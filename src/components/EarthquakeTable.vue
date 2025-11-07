<template>
    <div>
        <q-table :rows="earthquakes" :columns="columns" row-key="id" :rows-per-page-options="[10, 25, 50, 0]"
            v-model:pagination="pagination" :filter="searchQuery" @row-click="handleRowClick" class="earthquake-table"
            flat bordered>
            <template v-slot:top>
                <div class="q-table__title">Earthquakes Data</div>
                <q-space />
                <q-input dense debounce="300" v-model="searchQuery" placeholder="Search in table..."
                    standout="bg-grey-9 text-white">
                    <template v-slot:append>
                        <q-icon name="search" />
                    </template>
                </q-input>
            </template>

            <template v-slot:header="props">
                <q-tr :props="props">
                    <q-th v-for="col in props.cols" :key="col.name" :props="props" class="text-white bg-primary">
                        {{ col.label }}
                    </q-th>
                </q-tr>
            </template>

            <template v-slot:body-cell-location="props">
                <q-td :props="props">
                    <div>
                        <strong class="text-subtitle2">{{
                            parseLocation(props.value).main
                            }}</strong>
                    </div>
                    <div class="text-caption text-grey-7">
                        {{ parseLocation(props.value).detail }}
                    </div>
                </q-td>
            </template>

            <template v-slot:body-cell-magnitude="props">
                <q-td :props="props" class="text-center">
                    <q-badge :color="getMagnitudeColor(props.value)" text-color="white"
                        class="q-py-xs q-px-sm text-weight-bold">
                        {{ props.value.toFixed(1) }}
                    </q-badge>
                </q-td>
            </template>

            <template v-slot:body-cell-time="props">
                <q-td :props="props">
                    <div>{{ formatTime(props.value).date }}</div>
                    <div class="text-caption text-grey-7">
                        {{ formatTime(props.value).time }}
                    </div>
                </q-td>
            </template>

            <template v-slot:body-cell-depth="props">
                <q-td :props="props" class="text-right">
                    <q-chip dense square outline :color="getDepthColor(props.value)">
                        <q-avatar icon="south" :color="getDepthColor(props.value)" text-color="white" />
                        {{ props.value.toFixed(2) }} km
                    </q-chip>
                </q-td>
            </template>
        </q-table>

        <q-drawer v-model="isDrawerOpen" side="right" overlay bordered :width="400" class="earthquake-drawer">
            <q-scroll-area class="fit">
                <div v-if="selectedEarthquake" class="q-pa-lg">
                    <q-btn icon="close" flat round dense @click="isDrawerOpen = false" class="drawer-close-btn" />

                    <div class="text-h6 q-mb-md">Earthquake Details</div>
                    <q-list bordered separator>
                        <q-item>
                            <q-item-section>
                                <q-item-label overline>Location</q-item-label>
                                <q-item-label>{{
                                    selectedEarthquake.properties.place
                                    }}</q-item-label>
                            </q-item-section>
                        </q-item>
                        <q-item>
                            <q-item-section>
                                <q-item-label overline>Magnitude</q-item-label>
                                <q-item-label>
                                    <q-badge :color="getMagnitudeColor(selectedEarthquake.properties.mag)
                                        " class="text-weight-bold">
                                        {{ selectedEarthquake.properties.mag.toFixed(1) }}
                                    </q-badge>
                                </q-item-label>
                            </q-item-section>
                        </q-item>
                        <q-item>
                            <q-item-section>
                                <q-item-label overline>Date & Time</q-item-label>
                                <q-item-label>{{
                                    new Date(selectedEarthquake.properties.time).toLocaleString()
                                    }}</q-item-label>
                            </q-item-section>
                        </q-item>
                        <q-item>
                            <q-item-section>
                                <q-item-label overline>Depth</q-item-label>
                                <q-item-label>{{
                                    selectedEarthquake.geometry.coordinates[2].toFixed(2)
                                    }}
                                    km</q-item-label>
                            </q-item-section>
                        </q-item>
                        <q-item>
                            <q-item-section>
                                <q-item-label overline>Coordinates</q-item-label>
                                <q-item-label caption>[Lon:
                                    {{ selectedEarthquake.geometry.coordinates[0] }}, Lat:
                                    {{
                                        selectedEarthquake.geometry.coordinates[1]
                                    }}]</q-item-label>
                            </q-item-section>
                        </q-item>
                    </q-list>
                    <q-btn label="Close" color="primary" class="full-width q-mt-md" @click="isDrawerOpen = false"
                        unelevated />
                </div>
            </q-scroll-area>
        </q-drawer>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { QTableColumn } from 'quasar';
import { EarthquakeFeature } from 'src/stores/earthquake-store.ts';

defineOptions({ name: 'EarthquakeTable' });

defineProps<{ earthquakes: EarthquakeFeature[] }>();

const searchQuery = ref('');
const pagination = ref({ rowsPerPage: 10 });
const isDrawerOpen = ref(false);
const selectedEarthquake = ref<EarthquakeFeature | null>(null);

const handleRowClick = (evt: Event, row: EarthquakeFeature) => {
    selectedEarthquake.value = row;
    isDrawerOpen.value = true;
};

const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return {
        date: date.toLocaleDateString(),
        time: date.toLocaleTimeString(),
    };
};

const parseLocation = (place: string) => {
    if (!place || !place.includes(' of ')) {
        return { main: place, detail: '' };
    }
    const parts = place.split(' of ');
    return {
        main: parts[1],
        detail: parts[0],
    };
};

const getMagnitudeColor = (mag: number): string => {
    if (mag >= 6) return 'red-9';
    if (mag >= 5) return 'deep-orange-7';
    if (mag >= 4) return 'amber-7';
    return 'light-green-7';
};

const getDepthColor = (depth: number): string => {
    if (depth > 300) return 'blue-grey-8';
    if (depth > 70) return 'blue-grey-6';
    return 'blue-grey-4';
};

const columns: QTableColumn[] = [
    {
        name: 'location',
        label: 'Location',
        align: 'left',
        field: (row) => row.properties.place,
        sortable: true,
    },
    {
        name: 'magnitude',
        label: 'Magnitude',
        align: 'center',
        field: (row) => row.properties.mag,
        sortable: true,
    },
    {
        name: 'time',
        label: 'Time',
        align: 'left',
        field: (row) => row.properties.time,
        sortable: true,
    },
    {
        name: 'depth',
        label: 'Depth (km)',
        align: 'right',
        field: (row) => row.geometry.coordinates[2],
        sortable: true,
    },
];
</script>

<style lang="scss">
.earthquake-table {
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);

    .q-table__top {
        padding: 1rem 1.5rem;
    }

    .q-table th {
        font-weight: 600;
    }

    tbody tr {
        transition: background-color 0.2s ease;
        cursor: pointer;

        &:hover {
            background-color: #f5f5f5;
        }
    }
}

.earthquake-drawer {
    .drawer-close-btn {
        position: absolute;
        top: 10px;
        right: 10px;
        z-index: 1;
    }
}
</style>