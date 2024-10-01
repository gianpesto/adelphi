<script setup>
import Question from './components/Question.vue';
import { useFetch } from '@vueuse/core'
const { isFetching, error, data } = useFetch('/data.json').json()



</script>



<template>
  <div>
    <header>
      <!-- <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125"
        height="125" /> -->
    </header>

    <main v-if="!isFetching">
      <Question v-for="question in data?.questions"
        :key="JSON.stringify(question)" v-bind="question" />
    </main>
  </div>
</template>


<style scoped></style>
