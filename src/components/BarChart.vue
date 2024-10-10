<template>
    <div class="text-black flex justify-between grid grid-cols-4 gap-2 py-8">
        <div v-for="bar in bars" :key="bar.vehicle"
            class="flex flex-col items-center">

            <!-- BAR -->
            <div
                class="w-full max-w-[120px] h-[200px] flex flex-col justify-end items-center">
                <span>{{ bar.formattedTotalEmissions }}</span>
                <div class="bar w-full flex items-center justify-center relative mt-2"
                    :style="{ height: bar.barHeightPercentage * 100 + '%' }">
                    <span
                        class="text-white/20 font-bold text-3xl absolute bottom-3 sm:text-5xl">
                        CO<sub class="font-bold">2</sub>
                    </span>
                </div>
            </div>

            <div class="mt-3">{{ bar.label }}</div>
            <div>{{ bar.compensationCost }}</div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    distanceKm: {
        required: true,
        type: Number
    },
})


const vehicles = {
    electricCar: 'ELECTRIC_CAR',
    hybridCar: 'HYBRID_CAR',
    gasCar: 'GAS_CAR',
    dieselCar: 'DIESEL_CAR',
}


/**
 * Emission factors in CO2 tons per km,
 * diesel having the biggest factor
 */
const emissionFactors = {
    [vehicles.dieselCar]: 0.000173,
    [vehicles.gasCar]: 0.000165,
    [vehicles.hybridCar]: 0.000121,
    [vehicles.electricCar]: 0.000079,
}

const labels = {
    [vehicles.gasCar]: 'Benzin',
    [vehicles.electricCar]: 'Elektro',
    [vehicles.hybridCar]: 'Hybrid',
    [vehicles.dieselCar]: 'Diesel',
}

const costPerCO2Ton = 237;

const bars = Object.values(vehicles).map(vehicle => {
    return {
        label: labels[vehicle],
        vehicle,
        formattedTotalEmissions: formatWeight(emissionFactors[vehicle] * props.distanceKm),
        compensationCost: formatCurrency(emissionFactors[vehicle] * costPerCO2Ton * props.distanceKm),
        barHeightPercentage: (emissionFactors[vehicle] / emissionFactors[vehicles.dieselCar]),
    }
})

function formatCurrency(value) {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(value);
}

function formatWeight(totalTons) {
    if (totalTons >= 0.001) {
        return new Intl.NumberFormat('de-DE', { style: 'unit', unit: 'kilogram', unitDisplay: 'narrow', maximumFractionDigits: 2 }).format(totalTons * 1000);
    } else {
        return new Intl.NumberFormat('de-DE', { style: 'unit', unit: 'gram', unitDisplay: 'narrow', maximumFractionDigits: 0 }).format(totalTons * 1e6);
    }

}

// const distanceKmEl = ref(null);

// onMounted(() => {

//     console.log('bars', bars);
// })

</script>

<style scoped>
.bar {
    background: linear-gradient(rgb(199, 199, 199), rgb(146, 146, 146));
}
</style>
