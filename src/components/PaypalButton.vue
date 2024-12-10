<template>

  <div v-if="amount">
    <form action="https://www.paypal.com/donate" method="post" target="_top">
      <!-- Identify your business so that you can collect the payments. -->
      <input type="hidden" name="business"
        value="info@naturpark-lueneburger-heide.de">
      <!-- Specify details about the contribution -->
      <input type="hidden" name="no_recurring" value="0">
      <input type="hidden" name="currency_code" value="EUR">
      <input v-if="amount" type="hidden" name="amount" :value="amount">
      <!-- Display the payment button. -->

      <button name="submit" alt="Donate"
        class="paypal-btn paypal-btn--green flex items-center gap-4 "
        aria-label="Spenden button">
        <img src="../assets/paypal-logo-w.svg"
          alt="paypal-logo im spenden button" class="block size-14">
        <span class="text-xl font-bold">
          {{ formatCurrency(amount) }}&nbsp;spenden
        </span>
      </button>


    </form>
  </div>
  <div v-else id="donate-btn"
    class="paypal-btn  paypal-btn--magenta flex items-center gap-4 w-fit relative">
    <img src="../assets/paypal-logo-w.svg" alt="paypal-logo im spenden button"
      class="block size-14">
    <span class="text-xl font-bold">{{ label }}</span>
  </div>
</template>

<script setup>
// import { loadPayPalSdk } from '@/utils/loadPayPalSdk';
import { onMounted } from 'vue';

// const paypalClientId = import.meta.env.VITE_APP_PAYPAL_CLIENT_ID;

const props = defineProps({
  amount: {
    type: Number,
    default: 0
  },
  label: {
    type: String,
    default: "Beliebigen Betrag spenden"
  }
})


async function initPayPalButton() {
  try {

    window.PayPal.Donation.Button({
      env: 'production',
      hosted_button_id: 'A8WXEDZZHTC9Y',
      image: {
        src: 'https://www.paypalobjects.com/de_DE/DE/i/btn/btn_donate_LG.gif',
        alt: 'Spenden mit dem PayPal-Button',
        title: 'PayPal - The safer, easier way to pay online!',
      }
    }).render('#donate-btn');

  } catch (error) {
    console.error('PayPal SDK Load Error:', error);
  }
}

onMounted(() => {
  if (!props.amount) {
    initPayPalButton();
  }
})

function formatCurrency(value) {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(value);
}
</script>

<style scoped>
.paypal-btn {
  padding: 10px 20px;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 700;
  transition: 0.5s;
  background-size: 200% auto;
}

.paypal-btn--green {
  background-image: linear-gradient(to right, rgb(41, 153, 38) 0%, rgb(109, 186, 42) 51%, rgb(41, 153, 38) 100%);
}

.paypal-btn--magenta {
  background-image: linear-gradient(to right, rgb(255, 0, 103) 0%, rgb(246, 90, 152) 51%, rgb(255, 0, 103) 100%);
}

.paypal-btn:hover {
  background-position: right center;
}

:deep(#donate-button) {
  inset: 0;
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
}
</style>
