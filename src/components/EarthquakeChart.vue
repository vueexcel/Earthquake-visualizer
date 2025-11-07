<template>
  <div>
    <v-chart class="chart" :option="chartOptions" autoresize />
  </div>
</template>

<script setup lang="ts">
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { BarChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
} from 'echarts/components';
import VChart from 'vue-echarts';
import { computed } from 'vue';
import { EarthquakeFeature } from 'src/stores/earthquake-store.ts';

defineOptions({
  name: 'EarthquakeChart',
});

const props = defineProps<{
  earthquakes: EarthquakeFeature[];
}>();

use([
  CanvasRenderer,
  BarChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
]);

const magnitudeColors = {
  '0-2': '#4CAF50', 
  '2-3': '#8BC34A', 
  '3-4': '#FFC107', 
  '4-5': '#FF9800', 
  '5-6': '#F44336', 
  '6+': '#B71C1C',  
};
// This computed property reactively builds the chart's configuration.
const chartOptions = computed(() => {
  const magnitudeRanges = {
    '0-2': 0,
    '2-3': 0,
    '3-4': 0,
    '4-5': 0,
    '5-6': 0,
    '6+': 0,
  };

  for (const quake of props.earthquakes) {
    const mag = quake.properties.mag ?? 0;
    if (mag < 2) magnitudeRanges['0-2']++;
    else if (mag < 3) magnitudeRanges['2-3']++;
    else if (mag < 4) magnitudeRanges['3-4']++;
    else if (mag < 5) magnitudeRanges['4-5']++;
    else if (mag < 6) magnitudeRanges['5-6']++;
    else magnitudeRanges['6+']++;
  }

  return {
    title: {
      text: 'Earthquakes by Magnitude',
      left: 'center',
      textStyle: {
        color: '#333',
        fontWeight: 'normal',
      },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      formatter: (params: { name: string; value: number }[]) => {
        const data = params[0];
        return `<strong>Magnitude ${data.name}</strong><br/>Count: ${data.value}`;
      },
      backgroundColor: 'rgba(50,50,50,0.7)',
      borderColor: '#ccc',
      borderWidth: 1,
      textStyle: {
        color: '#fff',
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: Object.keys(magnitudeRanges),
      axisTick: {
        alignWithLabel: true,
      },
    },
    yAxis: {
      type: 'value',
      name: 'Number of Earthquakes',
    },
    series: [
      {
        name: 'Count',
        type: 'bar',
        barWidth: '60%',
        data: Object.entries(magnitudeRanges).map(([range, value]) => ({
          value: value,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: magnitudeColors[range as keyof typeof magnitudeColors] + 'E6', 
                },
                {
                  offset: 1,
                  color: magnitudeColors[range as keyof typeof magnitudeColors] + '80', 
                },
              ],
            },
            borderRadius: [5, 5, 0, 0], 
          },
        })),
        label: {
          show: true,
          position: 'top',
          color: '#333',
        },
      },
    ],
    animationDuration: 1000,
  };
});
</script>

<style scoped>
.chart {
  height: 500px;
}
</style>