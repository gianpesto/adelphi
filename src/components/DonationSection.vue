<template>
  <div>
    <h3 class="text-2xl font-bold text-green">
      <span class="font-bold text-4xl">3.</span>
      Ihr Beitrag für den HeideFonds<sup>+</sup>
    </h3>
    <p class="text-lg text-gray mt-10 drop-shadow-md">
      Wir freuen uns über Ihre Spende an den HeideFonds<sup>+</sup> Lüneburger
      Heide. Wir
      empfehlen eine Spende in Höhe der berechneten Umweltfolgekosten
      (voreingestellt). Gerne können Sie aber auch einen individuellen Betrag
      spenden. Vielen Dank für Ihr Engagement und besuchen Sie uns gerne wieder!
    </p>

    <div class="gap-6 mt-10 flex flex-wrap"
      v-if="typeof compensation !== 'undefined'">
      <PaypalButton :amount="compensation" />
      <PaypalButton />
      <!-- <PaypalButton clientId="YOUR_CLIENT_ID" :amount="compensation" />
      <PaypalButton clientId="YOUR_CLIENT_ID" :amount="compensation + 10" /> -->
    </div>
  </div>
</template>

<script setup>
import PaypalButton from '@/components/PaypalButton.vue';

defineProps({
  compensation: Number,
});

</script>

<style scoped></style>
