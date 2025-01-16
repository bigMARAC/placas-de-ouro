import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuthStore } from './authStore'

export interface SavedStudy {
  id: string
  email: string
  name: string
  book: string
  chapter: string
  verse: string
  content: string
  savedAt: string
}

export const useSavedStudiesStore = defineStore('savedStudies', () => {
  const studies = ref<SavedStudy[]>([])
  const authStore = useAuthStore()

  const loadStudies = () => {
    const savedStudies = localStorage.getItem('savedStudies')
    if (savedStudies) {
      studies.value = JSON.parse(savedStudies)
    }
  }

  const saveStudy = (study: Omit<SavedStudy, 'id' | 'email' | 'savedAt'>) => {
    const newStudy: SavedStudy = {
      ...study,
      id: crypto.randomUUID(),
      email: authStore.email,
      savedAt: new Date().toISOString()
    }

    studies.value.push(newStudy)
    localStorage.setItem('savedStudies', JSON.stringify(studies.value))
    return newStudy.id
  }

  const deleteStudy = (id: string) => {
    studies.value = studies.value.filter(study => study.id !== id)
    localStorage.setItem('savedStudies', JSON.stringify(studies.value))
  }

  const userStudies = computed(() => {
    return studies.value.filter(study => study.email === authStore.email)
  })

  const hasStudies = computed(() => userStudies.value.length > 0)

  const getStudyById = (id: string) => {
    return studies.value.find(study => study.id === id)
  }

  loadStudies()

  return {
    studies,
    userStudies,
    hasStudies,
    saveStudy,
    deleteStudy,
    getStudyById,
    email: computed(() => authStore.email)
  }
})
