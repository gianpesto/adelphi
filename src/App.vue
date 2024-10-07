<script setup>
import { ref, onMounted, watch } from 'vue';
import { useDebounceFn } from '@vueuse/core'
// import QuestionItem from './components/QuestionItem.vue';

// import { useApi } from '@/composables/useApi'
// const { isFetching, error, data } = useApi('/data.json').json()

// const service = new window.google.maps.places.AutocompleteService()
// console.log(service);
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
 */


const cityInputModel = ref('');
const searchResults = ref([]);
const debounceGetPlaces = useDebounceFn(getPlaces, 500);

let sessionToken;

function onKeyDown() {
  searchResults.value = [];
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
    includedPrimaryTypes: ['administrative_area_level_1', 'administrative_area_level_2', 'locality', 'postal_code', 'school_district'],
    region: 'eu',
    language: "de-DE",
    origin: { lat: 53.197232751823485, lng: 9.975404573028344 },
    includedRegionCodes: ['DE'],
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

// const originLocation = ref(null);

const distanceMeters = ref(null);

async function onSuggestionClick(suggestion) {
  sessionToken = null;
  const place = suggestion.placePrediction.toPlace();
  await place.fetchFields({ fields: ['displayName', 'location'] });
  cityInputModel.value = suggestion.text;
  suggestions.value = [];
  distanceMeters.value = suggestion.placePrediction.distanceMeters;
}

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

          <h1 class="text-6xl col-span-full text-white">Headline</h1>
          <p class="col-span-full mt-3 drop-shadow-md text-white">Lorem ipsum
            dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod
            tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
            voluptua. At vero eos et accusam et justo duo dolores et ea rebum.
            Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum
            dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing
            elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore
            magna aliquyam erat, sed diam voluptua. At vero eos et accusam et
            justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea
            takimata sanctus est Lorem ipsum dolor sit amet.</p>

          <div class="col-span-full lg:col-span-6 text-black">
            <input type="text" class="bg-white bg-opacity-60 px-3 py-2 focus:bg-opacity-100 mt-3 block  w-full"
              placeholder="Enter a place or city" v-model="cityInputModel" @keydown="onKeyDown" v-if="loaded" />

            <ul class="w-full cursor-pointer">
              <li v-for="(suggestion, i) in suggestions" :key="i"
                class="min-h-8 flex items-center bg-white/50 px-3 border-t hover:text-cyan-500"
                @click="onSuggestionClick(suggestion)">
                {{ suggestion.text }}
              </li>
            </ul>
          </div>

          <div class="col-span-full" v-if="distanceMeters">
            you traveled {{ distanceMeters / 1000 }} km
          </div>
        </div>
      </div>
    </main>

  </div>
</template>


<style scoped></style>
