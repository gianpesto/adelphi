<template>

  <div>
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
        class="paypal-btn flex items-center gap-4 " aria-label="Spenden button">
        <img src="../assets/paypal-logo-w.svg"
          alt="paypal-logo im spenden button" class="block size-14">
        <span class="text-xl font-bold">
          {{ formatCurrency(amount) }}&nbsp;spenden
        </span>
      </button>


    </form>
  </div>
</template>

<script setup>
// import { loadPayPalSdk } from '@/utils/loadPayPalSdk';
import { onMounted, ref } from 'vue';

// const paypalClientId = import.meta.env.VITE_APP_PAYPAL_CLIENT_ID;

defineProps({
  amount: {
    type: Number,
    default: 0
  },
})

const paypalBtnEl = ref(null);

async function initPayPalButton() {
  try {
    // const paypal = await loadPayPalSdk(paypalClientId);

    /* paypal.Buttons({
      createOrder: (data, actions) => {
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: props.amount,
            },
          }],
        });
      },
      onApprove: (data, actions) => {
        return actions.order.capture().then((details) => {
          alert(`Transaction completed by ${details.payer.name.given_name}`);
        });
      },
      onError: (err) => {
        console.error('PayPal Button Error:', err);
      }
    }).render(paypalBtnEl.value); */

    // window.PayPal.Donation.Button({
    //   env: 'sandbox',
    //   hosted_button_id: 'YCSC55P47F8A6',
    //   cmd: {
    //     amount: 5,
    //   },
    //   image: {
    //     src: 'https://www.paypalobjects.com/de_DE/DE/i/btn/btn_donate_LG.gif',
    //     alt: 'Spenden mit dem PayPal-Button',
    //     title: 'PayPal - The safer, easier way to pay online!',
    //   }
    // }).render('#donate-container');

  } catch (error) {
    console.error('PayPal SDK Load Error:', error);
  }
}

onMounted(() => {
  initPayPalButton();
})

function formatCurrency(value) {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(value);
}
</script>

<style scoped>
.paypal-btn {
  padding: 10px 20px;
  background-image: linear-gradient(to right, rgb(41, 153, 38) 0%, rgb(109, 186, 42) 51%, rgb(41, 153, 38) 100%);
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 700;
  transition: 0.5s;
  background-size: 200% auto;
}

.paypal-btn:hover {
  background-position: right center;
}
</style>
