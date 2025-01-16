import { defineStore } from 'pinia'
import { ref } from 'vue'
import { upsertUserAccess } from '../services/supabaseService'

export const useAuthStore = defineStore('auth', () => {
  const email = ref(localStorage.getItem('userEmail') || '')

  const setEmail = async (newEmail: string) => {
    email.value = newEmail
    localStorage.setItem('userEmail', newEmail)
    
    try {
      await upsertUserAccess(newEmail)
    } catch (error) {
      console.error('Failed to update user access:', error)
      // Continue even if Supabase update fails
    }
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
