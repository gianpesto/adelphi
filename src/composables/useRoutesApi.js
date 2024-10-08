import { createFetch } from '@vueuse/core'

export const useRoutesApi = createFetch({
  baseUrl: 'https://routes.googleapis.com/directions',
  fetchOptions: {
    mode: 'cors',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'X-Goog-Api-Key': import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY,
      'X-Goog-FieldMask': 'routes.distanceMeters'
    }
  }
})
