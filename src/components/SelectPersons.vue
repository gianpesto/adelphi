<template>
  <div class="relative hover:text-magenta">
    <div type="text" class="text-lg flex items-center cursor-pointer ">
      {{ selectedOption?.label }}

      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
        stroke-width="1.5" stroke="currentColor" class="size-5">
        <path stroke-linecap="round" stroke-linejoin="round"
          d="m19.5 8.25-7.5 7.5-7.5-7.5" />
      </svg>


    </div>
    <select name="persons" id="persons" v-model="model"
      class="absolute inset-0 opacity-0">
      <option v-for="option in options" :value="option.value"
        :key="option.value">{{ option.label }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { computed } from 'vue';
const model = defineModel({
  prop: 'model',
  type: Number,
  default: 1,
});

const options = [
  { value: 1, label: 'alleine' },
  { value: 2, label: 'mit 2 Personen' },
  { value: 3, label: 'mit 3 Personen' },
  { value: 4, label: 'mit 4 Personen' },
  { value: 5, label: 'mit 5 Personen' },
]

const selectedOption = computed(() => {
  return options.find(option => option.value === model.value)
})
</script>

<style lang="scss" scoped></style>
