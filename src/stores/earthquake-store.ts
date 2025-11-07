import { defineStore } from 'pinia';
import axios from 'axios';
import { EarthquakeFeature, EarthquakeState } from 'src/components/models';

const FILTERS_STORAGE_KEY = 'earthquake-filters';

const getDefaultFilters = () => ({
    magnitudeRange: { min: 0, max: 10 },
    location: '',
});

const loadFiltersFromStorage = () => {
    try {
        const savedFilters = localStorage.getItem(FILTERS_STORAGE_KEY);
        if (savedFilters) {
            return JSON.parse(savedFilters);
        }
    } catch (error) {
        console.error('Failed to parse filters from localStorage:', error);
    }
    return getDefaultFilters();
};

export const useEarthquakeStore = defineStore('earthquake', {
    state: (): EarthquakeState => ({
        earthquakes: [],
        isLoading: false,
        error: null,
        filters: loadFiltersFromStorage(),
    }),

    getters: {
        filteredEarthquakes(state): EarthquakeFeature[] {
            return state.earthquakes.filter((quake) => {
                const mag = quake.properties.mag ?? 0;
                const place = quake.properties.place?.toLowerCase() || '';
                const filterLocation = state.filters.location.toLowerCase();

                const isMagInRange =
                    mag >= state.filters.magnitudeRange.min &&
                    mag <= state.filters.magnitudeRange.max;
                const isLocationMatch = place.includes(filterLocation);

                return isMagInRange && isLocationMatch;
            });
        },
    },

    actions: {
        _saveFilters() {
            try {
                localStorage.setItem(
                    FILTERS_STORAGE_KEY,
                    JSON.stringify(this.filters)
                );
            } catch (error) {
                console.error('Failed to save filters to localStorage:', error);
            }
        },


        async fetchEarthquakes() {
            this.isLoading = true;
            this.error = null;
            try {
                const response = await axios.get(
                    'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'
                );
                this.earthquakes = response.data.features.filter(
                    (f: EarthquakeFeature) => f.properties && f.geometry
                );
            } catch (err) {
                this.error = 'Failed to fetch earthquake data. Please try again later.';
                console.error(err);
            } finally {
                this.isLoading = false;
            }
        },

        setMagnitudeRange(min: number, max: number) {
            this.filters.magnitudeRange = { min, max };
            this._saveFilters();
        },

        setLocationFilter(location: string) {
            this.filters.location = location;
            this._saveFilters();
        },
    },
});