<script setup>
import QuestionItem from './components/QuestionItem.vue';

import { useApi } from '@/composables/useApi'
const { isFetching, error, data } = useApi('/data.json').json()


</script>



<template>
  <div>
    <header>
      <!-- <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125"
        height="125" /> -->
    </header>

    <main v-if="!isFetching">
      <div class="container">
        <QuestionItem v-for="question in data?.questions"
          :key="JSON.stringify(question)" v-bind="question" />
      </div>
    </main>
  </div>
</template>


<style scoped></style>
