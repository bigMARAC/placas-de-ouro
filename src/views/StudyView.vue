<template>
  <v-container class="fill-height">
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card class="pa-6" elevation="2" v-if="currentStudy">
          <h1 class="text-h4 mb-6 text-center">Estudo</h1>
          
          <div class="text-h6">
            {{ currentStudy.book }} {{ currentStudy.chapter }}:{{ currentStudy.verse }}
          </div>
          
          <p class="text-caption mb-4">
            Nota: o estudo é gerando baseando-se na versão em inglês do Livro de Mórmon.
          </p>

          <div class="markdown-content" v-html="parsedContent"></div>
          
          <v-divider class="my-9"></v-divider>
          
          <p class="text-body my-6">
            Este texto foi gerado por uma inteligência artificial e, portanto, não representa um estudo oficial. 
            Se você tiver dúvidas ou precisar de informações precisas, recomenda-se verificar diretamente na página oficial 
            da igreja, acessando www.churchofjesuschrist.org ou clicando <a href="https://www.churchofjesuschrist.org/?lang=por" target="_blank">aqui</a>
          </p>

          <div class="d-flex flex-column gap-4">
            <v-btn
              block
              color="primary"
              size="large"
              class="text-white"
              to="/"
            >
              Criar Novo Estudo
            </v-btn>

            <v-btn
              block
              color="success"
              size="large"
              class="text-white mt-2"
              @click="showDonationDialog = true"
              prepend-icon="mdi-hand-heart"
            >
              Apoiar com PIX
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <DonationDialog v-model:open="showDonationDialog" />
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStudyStore } from '../store/studyStore'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import DonationDialog from '../components/DonationDialog.vue'

const router = useRouter()
const { currentStudy } = useStudyStore()
const showDonationDialog = ref(false)

// Configure marked options
marked.setOptions({
  gfm: true,
  breaks: true
})

const parsedContent = computed(() => {
  if (!currentStudy.value?.content) return ''
  
  // Clean and normalize the markdown content
  let content = currentStudy.value.content
    .replace(/\r\n/g, '\n') // Normalize line endings
    .replace(/\n{3,}/g, '\n\n') // Remove excessive line breaks
    .trim()
  
  // Convert markdown to HTML and sanitize
  const rawHtml = marked.parse(content)
  return typeof rawHtml === 'string' ? DOMPurify.sanitize(rawHtml) : ''
})

onMounted(() => {
  if (!currentStudy.value) {
    router.push('/')
  }
})
</script>

<style scoped>
.v-card {
  background-color: #faf7f5;
}

.markdown-content {
  line-height: 1.6;
  color: rgba(0, 0, 0, 0.87);
}

.markdown-content :deep(h1),
.markdown-content :deep(h2),
.markdown-content :deep(h3),
.markdown-content :deep(h4),
.markdown-content :deep(h5),
.markdown-content :deep(h6) {
  margin-top: 1.5em;
  margin-bottom: 0.75em;
  font-weight: 600;
  line-height: 1.25;
}

.markdown-content :deep(p) {
  margin-bottom: 1em;
}

.markdown-content :deep(ul),
.markdown-content :deep(ol) {
  margin-bottom: 1em;
  padding-left: 2em;
}

.markdown-content :deep(li) {
  margin-bottom: 0.5em;
}

.markdown-content :deep(blockquote) {
  margin: 1em 0;
  padding-left: 1em;
  border-left: 4px solid rgba(0, 0, 0, 0.12);
  color: rgba(0, 0, 0, 0.6);
}

.markdown-content :deep(code) {
  padding: 0.2em 0.4em;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 3px;
  font-family: monospace;
}

.markdown-content :deep(pre) {
  margin: 1em 0;
  padding: 1em;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  overflow-x: auto;
}

.markdown-content :deep(hr) {
  margin: 2em 0;
  border: 0;
  border-top: 1px solid rgba(0, 0, 0, 0.12);
}

.markdown-content :deep(table) {
  width: 100%;
  margin: 1em 0;
  border-collapse: collapse;
}

.markdown-content :deep(th),
.markdown-content :deep(td) {
  padding: 0.5em;
  border: 1px solid rgba(0, 0, 0, 0.12);
}

.markdown-content :deep(th) {
  background-color: rgba(0, 0, 0, 0.05);
  font-weight: 600;
}

.markdown-content :deep(a) {
  color: #1976d2;
  text-decoration: none;
}

.markdown-content :deep(a:hover) {
  text-decoration: underline;
}

.markdown-content :deep(img) {
  max-width: 100%;
  height: auto;
  margin: 1em 0;
  border-radius: 4px;
}
</style>
