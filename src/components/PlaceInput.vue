<template>
  <div class="relative">
    <label class="mt-10 block">
      <span class="text-green">{{ label }}</span>

      <input type="text"
        class="bg-light-gray/10 pl-3 pr-12 py-2 block w-full h-14 text-lg border-b border-light-gray/50 outline-0 outline-none rounded-t-md focus:border-magenta"
        placeholder="Stadt, Ort oder PLZ" v-model="inputModel"
        @focus="emit('focus-input')" v-if="loaded" />
      <div class="loader  absolute right-3 top-4" v-if="placesBusy"></div>
    </label>

    <div class="relative w-full z-[1]">
      <ul class="w-full cursor-pointer absolute">
        <template v-if="suggestions.length">
          <li v-for="(suggestion, i) in suggestions" :key="i"
            class="min-h-14 flex items-center px-3 hover:text-cyan-500 border-light-gray/50 bg-[#F9F8F8] last:rounded-b-md hover:text-magenta"
            :class="{ 'border-t': i }" @click="onSuggestionClick(suggestion)">
            {{ suggestion.text }}
          </li>
        </template>
        <template v-else-if="placesSearched && !suggestions.length">
          <li
            class="min-h-14 flex items-center px-3 border-light-gray/50 bg-[#F9F8F8] last:rounded-b-md">
            No results found
          </li>
        </template>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useDebounceFn, watchPausable } from '@vueuse/core'

defineProps({
  label: String,
});

const model = defineModel();
const inputModel = ref('');

const emit = defineEmits(['focus-input']);

const searchResults = ref([]);
const debounceGetPlaces = useDebounceFn(getPlaces, 500);

const loaded = ref(false);
let AutocompleteSuggestion;
let AutocompleteSessionToken;
let sessionToken;

async function initGoogleMaps() {
  const placesLibrary = await window.google.maps.importLibrary("places");
  AutocompleteSuggestion = placesLibrary.AutocompleteSuggestion;
  AutocompleteSessionToken = placesLibrary.AutocompleteSessionToken;
  loaded.value = true;
}

initGoogleMaps();

const { pause: pauseWatchModel, resume: resumeWatchModel } = watchPausable(inputModel, () => {
  searchResults.value = [];
  placesSearched.value = false;
  // distanceKm.value = 0;

  if (inputModel.value?.length >= 3) {
    debounceGetPlaces();
  }
})

const suggestions = ref([]);
const placesBusy = ref(false);
const placesSearched = ref(false);

async function getPlaces() {

  if (!sessionToken) {
    sessionToken = new AutocompleteSessionToken();
  }

  try {
    placesBusy.value = true;

    const request = {
      input: inputModel.value,
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

async function onSuggestionClick(suggestion) {
  pauseWatchModel();
  sessionToken = null;
  const place = suggestion.placePrediction.toPlace();
  await place.fetchFields({ fields: ['displayName', 'location'] });
  model.value = suggestion.text;
  inputModel.value = suggestion.text;

  suggestions.value = [];
  placesSearched.value = false;

  emit('suggestion-selected', place)

  resumeWatchModel();
}

</script>

<style scoped></style>
