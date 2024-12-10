<template>
    <div>
        <h3 class="text-2xl font-bold text-green">
            <span class="font-bold text-4xl">2.</span>
            Wie sind Sie angereist?
        </h3>
        <p class="text-lg text-gray mt-10 drop-shadow-md">Verschiedene
            Transportmittel und Kraftstoffe verursachen unterschiedlich hohe
            Klimaemissionen. Damit einhergehend entstehen Klimafolgekosten. Die
            unten dargestellten Werte berücksichtigen die Entfernung Ihrer An-
            und Abreise. Wählen Sie hier Ihr Fortbewegungsmittel aus.
        </p>

        <div class="mt-10">
            <div class="flex items-baseline gap-2 flex-wrap">
                <span class="text-lg">Sie sind</span>

                <span ref="distanceKmEl"
                    class="text-6xl text-gray font-bold whitespace-nowrap">
                    {{ formatDistance(animatedDistanceKm) }}<sup
                        class="text-lg align-[20px]">1</sup>

                </span>

                <SelectPersons v-model="personModel" />

                <span class="text-lg">gefahren.</span>
            </div>
            <span class="text-sm">(Hin- und Rückfahrt)</span>
        </div>

        <div class="text-black grid grid-cols-5 gap-2 py-8 relative">
            <label v-for="bar in bars" :key="bar.vehicle"
                class="flex flex-col items-center group">

                <input type="radio" name="vehicle" :value="bar.vehicle"
                    class="peer opacity-0 absolute bottom-0"
                    @change="onChange" />
                <!-- BAR -->
                <div
                    class="w-full max-w-[120px] h-[200px] flex flex-col justify-end items-center select-none cursor-pointer">
                    <span v-show="bar.formattedTotalEmissions"
                        class="origin-bottom transition-all"
                        :class="['group-hover:text-green', 'group-hover:scale-150', { 'text-green scale-150': vehicleModel === bar.vehicle }]">
                        {{ bar.formattedTotalEmissions }}<sup
                            class="text-[8px] align-[1px]">2</sup>
                    </span>
                    <div class="bar w-full flex items-center justify-center relative mt-2 transition-all duration-1000 rounded-t-md"
                        :class="{ 'bar--shadow': vehicleModel === bar.vehicle }"
                        :style="{ height: (bar.barHeightPercentage || 0.05) * 100 + '%' }">
                        <span
                            class="text-white/20 font-bold text-3xl absolute bottom-3 sm:text-4xl pointer-events-none">
                            COe<sub class="font-bold">2</sub>
                        </span>
                    </div>
                </div>

                <div
                    class="mt-3 group-hover:text-green transition-colors peer-checked:text-green min-h-[45px]">
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

            <p class="col-span-full text-sm text-light-gray flex gap-0.5">
                <span>1)</span>
                <span>Die Entfernungen wurden auf Basis von Google Maps
                    berechnet. </span>
            </p>
            <p class="col-span-full text-sm text-light-gray flex gap-0.5">
                <span>
                    2)
                </span>
                <span>
                    Die oben dargestellten Berechnungen beruhen auf
                    Informationen
                    des Umweltbundesamtes. Die Emissionsfaktoren für die
                    dargestellten Verkehrsmittel stammen aus dem Transport
                    Emission
                    Model (<a
                        href="https://www.umweltbundesamt.de/themen/verkehr/emissionsdaten#verkehrsmittelvergleich_personenverkehr_tabelle"
                        class="text-green underline hover:text-dark-green px-0"
                        target="_blank">TREMOD</a>).
                    Der errechnete Betrag in Euro stellt
                    die
                    damit einhergehenden Umweltfolgekosten dar und stammt aus
                    der
                    <a href="https://www.umweltbundesamt.de/publikationen/methodenkonvention-umweltkosten"
                        target="_blank"
                        class="text-green underline hover:text-dark-green px-0">Methodenkonvention
                        3.1 zur Ermittlung
                        von Umweltkosten.</a>
                    Die Werte für Elektrofahrzeuge beruhen auf Werten zur
                    Nutzung
                    des durchschnittlichen Strom-Mixes in Deutschland.
                </span>
            </p>
        </div>
    </div>
</template>

<script setup>
import { watch, ref, toRefs, computed, nextTick } from 'vue';
import { useTransition } from '@vueuse/core';
import SelectPersons from '@/components/SelectPersons.vue';

const props = defineProps({
    distanceKm: {
        required: true,
        type: Number
    },
})

const { distanceKm } = toRefs(props);

const personModel = ref(1);

const vehicles = {
    electricCar: 'ELECTRIC_CAR',
    hybridCar: 'HYBRID_CAR',
    gasCar: 'GAS_CAR',
    train: 'TRAIN',
    bus: 'BUS',
}

const vehicleModel = defineModel();

const compensationPrice = defineModel('compensation')

/**
 * Emission factors in CO2 tons per km,
 * diesel having the biggest factor
 */
const emissionFactors = {
    [vehicles.gasCar]: 0.0002373,
    [vehicles.hybridCar]: 0.0001694,
    [vehicles.electricCar]: 0.0001106,
    [vehicles.train]: 0.000031,
    [vehicles.bus]: 0.000058,
}

const labels = {
    [vehicles.gasCar]: 'Benzin/Diesel',
    [vehicles.electricCar]: 'Elektro-Pkw',
    [vehicles.hybridCar]: 'Hybrid',
    [vehicles.train]: 'Zug',
    [vehicles.bus]: 'Bus',
}

const costPerCO2Ton = 237;

const highestEmissionVehicle = computed(() => {
    return Object.values(vehicles).reduce((a, b) => {
        const personFactorA = a === vehicles.bus || a === vehicles.train ? personModel.value : 1;
        const personFactorB = b === vehicles.bus || b === vehicles.train ? personModel.value : 1;
        return emissionFactors[a] * personFactorA > emissionFactors[b] * personFactorB ? a : b
    });
})

const highestEmissionFactor = computed(() => {
    const personFactor = highestEmissionVehicle.value === vehicles.bus || highestEmissionVehicle.value === vehicles.train ? personModel.value : 1;
    return emissionFactors[highestEmissionVehicle.value] * personFactor;
})


const bars = computed(() => {
    return Object.values(vehicles).map(vehicle => {
        const personFactor = vehicle === vehicles.bus || vehicle === vehicles.train ? personModel.value : 1;

        return {
            label: labels[vehicle],
            vehicle,
            formattedTotalEmissions: distanceKm.value && formatWeight(emissionFactors[vehicle] * distanceKm.value * personFactor),
            compensationCost: distanceKm.value && formatCurrency(emissionFactors[vehicle] * costPerCO2Ton * distanceKm.value * personFactor),
            barHeightPercentage: distanceKm.value ? (emissionFactors[vehicle] * personFactor / highestEmissionFactor.value) : 0,
        }
    })
})

async function onChange(e) {
    vehicleModel.value = e.target.value;

    await nextTick();

    console.log(vehicleModel)
    console.log(vehicleModel.value)
    console.log(e.target.value)



    const price = emissionFactors[vehicleModel.value] * costPerCO2Ton * distanceKm.value;
    compensationPrice.value = Math.round(price * 100) / 100; //toFixed(2) with rounding
}

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

.bar--shadow {
    box-shadow: 0 0 10px rgba(103, 181, 86, 0.62);
}
</style>
