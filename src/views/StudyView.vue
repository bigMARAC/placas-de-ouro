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

          <v-btn
            block
            color="primary"
            size="large"
            class="text-white mt-6"
            to="/"
          >
            Criar Novo Estudo
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStudyStore } from '../store/studyStore'
import { marked } from 'marked'

const router = useRouter()
const { currentStudy } = useStudyStore()

const parsedContent = computed(() => {
  if (!currentStudy.value?.content) return ''
  return marked(currentStudy.value.content)
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

:deep(.markdown-content) {
  line-height: 1.6;
}

:deep(.markdown-content h1) {
  font-size: 1.8em;
  margin-bottom: 1em;
}

:deep(.markdown-content h2) {
  font-size: 1.5em;
  margin: 1em 0;
}

:deep(.markdown-content h3) {
  font-size: 1.2em;
  margin: 1em 0;
}

:deep(.markdown-content p) {
  margin-bottom: 1em;
}

:deep(.markdown-content ul),
:deep(.markdown-content ol) {
  margin: 1em 0;
  padding-left: 2em;
}

:deep(.markdown-content li) {
  margin-bottom: 0.5em;
}

:deep(.markdown-content blockquote) {
  border-left: 4px solid #ccc;
  margin: 1em 0;
  padding-left: 1em;
  color: #666;
}

:deep(.markdown-content code) {
  background-color: #f0f0f0;
  padding: 0.2em 0.4em;
  border-radius: 3px;
  font-family: monospace;
}

:deep(.markdown-content pre) {
  background-color: #f0f0f0;
  padding: 1em;
  border-radius: 4px;
  overflow-x: auto;
  margin: 1em 0;
}

:deep(.markdown-content pre code) {
  background-color: transparent;
  padding: 0;
}
</style>
