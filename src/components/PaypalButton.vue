<template>
  <!-- <button ref="paypalBtnEl" class="paypal-btn flex items-center gap-4 "
    aria-label="Spenden button">
    <img src="../assets/paypal-logo-w.svg" alt="paypal-logo im spenden button"
      class="block size-14">
    <span class="text-2xl font-bold">Jetz Spenden</span>

  </button> -->

  <form id="paypal-donate-form" class="w-full block"
    action="https://www.paypal.com/donate" method="post" target="_blank">
    <input type="hidden" name="business" value="g.lorenzon@gmx.de">
    <input type="hidden" name="item_name" value="Spenden">
    <input type="hidden" name="currency_code" value="EUR">
    <input type="hidden" id="paypal-amount" name="amount" :value="12">
    <!-- Default amount -->

    <button type="submit"
      class="paypal-btn flex items-center justify-center gap-4 w-full">
      <img src="../assets/paypal-logo-w.svg" alt="paypal-logo im spenden button"
        class="block size-14">
      <span class="text-2xl font-bold">Jetz Spenden</span>
    </button>

  </form>
</template>

<script setup>
import { loadPayPalSdk } from '@/utils/loadPayPalSdk';
import { onMounted, ref } from 'vue';

const props = defineProps({
  clientId: {
    type: String,
    required: true,
  },
  amount: {
    type: String,
    required: true,
  },
})

const paypalBtnEl = ref(null);

async function initPayPalButton() {
  try {
    const paypal = await loadPayPalSdk(props.clientId);

    paypal.Buttons({
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
    }).render(paypalBtnEl.value);
  } catch (error) {
    console.error('PayPal SDK Load Error:', error);
  }
}

onMounted(() => {
  // initPayPalButton();
})
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
