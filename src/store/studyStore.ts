import { ref } from 'vue'

interface Study {
  book: string;
  chapter: string;
  verse: string;
  content: string;
}

const currentStudy = ref<Study | null>(null)

export const useStudyStore = () => {
  const setStudy = (study: Study) => {
    currentStudy.value = study
  }

  const clearStudy = () => {
    currentStudy.value = null
  }

  return {
    currentStudy,
    setStudy,
    clearStudy
  }
}
