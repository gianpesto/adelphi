<template>
  <section>
    <p class="text-lg text-gray mt-5 drop-shadow-md">
      Gib deinen Startpunkt
      ein und wähle ihn aus der Liste aus. So können
      wir die Entfernung und deinen CO₂-Fußabdruck berechnen.</p>

    <label for="city" class="mt-10 block text-gray">
      Stadt, Ort oder PLZ
    </label>

    <div class="relative">
      <input type="text" id="city"
        class="bg-light-gray/10 pl-3 pr-12 py-2 block w-full h-14 text-lg border-b border-light-gray/50 outline-0 outline-none rounded-t-md focus:border-magenta"
        placeholder="Type here" v-model="cityInputModel" @keyup="onKeyUp"
        @focus="onFocus" v-if="loaded" />
      <div class="loader  absolute right-3 top-4" v-if="placesBusy"></div>
    </div>

    <div class="relative w-full">
      <ul class="w-full cursor-pointer absolute">
        <template v-if="suggestions.length">
          <li v-for="(suggestion, i) in suggestions" :key="i"
            class="min-h-14 flex items-center px-3 hover:text-cyan-500 border-light-gray/50 bg-light-gray/5 last:rounded-b-md hover:text-magenta"
            :class="{ 'border-t': i }" @click="onSuggestionClick(suggestion)">
            {{ suggestion.text }}
          </li>
        </template>
        <template v-else-if="placesSearched && !suggestions.length">
          <li
            class="min-h-14 flex items-center px-3 border-light-gray/50 bg-light-gray/5 last:rounded-b-md">
            No results found
          </li>
        </template>
      </ul>
    </div>
  </section>
</template>

<script setup>
import { defineModel, defineEmits, nextTick, reactive, ref, watch } from 'vue';
import { useDebounceFn } from '@vueuse/core'
import { useRoutesApi } from '@/composables/useRoutesApi';

const emit = defineEmits(['focus-input']);

const vehicleModel = defineModel('vehicle');

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


const distanceKm = defineModel('distance');

let lockWatcher = false;

watch(cityInputModel, () => {
  if (lockWatcher) return
  searchResults.value = [];
  placesSearched.value = false;
  distanceKm.value = 0;

  if (cityInputModel.value?.length >= 3) {
    debounceGetPlaces();
  }
})


const suggestions = ref([]);
const placesBusy = ref(false);
const placesSearched = ref(false);



function onFocus() {
  emit('focus-input');
}

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

    placesSearched.value = true;
  } catch (err) {
    console.error(err);
  } finally {
    placesBusy.value = false;
  }
}

const barChartEl = ref(null);


async function onSuggestionClick(suggestion) {
  lockWatcher = true;
  sessionToken = null;
  const place = suggestion.placePrediction.toPlace();
  await place.fetchFields({ fields: ['displayName', 'location'] });
  cityInputModel.value = suggestion.text;

  suggestions.value = [];
  placesSearched.value = false;
  origin.lat = place.location.lat()
  origin.lng = place.location.lng()
  await measureDistance();
  lockWatcher = false;

  await nextTick()

  // scroll to distance
  barChartEl.value.$el?.scrollIntoView({ behavior: 'smooth' })
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

  distanceKm.value = Math.round(data.value?.routes[0]?.distanceMeters / 1000) * 2; // round trip

}

</script>
