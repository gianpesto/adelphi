<template>
  <section>
    <p class="text-lg text-gray mt-5 drop-shadow-md">
      Geben Sie hier an, von wo aus sie angereist sind. Auf Basis der Entfernung
      berechnen wir im kommenden Schritt die verkehrsbedingten Klimaemissionen
      verschiedener Fortbewegungsmittel. </p>

    <PlaceInput v-model="originModel" @focus-input="emit('focus-input')"
      @suggestion-selected="onOriginSelected"
      :label="isDestinationMode ? 'Von' : 'Startpunkt Reise'" />

    <PlaceInput v-if="isDestinationMode" v-model="destinationModel"
      @focus-input="emit('focus-input')"
      @suggestion-selected="onDestinationSelected" label="Nach" />


  </section>
</template>

<script setup>
import PlaceInput from '@/components/PlaceInput.vue';
import { reactive, ref, nextTick } from 'vue';
import { useRoutesApi } from '@/composables/useRoutesApi';

const emit = defineEmits(['focus-input']);

// const queryParams = new URLSearchParams(window.location.search);
// const isDestinationMode = queryParams.get('e');

const isDestinationMode = true;


const originModel = ref('');
const destinationModel = ref('Naturpark Lüneburger Heide');

const origin = reactive({
  lat: null,
  lng: null
})

const destination = reactive({
  lat: 53.16780615812805, // lüneburger heide
  lng: 9.931648847593461,
})

const distanceKm = defineModel('distance');

async function onOriginSelected(place) {
  origin.lat = place.location.lat()
  origin.lng = place.location.lng()

  if (!isDestinationMode || (originModel.value && destinationModel.value)) {
    await measureDistance();
    await nextTick()
  }
}

async function onDestinationSelected(place) {
  destination.lat = place.location.lat()
  destination.lng = place.location.lng()

  if (originModel.value && destinationModel.value) {
    await measureDistance();
    await nextTick()
  }
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
            "latitude": destination.lat,
            "longitude": destination.lng
          }
        }
      }
    })
  }).json();

  distanceKm.value = Math.round(data.value?.routes[0]?.distanceMeters / 1000) * 2; // round trip

}

</script>
