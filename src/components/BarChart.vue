<template>
    <div>
        <h3 class="text-2xl font-bold text-green">
            <span class="font-bold text-4xl">2.</span>
            What vehicle did you use?
        </h3>

        <div class="text-right">
            <span class="text-lg block">you traveled</span>

            <span ref="distanceKmEl"
                class="text-6xl text-gray block font-bold whitespace-nowrap">
                {{ formatDistance(animatedDistanceKm) }}
            </span>

            <span class="text-lg block">round trip</span>
        </div>

        <div class="text-black grid grid-cols-4 gap-2 py-8">
            <label v-for="bar in bars" :key="bar.vehicle"
                class="flex flex-col items-center group">

                <input type="radio" name="vehicle" :value="bar.vehicle"
                    class="peer opacity-0" v-model="vehicleModel" />
                <!-- BAR -->
                <div
                    class="w-full max-w-[120px] h-[200px] flex flex-col justify-end items-center select-none cursor-pointer">
                    <span v-show="bar.formattedTotalEmissions"
                        class="origin-bottom transition-all"
                        :class="['group-hover:text-green', 'group-hover:scale-150', { 'text-green scale-150': vehicleModel === bar.vehicle }]">
                        {{ bar.formattedTotalEmissions }}
                    </span>
                    <div class="bar w-full flex items-center justify-center relative mt-2 transition-all duration-1000 rounded-t-md"
                        :style="{ height: (bar.barHeightPercentage || 0.05) * 100 + '%' }">
                        <span
                            class="text-white/20 font-bold text-3xl absolute bottom-3 sm:text-5xl">
                            CO<sub class="font-bold">2</sub>
                        </span>
                    </div>
                </div>

                <div
                    class="mt-3 group-hover:text-green transition-colors peer-checked:text-green">
                    {{ bar.label }}
                </div>
                <div
                    class="group-hover:text-green transition-colors peer-checked:text-green">
                    {{ bar.compensationCost }}
                </div>

                <!-- INPUT INDEX -->
                <div
                    class="size-8 border border-gray rounded-full mt-4 flex items-center justify-center peer-hover:border-green cursor-pointer">
                    <div class="size-5 rounded-full bg-green"
                        v-show="vehicleModel === bar.vehicle"></div>
                </div>
            </label>

            <hr class="mt-14 text-light-gray/10 col-span-full" />
            <p class="col-span-full text-sm text-light-gray">
                * The compensation cost is calculated based on the CO2 emissions
                of the respective vehicle type. The compensation cost is based
                on
                the current price of 237€ per ton of CO2.
            </p>
        </div>
    </div>
</template>

<script setup>
import { defineProps, toRefs, computed } from 'vue';
import { useTransition } from '@vueuse/core';

const props = defineProps({
    distanceKm: {
        required: true,
        type: Number
    },
})

const { distanceKm } = toRefs(props);

const vehicles = {
    electricCar: 'ELECTRIC_CAR',
    hybridCar: 'HYBRID_CAR',
    gasCar: 'GAS_CAR',
    bus: 'BUS',
}

const vehicleModel = defineModel();

/**
 * Emission factors in CO2 tons per km,
 * diesel having the biggest factor
 */
const emissionFactors = {
    [vehicles.gasCar]: 0.000169,
    [vehicles.hybridCar]: 0.000121,
    [vehicles.electricCar]: 0.000079,
    [vehicles.bus]: 0.000068,
}

const labels = {
    [vehicles.gasCar]: 'Benzin/Diesel',
    [vehicles.electricCar]: 'Elektro',
    [vehicles.hybridCar]: 'Hybrid',
    [vehicles.bus]: 'Bus',
}

const costPerCO2Ton = 237;

const bars = computed(() => {
    return Object.values(vehicles).map(vehicle => {
        return {
            label: labels[vehicle],
            vehicle,
            formattedTotalEmissions: distanceKm.value && formatWeight(emissionFactors[vehicle] * distanceKm.value),
            compensationCost: distanceKm.value && formatCurrency(emissionFactors[vehicle] * costPerCO2Ton * distanceKm.value),
            barHeightPercentage: distanceKm.value ? (emissionFactors[vehicle] / emissionFactors[vehicles.gasCar]) : 0,
        }
    })
})

function formatCurrency(value) {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(value);
}

function formatWeight(totalTons) {
    if (totalTons >= 0.001) {
        return new Intl.NumberFormat('de-DE', { style: 'unit', unit: 'kilogram', unitDisplay: 'narrow', maximumFractionDigits: 0 }).format(totalTons * 1000);
    } else {
        return new Intl.NumberFormat('de-DE', { style: 'unit', unit: 'gram', unitDisplay: 'narrow', maximumFractionDigits: 0 }).format(totalTons * 1e6);
    }

}

const animatedDistanceKm = useTransition(distanceKm, {
    duration: 1000
})


function formatDistance(value) {
    return new Intl.NumberFormat('de-DE', { style: 'unit', unit: 'kilometer', unitDisplay: 'narrow', maximumFractionDigits: 0, }).format(value);
}
</script>

<style scoped>
.bar {
    background: linear-gradient(rgb(199, 199, 199), rgb(146, 146, 146));
}
</style>
