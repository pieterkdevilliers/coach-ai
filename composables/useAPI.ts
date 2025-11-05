// ~/composables/useApi.ts
import { useAuthStore } from '~/stores/auth'

export const useApi = () => {
  const authStore = useAuthStore()
  const router = useRouter()

  const request = <T>(
    url: string | (() => string),
    options: any = {}
  ) => {
    const resolvedUrl = typeof url === 'function' ? url() : url
    const data = ref<T | null>(null)
    const error = ref<any>(null)
    const pending = ref(false)

    const fetchData = async () => {
      pending.value = true
      try {
        data.value = await $fetch<T>(resolvedUrl, options)
      } catch (err: any) {
        if (err?.statusCode === 401) {
          console.warn('Session expired or invalid, logging out...')
          authStore.clearUniqueAccountId()
          authStore.clearAuthToken()
          router.push('/login')
        }
        error.value = err
      } finally {
        pending.value = false
      }
    }

    if (!options.lazy) {
      fetchData()
    }

    return { data, error, pending, refresh: fetchData }
  }

  return { request }
}
