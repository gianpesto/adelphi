<template>
  <div>
    <h3 class="text-2xl font-bold text-green">
      <span class="font-bold text-4xl">3.</span>
      Make your donation!
    </h3>

    <PaypalButton clientId="YOUR_CLIENT_ID" amount="5" class="mt-5" />
  </div>
</template>

<script setup>
import PaypalButton from '@/components/PaypalButton.vue';


</script>

<style scoped></style>
