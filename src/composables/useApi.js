import { createFetch } from '@vueuse/core'

export const useApi = createFetch({
  baseUrl: import.meta.env.BASE_URL,
  options: {
    // async beforeFetch({ options }) {
    //   const myToken = await getMyToken()
    //   options.headers.Authorization = `Bearer ${myToken}`
    //   return { options }
    // },
  },
  fetchOptions: {
    mode: 'cors'
  }
})
