<script setup>
// import { ref, onMounted } from 'vue';
// import QuestionItem from './components/QuestionItem.vue';

// import { useApi } from '@/composables/useApi'
// const { isFetching, error, data } = useApi('/data.json').json()
// const { Place } = await google.maps.importLibrary("places");


/**
 * TODO: distance googlemaps,
 * .factor
 * balkendiagramm
 */

// const autocompleteEl = ref(null);

// const request = {
//   textQuery: 'Tacos in Mountain View',
//   fields: ['displayName', 'location', 'businessStatus'],
//   includedType: 'restaurant',
//   locationBias: { lat: 37.4161493, lng: -122.0812166 },
//   isOpenNow: true,
//   language: 'en-US',
//   maxResultCount: 8,
//   minRating: 3.2,
//   region: 'us',
//   useStrictTypeFiltering: false,
// };

// const { places } = await Place.searchByText(request);

// console.log(places);

// onMounted(() => {
//   const autocomplete = new google.maps.places.Autocomplete(
//     autocompleteEl.value,
//     {
//       types: ['(cities)'],
//     }
//   );
//   autocomplete.addListener('place_changed', () => {
//     const place = autocomplete.getPlace();
//     console.log(place);
//   });
// });
</script>



<template>
  <div>
    <header>
      <!-- <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125"
        height="125" /> -->

    </header>

    <main>
      <div class="container">
        <h1 class="text-xl">Headline</h1>
        <input ref="autocompleteEl" type="text" placeholder="Enter a place or city" />
      </div>
    </main>

  </div>
</template>


<style scoped></style>
