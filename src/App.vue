<template>
  <div class="grow flex flex-col">
    <header class="container">
      <div class="default-grid">
        <div
          :class="['col-span-full', 'sm:col-span-6', 'sm:col-start-4', 'md:col-start-5', 'md:col-span-4', 'xl:col-span-2', 'xl:col-start-6']">
          <a href="https://naturpark-lueneburger-heide.de">

            <img alt="Naturpark Lüneburger Heide Logo" class="logo w-full mt-10"
              src="./assets/logo-18-jahre.png" width="1772" heihgt="945" />
          </a>
        </div>
      </div>
    </header>

    <!-- <div id="donate-button-container">
      <div id="donate-button"></div>
      <script src="https://www.paypalobjects.com/donate/sdk/donate-sdk.js"
        charset="UTF-8"></script>
      <script>
      PayPal.Donation.Button({
      env:'production',
      hosted_button_id:'9BUSBTQN77MGS',
      image: {
      src:'https://www.paypalobjects.com/de_DE/DE/i/btn/btn_donate_LG.gif',
      alt:'Spenden mit dem PayPal-Button',
      title:'PayPal - The safer, easier way to pay online!',
      }
      }).render('#donate-button');
      </script>
    </div> -->

    <main class="grow container">

      <div class="default-grid bg-white/50 py-8">
        <div
          class="col-span-full md:col-start-3 md:col-span-8 lg:col-start-4 lg:col-span-6">
          <h1
            class="text-5xl sm:text-7xl headline text-center text-green font-bold pb-2">
            „Wie groß ist dein CO₂-Fußabdruck?“</h1>

          <p class="text-lg text-gray mt-10 drop-shadow-md">
            Berechne deine CO₂-Emissionen für deine Fahrt hierher und erfahre,
            wie du sie direkt kompensieren kannst. Ein kleiner Schritt für dich,
            ein großer Schritt für unseren Planeten!</p>


          <hr class="mt-14 text-light-gray/30" />

          <h3 class="mt-14 text-2xl font-bold text-green" ref="headline1El">
            <span class="font-bold text-4xl">1.</span>
            Wo startete deine Reise?
          </h3>

          <p class="text-lg text-gray mt-5 drop-shadow-md">Gib deinen
            Startpunkt
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
            <div class="loader absolute right-3 top-4" v-if="placesBusy"></div>
          </div>

          <div class="relative w-full">
            <ul class="w-full cursor-pointer absolute">
              <template v-if="suggestions.length">
                <li v-for="(suggestion, i) in suggestions" :key="i"
                  class="min-h-14 flex items-center px-3 hover:text-cyan-500 border-light-gray/50 bg-light-gray/5 last:rounded-b-md hover:text-magenta"
                  :class="{ 'border-t': i }"
                  @click="onSuggestionClick(suggestion)">
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

          <hr class="mt-14 text-light-gray/30" />

          <section class="mt-14 bg-white/50 p-4"
            :class="{ 'pointer-events-none opacity-10': !distanceKm }">

            <!-- CHART -->
            <BarChart :distance-km="distanceKm" ref="barChartEl"
              v-model="vehicleModel" />
          </section>

          <hr class="mt-14 text-light-gray/30" />

          <section class="mt-14 bg-white/50 p-4">
            <DonationSection
              :class="{ 'pointer-events-none opacity-10': !vehicleModel }" />
          </section>

          <hr class="mt-14 text-light-gray/30" />

        </div>
      </div>
    </main>

    <footer class="container">
      <div class="default-grid bg-white/50 py-8">
        <div
          class="col-span-full md:col-start-3 md:col-span-8 lg:col-start-4 lg:col-span-6">
          <a href="https://naturpark-lueneburger-heide.de/impressum"
            class="hover:text-green" target="_blank">Impressum</a>

        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { nextTick, reactive, ref, watch } from 'vue';
import { useDebounceFn } from '@vueuse/core'
import { useRoutesApi } from '@/composables/useRoutesApi';
import BarChart from '@/components/BarChart.vue';
import DonationSection from '@/components/DonationSection.vue';

const vehicleModel = ref();

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


const distanceKm = ref(0);

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

let focussedOnce = false;
const headline1El = ref(null);
function onFocus() {
  if (focussedOnce) {
    return
  }
  focussedOnce = true;
  headline1El.value.scrollIntoView({ behavior: 'smooth' })
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
