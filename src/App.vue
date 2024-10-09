<template>
  <div class="grow flex flex-col">
    <header>
      <!-- <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125"
        height="125" /> -->

    </header>

    <main class="grow container">

      <div class="default-grid bg-white/50 py-8">
        <div
          class="col-span-full md:col-start-3 md:col-span-8 lg:col-start-4 lg:col-span-6">
          <h1
            class="text-5xl sm:text-7xl headline text-center text-green font-bold">
            A un Angleso it va semblar</h1>

          <p class="text-lg text-gray mt-10 drop-shadow-md">
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


          <h3 class="mt-10 text-2xl font-bold text-magenta">Where did you start
            your trip?</h3>

          <label for="city" class="mt-6 block text-gray">Stadt, Ort oder
            PLZ</label>

          <div class="relative">
            <input type="text" id="city"
              class="bg-light-gray/10 pl-3 pr-12 py-2 block w-full h-14 text-lg border-b border-light-gray/50 outline-0 outline-none rounded-t-md focus:border-magenta"
              placeholder="Type here" v-model="cityInputModel" @keyup="onKeyUp"
              v-if="loaded" />
            <div class="loader absolute right-3 top-4" v-if="placesBusy"></div>
          </div>

          <ul class="w-full cursor-pointer">
            <li v-for="(suggestion, i) in suggestions" :key="i"
              class="min-h-14 flex items-center bg-white/50 px-3 hover:text-cyan-500 border-light-gray/50 bg-light-gray/5 last:rounded-b-md hover:text-magenta"
              :class="{ 'border-t': i }" @click="onSuggestionClick(suggestion)">
              {{ suggestion.text }}
            </li>
          </ul>


          <div class="mt-10 bg-white/50 p-4" v-if="distanceMeters">
            <span class="text-5xl text-gray-800">
              you traveled {{ formatDistance(distanceMeters / 1000) }}
            </span>

            <!-- CHART -->
            <BarChart :distance-meters="distanceMeters" />
          </div>


        </div>

      </div>
    </main>

  </div>
</template>

<script setup>
import { reactive, ref, watch } from 'vue';
import { useDebounceFn } from '@vueuse/core'
import { useRoutesApi } from '@/composables/useRoutesApi';
import BarChart from '@/components/BarChart.vue';

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


/**
 * TODO: distance googlemaps,
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


let lockWatcher = false;

watch(cityInputModel, () => {
  if (lockWatcher) return
  searchResults.value = [];
  distanceMeters.value = null;

  if (cityInputModel.value?.length > 3) {
    debounceGetPlaces();
  }
})


const suggestions = ref([]);
const placesBusy = ref(false);

async function getPlaces() {

  if (!sessionToken) {
    sessionToken = new AutocompleteSessionToken();
  }

  try {
    placesBusy.value = true;

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
  } catch (err) {
    console.error(err);
  } finally {
    placesBusy.value = false;
  }
}


async function onSuggestionClick(suggestion) {
  lockWatcher = true;
  sessionToken = null;
  const place = suggestion.placePrediction.toPlace();
  await place.fetchFields({ fields: ['displayName', 'location'] });
  cityInputModel.value = suggestion.text;

  suggestions.value = [];
  origin.lat = place.location.lat()
  origin.lng = place.location.lng()
  measureDistance();
  lockWatcher = false;
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
function formatDistance(value) {
  return new Intl.NumberFormat('de-DE', { style: 'unit', unit: 'kilometer', unitDisplay: 'narrow', maximumFractionDigits: 2, }).format(value);
}

</script>



<style scoped>
.headline {
  background: linear-gradient(rgb(135, 199, 57), rgb(var(--color-green)));
  background-clip: text;
  -webkit-text-fill-color: transparent;
}


.loader {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  animation: rotate 1s linear infinite
}

.loader::before {
  content: "";
  box-sizing: border-box;
  position: absolute;
  inset: 0px;
  border-radius: 50%;
  border: 4px solid rgb(var(--color-green));
  animation: prixClipFix 2s linear infinite alternate;
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

@keyframes prixClipFix {
  0% {
    clip-path: polygon(50% 50%, 0 0, 0 0, 0 0, 0 0, 0 0)
  }

  25% {
    clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 0, 100% 0, 100% 0)
  }

  50% {
    clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 100% 100%, 100% 100%)
  }

  75% {
    clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 0 100%, 0 100%)
  }

  100% {
    clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 0 100%, 0 0)
  }
}
</style>
