<template>
    <div class="text-black flex justify-between grid grid-cols-4 gap-8 py-8">
        <div v-for="bar in bars" :key="bar.vehicle" class="flex flex-col items-center">

            <!-- BAR -->
            <div class="w-full max-w-[120px] h-[200px] flex items-end">
                <div class="bg-blue-50 w-full flex items-center justify-center "
                    :style="{ height: bar.barHeightPercentage * 100 + '%' }">
                    <span>{{ bar.formattedTotalEmissions }}&nbsp;CO<sub>2</sub></span>
                </div>
            </div>

            <div class="mt-3">{{ bar.label }}</div>
            <div>{{ bar.compensationCost }}</div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    distanceMeters: {
        required: true,
        type: Number
    },
})

const distanceKm = props.distanceMeters / 1000;

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
        formattedTotalEmissions: formatWeight(emissionFactors[vehicle] * distanceKm),
        compensationCost: formatCurrency(emissionFactors[vehicle] * costPerCO2Ton * distanceKm),
        barHeightPercentage: (emissionFactors[vehicle] / emissionFactors[vehicles.dieselCar]),
    }
})

console.log(distanceKm)

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

</script>

<style lang="scss" scoped></style>