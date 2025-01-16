<template>
  <v-container class="fill-height">
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card class="pa-4 pa-sm-8" elevation="2" v-if="currentStudy">
          <div class="d-flex flex-column align-center">
            <h1 class="text-h4">{{ currentStudy.book }} {{ currentStudy.chapter }}:{{ currentStudy.verse }}</h1>
          </div>
          <div class="d-flex flex-wrap gap-2 mb-8 mt-4">
              <v-btn
                color="primary"
                prepend-icon="mdi-content-save"
                @click="showSaveDialog = true"
                :disabled="!!savedId"
                class="flex-1"
              >
                {{ savedId ? 'Salvo' : 'Salvar Estudo' }}
              </v-btn>
              <v-btn
                color="primary"
                variant="outlined"
                prepend-icon="mdi-bookmark"
                @click="router.push('/saved-studies')"
                class="flex-1"
              >
                Meus Estudos
              </v-btn>
            </div>

          <div v-if="savedId" class="text-caption text-success mb-4">
            Estudo salvo com sucesso!
          </div>
          
          <p class="text-caption mb-4">
            Nota: o estudo é gerando baseando-se na versão em inglês do Livro de Mórmon.
          </p>

          <MarkdownContent :content="currentStudy.content" />
          
          <v-divider class="my-9"></v-divider>
          
          <p class="text-body my-6">
            Este texto foi gerado por uma inteligência artificial e, portanto, não representa um texto oficial. 
            Se você tiver dúvidas ou precisar de informações precisas, recomenda-se verificar diretamente na página oficial 
            da igreja, acessando www.churchofjesuschrist.org ou clicando <a href="https://www.churchofjesuschrist.org/?lang=por" target="_blank">aqui</a>
          </p>
          
          <v-btn
            block
            color="primary"
            class="mt-4"
            to="/generate"
            prepend-icon="mdi-creation"
          >
            GERAR NOVO ESTUDO
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
        </v-card>

        <v-card v-else class="pa-4 pa-sm-8 text-center" elevation="2">
          <v-icon size="64" color="grey" class="mb-4">mdi-alert</v-icon>
          <p class="text-h6 text-grey-darken-1">Nenhum estudo gerado</p>
          <v-btn
            color="primary"
            class="mt-4"
            prepend-icon="mdi-arrow-left"
            @click="router.push('/generate')"
          >
            Voltar
          </v-btn>
        </v-card>
      </v-col>
    </v-row>

    <!-- Save Study Dialog -->
    <v-dialog v-model="showSaveDialog" max-width="500">
      <v-card>
        <v-card-title class="text-h5 pa-4">
          Salvar Estudo
        </v-card-title>
        <v-card-text class="pa-4">
          <v-text-field
            v-model="studyName"
            label="Nome do Estudo (opcional)"
            variant="outlined"
            :rules="[v => !v || v.length <= 100 || 'Nome muito longo']"
            hide-details="auto"
            class="mb-4"
          ></v-text-field>
          <p class="text-body-2 text-grey">
            Dê um nome personalizado ao seu estudo ou deixe em branco para usar a referência do versículo.
          </p>
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn
            color="grey-darken-1"
            variant="text"
            @click="showSaveDialog = false"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="primary"
            @click="handleSaveStudy"
          >
            Salvar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar
      v-model="showError"
      color="error"
      timeout="3000"
    >
      {{ errorMessage }}
    </v-snackbar>

    <DonationDialog v-model:open="showDonationDialog"/>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStudyStore } from '../store/studyStore'
import { useSavedStudiesStore } from '../store/savedStudiesStore'
import DonationDialog from '../components/DonationDialog.vue'
import MarkdownContent from '../components/MarkdownContent.vue'

const router = useRouter()
const studyStore = useStudyStore()
const savedStudiesStore = useSavedStudiesStore()

const currentStudy = studyStore.currentStudy
const savedId = ref('')
const showSaveDialog = ref(false)
const studyName = ref('')
const showError = ref(false)
const errorMessage = ref('')
const showDonationDialog = ref(false)

const handleSaveStudy = async () => {
  const study = currentStudy.value
  if (!study) {
    errorMessage.value = 'Nenhum estudo para salvar.'
    showError.value = true
    return
  }

  try {
    // Check if study already exists by searching in the store
    const isDuplicate = savedStudiesStore.studies.some(savedStudy => 
      savedStudy.content === study.content
    )

    if (isDuplicate) {
      errorMessage.value = 'Este estudo já foi salvo anteriormente.'
      showError.value = true
      showSaveDialog.value = false
      return
    }

    savedId.value = savedStudiesStore.saveStudy({
      name: studyName.value,
      book: study.book,
      chapter: study.chapter,
      verse: study.verse,
      content: study.content
    })
    showSaveDialog.value = false
    studyName.value = ''
  } catch (error) {
    if (error instanceof Error) {
      errorMessage.value = error.message
    } else {
      errorMessage.value = 'Erro ao salvar o estudo.'
    }
    showError.value = true
  }
}
</script>

<style scoped>
.gap-2 {
  gap: 8px;
}

.flex-1 {
  flex: 1;
  min-width: 140px;
}

@media (max-width: 600px) {
  :deep(.text-h4) {
    font-size: 1.5rem !important;
  }
  
  .v-btn {
    width: 100%;
  }

  .flex-1 {
    min-width: 100%;
  }
}
</style>
