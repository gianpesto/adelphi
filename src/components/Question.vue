<template>
  <div>
    <h2>{{ question }}</h2>
    {{ type }}
    <div v-if="type === 'radio'">
      <RadioGroupRoot v-model="selectedOption">
        <RadioGroupItem v-for="option in options" :key="option"
          :value="option.value">
          {{ option.label }}
          <RadioGroupIndicator
            class="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-[11px] after:h-[11px] after:rounded-[50%] after:bg-grass11" />
        </RadioGroupItem>
      </RadioGroupRoot>
    </div>
    <div v-else-if="type === 'checkbox'">
      <label
        class="flex flex-row gap-4 items-center [&>.checkbox]:hover:bg-neutral-100">
        <CheckboxRoot v-model:checked="checkboxOne"
          class="shadow-blackA7 hover:bg-green3 flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-[4px] bg-white shadow-[0_2px_10px] outline-none focus-within:shadow-[0_0_0_2px_black]">
          <CheckboxIndicator
            class="bg-white h-full w-full rounded flex items-center justify-center">
            <Icon icon="radix-icons:check" class="h-3.5 w-3.5 text-grass11" />
          </CheckboxIndicator>
        </CheckboxRoot>
        <span class="select-none text-white">Accept terms and conditions.</span>
      </label>
    </div>
    <div v-else-if="type === 'select'">
      <SelectRoot v-model="fruit">
        <SelectTrigger
          class="inline-flex min-w-[160px] items-center justify-between rounded px-[15px] text-[13px] leading-none h-[35px] gap-[5px] bg-white text-grass11 shadow-[0_2px_10px] shadow-black/10 hover:bg-mauve3 focus:shadow-[0_0_0_2px] focus:shadow-black data-[placeholder]:text-green9 outline-none"
          aria-label="Customise options">
          <SelectValue placeholder="Select a fruit..." />
          <Icon icon="radix-icons:chevron-down" class="h-3.5 w-3.5" />
        </SelectTrigger>

        <SelectPortal>
          <SelectContent
            class="min-w-[160px] bg-white rounded shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade z-[100]"
            :side-offset="5">
            <SelectScrollUpButton
              class="flex items-center justify-center h-[25px] bg-white text-violet11 cursor-default">
              <Icon icon="radix-icons:chevron-up" />
            </SelectScrollUpButton>

            <SelectViewport class="p-[5px]">
              <SelectLabel
                class="px-[25px] text-xs leading-[25px] text-mauve11">
                Fruits
              </SelectLabel>
              <SelectGroup>
                <SelectItem v-for="(option, index) in options" :key="index"
                  class="text-[13px] leading-none text-grass11 rounded-[3px] flex items-center h-[25px] pr-[35px] pl-[25px] relative select-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1"
                  :value="option">
                  <SelectItemIndicator
                    class="absolute left-0 w-[25px] inline-flex items-center justify-center">
                    <Icon icon="radix-icons:check" />
                  </SelectItemIndicator>
                  <SelectItemText>
                    {{ option }}
                  </SelectItemText>
                </SelectItem>
              </SelectGroup>
              <SelectSeparator class="h-[1px] bg-green6 m-[5px]" />
              <SelectLabel
                class="px-[25px] text-xs leading-[25px] text-mauve11">
                Vegetables
              </SelectLabel>
              <SelectGroup>
                <SelectItem v-for="(option, index) in vegetables" :key="index"
                  class="text-[13px] leading-none text-grass11 rounded-[3px] flex items-center h-[25px] pr-[35px] pl-[25px] relative select-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1"
                  :value="option" :disabled="option === 'Courgette'">
                  <SelectItemIndicator
                    class="absolute left-0 w-[25px] inline-flex items-center justify-center">
                    <Icon icon="radix-icons:check" />
                  </SelectItemIndicator>
                  <SelectItemText>
                    {{ option }}
                  </SelectItemText>
                </SelectItem>
              </SelectGroup>
            </SelectViewport>

            <SelectScrollDownButton
              class="flex items-center justify-center h-[25px] bg-white text-violet11 cursor-default">
              <Icon icon="radix-icons:chevron-down" />
            </SelectScrollDownButton>
          </SelectContent>
        </SelectPortal>
      </SelectRoot>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { RadioGroupIndicator, RadioGroupItem, RadioGroupRoot } from 'radix-vue'
import { CheckboxIndicator, CheckboxRoot } from 'radix-vue'
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectLabel,
  SelectPortal,
  SelectRoot,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from 'radix-vue'

const props = defineProps({
  question: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    validator: value => ['radio', 'checkbox', 'select'].includes(value)
  },
  options: {
    type: Array,
    required: true
  }
});

const selectedOption = ref(null);
const selectedOptions = ref([]);
</script>

<style scoped>
/* Add your styles here */
</style>
