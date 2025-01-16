<template>
  <v-container class="fill-height">
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card class="pa-8" elevation="2">
          <div class="d-flex flex-column align-center">
            <h1 class="text-h4 text-sm-h4">Gerar Estudo</h1>
          </div>
          <div v-if="savedStudiesStore.hasStudies" class="d-flex mb-8 mt-4">
            <v-btn
              color="primary"
              variant="outlined"
              prepend-icon="mdi-bookmark"
              class="w-100"
              @click="router.push('/saved-studies')"
            >
              Meus Estudos
            </v-btn>
          </div>
          
          <div class="text-body-1 mb-6 mt-3">
            Selecione a escritura que você deseja estudar:
          </div>

          <div class="mb-8">
            <label class="text-subtitle-1 mb-2 d-block">1. Escolha o Livro:</label>
            <v-select
              v-model="selectedBook"
              :items="books"
              variant="outlined"
              class="mb-4"
              color="primary"
              :class="{'large-select': true}"
              @update:model-value="handleBookChange"
              hide-details
            ></v-select>
          </div>

          <div class="mb-8">
            <label class="text-subtitle-1 mb-2 d-block">2. Escolha o Capítulo:</label>
            <v-select
              v-model="selectedChapter"
              :items="chapters"
              variant="outlined"
              class="mb-4"
              color="primary"
              :disabled="!selectedBook"
              :loading="loading"
              :class="{'large-select': true}"
              @update:model-value="handleChapterChange"
              hide-details
            ></v-select>
          </div>

          <div class="mb-8">
            <label class="text-subtitle-1 mb-2 d-block">3. Escolha o Versículo:</label>
            <v-select
              v-model="selectedVerse"
              :items="verses"
              variant="outlined"
              color="primary"
              :disabled="!selectedChapter || loading"
              :class="{'large-select': true}"
              hide-details
            ></v-select>
          </div>

          <v-divider class="mb-8"></v-divider>

          <div class="text-body-1 mb-6">
            Personalize seu estudo:
          </div>

          <div class="mb-8">
            <label class="text-subtitle-1 mb-2 d-block">4. Qual é o seu tempo disponível para estudar?</label>
            <v-select
              v-model="studyDepth"
              :items="studyDepthOptions"
              variant="outlined"
              color="primary"
              :class="{'large-select': true}"
              hide-details
            >
              <template v-slot:prepend>
                <v-icon color="primary" class="mr-2">mdi-clock-outline</v-icon>
              </template>
            </v-select>
          </div>

          <div class="mb-8">
            <label class="text-subtitle-1 mb-2 d-block">5. Que tipo de estudo você prefere?</label>
            <v-select
              v-model="studyStyle"
              :items="studyStyleOptions"
              variant="outlined"
              color="primary"
              :class="{'large-select': true}"
              hide-details
            >
              <template v-slot:prepend>
                <v-icon color="primary" class="mr-2">mdi-book-open-variant</v-icon>
              </template>
            </v-select>
          </div>

          <div v-if="error" class="text-error mb-4 text-body-1">{{ error }}</div>

          <v-btn
            block
            color="primary"
            :loading="generatingStudy"
            :disabled="!selectedVerse || loading || generatingStudy"
            prepend-icon="mdi-creation"
            @click="handleGenerateStudy"
          >
            GERAR MEU ESTUDO
          </v-btn>
          
          <v-btn
            block
            color="primary"
            class="mt-4"
            variant="outlined"
            @click="showDonationDialog = true"
            prepend-icon="mdi-hand-heart"
          >
            APOIAR O PROJETO
          </v-btn>
          
          <p class="text-body-1 text-center mt-4" v-if="generatingStudy">
            Aguarde, o seu estudo está sendo gerado. Este processo toma aproximadamente 20 segundos.
          </p>
          
          <v-card-text v-if="study" class="mt-6">
            <div class="text-h6 mb-4">Estudo Gerado:</div>
            <div class="text-body-1" style="white-space: pre-line">{{ study }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    
    <DonationDialog v-model:open="showDonationDialog" />
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStudyStore } from '../store/studyStore'
import { useSavedStudiesStore } from '../store/savedStudiesStore'
import bookData from '../data/book-of-mormon.json'
import { getChapterVerses } from '../services/scriptureService'
import { generateStudy, type StudyDepth, type StudyStyle } from '../services/maritacaService'
import DonationDialog from '../components/DonationDialog.vue'

const router = useRouter()
const studyStore = useStudyStore()
const savedStudiesStore = useSavedStudiesStore()

const selectedBook = ref('')
const selectedChapter = ref('')
const selectedVerse = ref('')
const loading = ref(false)
const error = ref('')
const verses = ref<Number[]>([])
const study = ref('')
const generatingStudy = ref(false)
const texts = ref<{text: string}[]>([])
const showDonationDialog = ref(false)

// New study options
const studyDepth = ref<StudyDepth>('intermediate')
const studyStyle = ref<StudyStyle>('spiritual')

const studyDepthOptions = [
  { title: 'Estudo rápido', value: 'basic' },
  { title: 'Estudo intermediário', value: 'intermediate' },
  { title: 'Estudo detalhado', value: 'advanced' }
]

const studyStyleOptions = [
  { 
    title: 'Contexto Histórico',
    value: 'historical',
    description: 'Entenda o contexto da época e os costumes'
  },
  { 
    title: 'Reflexão Espiritual',
    value: 'spiritual',
    description: 'Aplique os ensinamentos em sua vida'
  },
  { 
    title: 'Análise do Texto',
    value: 'literary',
    description: 'Explore o significado das palavras e símbolos'
  }
]

const books = bookData.books

const chapters = computed(() => {
  if (!selectedBook.value) return []
  const book = bookData.books.find(b => b.value === selectedBook.value)
  return book ? Array.from({ length: book.chapters }, (_, i) => (i + 1).toString()) : []
})

const resetChapter = () => {
  selectedChapter.value = ''
  selectedVerse.value = ''
  verses.value = []
}

const resetVerse = () => {
  selectedVerse.value = ''
}

const handleBookChange = () => {
  resetChapter()
}

const handleChapterChange = async () => {
  resetVerse()
  if (!selectedBook.value || !selectedChapter.value) return

  loading.value = true
  error.value = ''

  try {
    const response = await getChapterVerses(selectedBook.value, selectedChapter.value)
    verses.value = Array.from({ length: response.chapter.verses.length }, (_, i) => i + 1) 
    texts.value = response.chapter.verses
  } catch (err) {
    error.value = 'Erro ao carregar versículos. Por favor, tente novamente.';
    console.error('Error:', err)
  } finally {
    loading.value = false
  }
}

const handleGenerateStudy = async () => {
  if (!selectedBook.value || !selectedChapter.value || !selectedVerse.value) return;

  generatingStudy.value = true;
  error.value = '';

  try {
    const content = await generateStudy(
      selectedBook.value,
      selectedChapter.value,
      selectedVerse.value,
      texts.value[Number(selectedVerse.value) - 1].text,
      {
        depth: studyDepth.value,
        style: studyStyle.value
      }
    );
    
    const book = bookData.books.find(b => b.value === selectedBook.value)
    
    studyStore.setStudy({
      book: book?.title ?? '1 Néfi',
      chapter: selectedChapter.value,
      verse: selectedVerse.value.toString(),
      content
    });

    router.push('/study');
  } catch (err) {
    error.value = 'Erro ao gerar estudo. Por favor, tente novamente.';
    console.error('Error:', err);
  } finally {
    generatingStudy.value = false;
  }
};
</script>

<style scoped>
.v-card {
  background-color: #faf7f5;
}

.large-select :deep(.v-field__input) {
  font-size: 1.1rem !important;
  padding: 8px 16px !important;
}

.large-select :deep(.v-select__selection) {
  font-size: 1.1rem !important;
}

.v-btn {
  letter-spacing: 0.5px;
}

:deep(.v-field__input) {
  min-height: 52px !important;
}

.text-subtitle-1 {
  color: rgba(0, 0, 0, 0.87);
  font-weight: 500;
}

.w-100 {
  width: 100%;
}
</style>
