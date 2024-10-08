<script setup>
import { reactive, ref } from 'vue';
import { useDebounceFn } from '@vueuse/core'
import { useRoutesApi } from '@/composables/useRoutesApi';
import { Chart, Grid, Line } from 'vue3-charts'

const loaded = ref(false);
let AutocompleteSuggestion;
let AutocompleteSessionToken;

async function initGoogleMaps() {
  const placesLibrary = await window.google.maps.importLibrary("places");

  AutocompleteSuggestion = placesLibrary.AutocompleteSuggestion;
  AutocompleteSessionToken = placesLibrary.AutocompleteSessionToken;

  loaded.value = true;
}

initGoogleMaps();

// console.log(Place);

/**
 * TODO: distance googlemaps,
 * .factor
 * balkendiagramm
 * was wird mit der kohle gemacht
 * 1) verbrenner 2) elektro 3) Zug
 */


const cityInputModel = ref('');
const searchResults = ref([]);
const debounceGetPlaces = useDebounceFn(getPlaces, 500);

let sessionToken;

const origin = reactive({
  lat: null,
  lng: null
})


const distanceMeters = ref(null);

function onKeyUp() {
  searchResults.value = [];
  distanceMeters.value = null;
  console.log(cityInputModel.value);
  if (cityInputModel.value.length < 3) return;
  debounceGetPlaces();
}


const suggestions = ref([]);

async function getPlaces() {

  if (!sessionToken) {
    sessionToken = new AutocompleteSessionToken();
  }

  const request = {
    input: cityInputModel.value,
    includedPrimaryTypes: ['locality', 'postal_code', 'neighborhood', 'street_address', 'street_number'],
    region: 'eu',
    language: "de-DE",
    includedRegionCodes: ['DE', 'CH', 'AT', 'FR', 'NL', 'BE', 'LU', 'CZ', 'PL', 'DK', 'PL', 'IT'],
    sessionToken
  };

  const autoCompleteSuggestions = await AutocompleteSuggestion.fetchAutocompleteSuggestions(request)

  suggestions.value = autoCompleteSuggestions.suggestions.map(suggestion => {
    return {
      text: suggestion.placePrediction.text,
      placePrediction: suggestion.placePrediction,
    }
  });
}


async function onSuggestionClick(suggestion) {
  sessionToken = null;
  const place = suggestion.placePrediction.toPlace();
  await place.fetchFields({ fields: ['displayName', 'location'] });
  cityInputModel.value = suggestion.text;

  suggestions.value = [];
  origin.lat = place.location.lat()
  origin.lng = place.location.lng()
  measureDistance();
}

async function measureDistance() {
  const { data } = await useRoutesApi('/v2:computeRoutes', {
    body: JSON.stringify({
      "origin": {
        "location": {
          "latLng": {
            "latitude": origin.lat,
            "longitude": origin.lng
          }
        }
      },
      "destination": {
        "location": {
          "latLng": {
            "latitude": 53.16780615812805,
            "longitude": 9.931648847593461
          }
        }
      }
    })
  }).json();

  distanceMeters.value = data.value?.routes[0]?.distanceMeters;

}


/**
 * CHART
 */

const plByMonth = [
  { name: 'Jan', pl: 1000, avg: 500, inc: 300 },
  { name: 'Feb', pl: 2000, avg: 900, inc: 400 },
  { name: 'Apr', pl: 400, avg: 400, inc: 500 },
  { name: 'Mar', pl: 3100, avg: 1300, inc: 700 },
  { name: 'May', pl: 200, avg: 100, inc: 200 },
  { name: 'Jun', pl: 600, avg: 400, inc: 300 },
  { name: 'Jul', pl: 500, avg: 90, inc: 100 }
]

const chartData = ref(plByMonth)
const chartDirection = ref('horizontal')
const chartMargin = ref({
  left: 0,
  top: 20,
  right: 20,
  bottom: 0
})

const chartAxis = ref({
  primary: {
    type: 'band'
  },
  secondary: {
    domain: ['dataMin', 'dataMax + 100'],
    type: 'linear',
    ticks: 8
  }
})


</script>



<template>
  <div>
    <header>
      <!-- <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125"
        height="125" /> -->

    </header>

    <main>
      <div class="container">
        <div class="default-grid">

          <h1
            class="text-6xl col-span-full text-white md:col-start-3 md:col-span-8 lg:col-start-4 lg:col-span-6">
            Headline</h1>
          <p
            class="col-span-full mt-3 drop-shadow-md text-black md:col-start-3 md:col-span-8 lg:col-start-4 lg:col-span-6">
            Lorem ipsum
            dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod
            tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
            voluptua. At vero eos et accusam et justo duo dolores et ea rebum.
            Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum
            dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing
            elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore
            magna aliquyam erat, sed diam voluptua. At vero eos et accusam et
            justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea
            takimata sanctus est Lorem ipsum dolor sit amet.</p>

          <div
            class="col-span-full md:col-start-3 md:col-span-8 lg:col-start-4 lg:col-span-6 text-black">
            <h3 class="mt-4 text-2xl">Where did you start your trip?</h3>

            <label for="city" class="text-black mt-3">Stadt, Ort oder
              Adresse</label>
            <input type="text" class="bg-white px-3 py-2 block w-full"
              placeholder="Enter a place or city" v-model="cityInputModel"
              @keyup="onKeyUp" v-if="loaded" />

            <ul class="w-full cursor-pointer">
              <li v-for="(suggestion, i) in suggestions" :key="i"
                class="min-h-8 flex items-center bg-white/50 px-3 border-t hover:text-cyan-500"
                @click="onSuggestionClick(suggestion)">
                {{ suggestion.text }}
              </li>
            </ul>
          </div>

          <div
            class="col-span-full md:col-start-3 md:col-span-8 lg:col-start-4 lg:col-span-6 mt-10"
            v-if="distanceMeters">
            <span class="text-5xl text-gray-800">
              you traveled {{ distanceMeters / 1000 }} km
            </span>
          </div>

          <!-- CHART -->

          <div
            class="col-span-full md:col-start-3 md:col-span-8 lg:col-start-4 lg:col-span-6 mt-10">
            <Chart :data="chartData" :margin="chartMargin"
              :direction="chartDirection" :axis="chartAxis">

              <template #layers>
                <Grid strokeDasharray="2,2" />
                <Bar :dataKeys="['name', 'pl']"
                  :barStyle="{ fill: '#90e0ef' }" />
                <Bar :dataKeys="['name', 'avg']"
                  :barStyle="{ fill: '#0096c7' }" />
                <Bar :dataKeys="['name', 'inc']"
                  :barStyle="{ fill: '#48cae4' }" />
                <Marker :value="1000" label="Avg." color="#e76f51"
                  strokeWidth="2" strokeDasharray="6 6" />
              </template>

              <template #widgets>
                <Tooltip borderColor="#48CAE4" :config="{
                  pl: { color: '#90e0ef' },
                  avg: { color: '#0096c7' },
                  inc: { color: '#48cae4' }
                }" />
              </template>

            </Chart>
          </div>


        </div>
      </div>
    </main>

  </div>
</template>


<style scoped></style>
