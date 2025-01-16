import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const email = ref(localStorage.getItem('userEmail') || '')

  const setEmail = (newEmail: string) => {
    email.value = newEmail
    localStorage.setItem('userEmail', newEmail)
  }

  const isAuthenticated = () => {
    return !!email.value
  }

  return {
    email,
    setEmail,
    isAuthenticated
  }
})
