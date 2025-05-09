<template>
  <div class="grow flex flex-col">
    <header class="container">
      <div class="default-grid">
        <div
          :class="['col-span-full', 'sm:col-span-6', 'sm:col-start-4', 'md:col-start-4', 'md:col-span-6', 'xl:col-span-4', 'xl:col-start-5']">
          <a href="https://naturpark-lueneburger-heide.de" class="w-full block">
            <img alt="Klimafonds+ Logo" class="logo w-full mt-10"
              src="./assets/logo.svg" />
          </a>
        </div>
      </div>
    </header>


    <main class="grow container">

      <div class="default-grid bg-white/50 py-8">
        <div
          class="col-span-full md:col-start-3 md:col-span-8 lg:col-start-4 lg:col-span-6">
          <h1
            class="text-5xl sm:text-7xl headline text-center text-green font-bold pb-2">
            Der Klimarechner des Naturparks Lüneburger Heide</h1>

          <PaypalButton label="Ohne Berechnung spenden!" class="mt-6" />

          <p class="text-lg text-gray mt-10 ">
            Unterwegs im Naturpark Lüneburger Heide? Mit unserem
            Klimarechner können Sie die Klimaemissionen berechnen, die bei Ihrer
            An- und Abreise in den Naturpark entstehen. Anschließend laden wir
            Sie herzlich ein, eine Spende an den HeideFonds<sup>+</sup> zu
            leisten, um damit Emissionseinsparungen durch klimafreundliche
            Projekte in der Region zu ermöglichen. </p>

          <p class="text-lg text-gray mt-10 ">
            Sie wollen mehr über den HeideFonds<sup>+</sup> und unsere aktuellen
            Projekte erfahren? <a href="http://www.heidefondsplus.de/" target="_blank" class="text-green underline hover:text-dark-green px-0">Dann klicken Sie hier.</a>
          </p>

          <p class="text-lg text-gray mt-10 ">
            Vielen Dank für Ihr Engagement!
          </p>

          <hr class="mt-14 text-light-gray/30" />

          <h3 class="mt-14 text-2xl font-bold text-green" ref="headline1El">
            <span class="font-bold text-4xl">1.</span>
            Wo startete Ihre Reise in den Naturpark?
          </h3>

          <InputSection v-model:vehicle="vehicleModel"
            v-model:distance="distanceKm" @focus-input="onFocus" />

          <hr class="mt-14 text-light-gray/30" />

          <section class="mt-14 bg-white/50 p-4"
            :class="{ 'pointer-events-none opacity-10': !distanceKm }">

            <!-- CHART -->
            <BarChart :distance-km="distanceKm" ref="barChartEl"
              v-model="vehicleModel" v-model:compensation="compensationPrice" />
          </section>

          <hr class="mt-14 text-light-gray/30" />

          <section class="mt-14 bg-white/50 p-4">
            <DonationSection ref="donationEl"
              :class="{ 'pointer-events-none opacity-10': !vehicleModel }"
              :compensation="compensationPrice" />
          </section>

          <hr class="mt-14 text-light-gray/30" />

        </div>
      </div>
    </main>

    <footer class="container">
      <div class="default-grid bg-white/50 py-8">
        <div
          class="col-span-full md:col-start-3 md:col-span-8 lg:col-start-4 lg:col-span-6 flex gap-2">
          <a href="https://naturpark-lueneburger-heide.de/impressum"
            class="hover:text-green" target="_blank">Impressum</a>
          <button @click="$CC.showPreferences()" class="hover:text-green">
            Cookie-Einstellungen</button>
        </div>
      </div>
    </footer>

    <!-- COOKIE CONSENT -->
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import BarChart from '@/components/BarChart.vue';
import DonationSection from '@/components/DonationSection.vue';
import InputSection from '@/components/InputSection.vue';
import PaypalButton from '@/components/PaypalButton.vue';
import { watchOnce } from '@vueuse/core';

const vehicleModel = ref();
const distanceKm = ref(0);
const compensationPrice = ref(undefined);

const barChartEl = ref(null);
const donationEl = ref(null);

watch(distanceKm, () => {
  // scroll to distance
  barChartEl.value.$el?.scrollIntoView({ behavior: 'smooth' })
})

watchOnce(vehicleModel, () => {
  // scroll to donation
  donationEl.value.$el?.scrollIntoView({ behavior: 'smooth' })
})

/**
 * FOCUS
 */
let focussedOnce = false;
const headline1El = ref(null);
function onFocus() {
  if (focussedOnce) {
    return
  }
  focussedOnce = true;
  headline1El.value.scrollIntoView({ behavior: 'smooth' })
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
