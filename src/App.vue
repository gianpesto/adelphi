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

          <InputSection v-model:vehicle="vehicleModel"
            v-model:distance="distanceKm" @focus-input="onFocus" />

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
import { ref } from 'vue';
import BarChart from '@/components/BarChart.vue';
import DonationSection from '@/components/DonationSection.vue';
import InputSection from '@/components/InputSection.vue';

const vehicleModel = ref();
const distanceKm = ref(0);

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
