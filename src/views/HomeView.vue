<template>
  <v-container class="fill-height">
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card class="pa-6" elevation="2">
          <h1 class="text-h4 mb-6 text-center">Criar novo estudo</h1>
          
          <v-select
            v-model="selectedBook"
            :items="books"
            label="Livro"
            variant="outlined"
            class="mb-4"
            color="primary"
            @update:model-value="handleBookChange"
          ></v-select>

          <v-select
            v-model="selectedChapter"
            :items="chapters"
            label="Capítulo"
            variant="outlined"
            class="mb-4"
            color="primary"
            :disabled="!selectedBook"
            :loading="loading"
            @update:model-value="handleChapterChange"
          ></v-select>

          <v-select
            v-model="selectedVerse"
            :items="verses"
            label="Versículo"
            variant="outlined"
            class="mb-6"
            color="primary"
            :disabled="!selectedChapter || loading"
          ></v-select>

          <div v-if="error" class="text-error mb-4">{{ error }}</div>

          <v-btn
            block
            color="primary"
            size="large"
            :loading="generatingStudy"
            :disabled="!selectedVerse || loading || generatingStudy"
            class="text-white"
            @click="handleGenerateStudy"
          >
            Gerar Estudo
          </v-btn>
          
          <p class="text-caption text-center mt-2" v-if="generatingStudy">
            Aguarde, o seu estudo está sendo gerado. Este processo toma aproximadamente 20 segundos
          </p>
          
          <v-card-text v-if="study" class="mt-4">
            <div class="text-h6 mb-2">Estudo Gerado:</div>
            <div class="text-body-1" style="white-space: pre-line">{{ study }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStudyStore } from '../store/studyStore'
import bookData from '../data/book-of-mormon.json'
import { getChapterVerses } from '../services/scriptureService'
import { generateStudy } from '../services/maritacaService'

const router = useRouter()
const { setStudy } = useStudyStore()

const selectedBook = ref('')
const selectedChapter = ref('')
const selectedVerse = ref('')
const loading = ref(false)
const error = ref('')
const verses = ref<Number[]>([])
const study = ref('')
const generatingStudy = ref(false)
const texts = ref<{text: string}[]>([])

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
      texts.value[Number(selectedVerse.value) - 1].text
    );
    
    const book = bookData.books.find(b => b.value === selectedBook.value)
    
    setStudy({
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
</style>
