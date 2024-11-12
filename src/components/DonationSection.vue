<template>
  <div>
    <h3 class="text-2xl font-bold text-green">
      <span class="font-bold text-4xl">3.</span>
      Ihr Beitrag für den Klimafonds
    </h3>
    <p class="text-lg text-gray mt-10 drop-shadow-md">Möchtest du deine
      Wir freuen uns über Ihre Spende an den Klimafonds Lüneburger Heide. Wir
      empfehlen eine Spende in Höhe der berechneten Umweltfolgekosten
      (voreingestellt). Gerne können Sie aber auch einen individuellen Betrag
      spenden. Vielen Dank für Ihr Engagement und besuchen Sie uns gerne wieder!
    </p>

    <div class="grid grid-cols-3 gap-6 mt-10">
      <PaypalButton clientId="YOUR_CLIENT_ID" :amount="5" />
      <PaypalButton clientId="YOUR_CLIENT_ID" :amount="compensation" />
      <PaypalButton clientId="YOUR_CLIENT_ID" :amount="compensation + 10" />
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
