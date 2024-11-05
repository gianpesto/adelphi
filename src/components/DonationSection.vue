<template>
  <div>
    <h3 class="text-2xl font-bold text-green">
      <span class="font-bold text-4xl">3.</span>
      Dein Beitrag für die Umwelt
    </h3>
    <p class="text-lg text-gray mt-10 drop-shadow-md">Möchtest du deine
      Emissionen ausgleichen? Mit einer kleinen Spende kannst du
      Klimaschutzprojekte unterstützen und deinen ökologischen Fußabdruck
      reduzieren. Dein Beitrag hilft, Umweltprojekte zu fördern, die CO₂ binden
      und den Planeten schützen.
    </p>

    <PaypalButton clientId="YOUR_CLIENT_ID" amount="5" class="mt-5" />
  </div>
</template>

<script setup>
import PaypalButton from '@/components/PaypalButton.vue';


</script>

<style scoped></style>
