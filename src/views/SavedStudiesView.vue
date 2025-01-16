<template>
  <v-container class="fill-height">
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card class="pa-4 pa-sm-8" elevation="2">
          <div class="d-flex flex-wrap align-center justify-center mb-6">
            <h1 class="text-h4 text-sm-h4 mb-0 mb-sm-0">Estudos Salvos</h1>
          </div>

          <div v-if="userStudies.length === 0" class="text-center py-8">
            <v-icon size="64" color="grey" class="mb-4">mdi-book-open-variant</v-icon>
            <p class="text-h6 text-grey-darken-1">Você ainda não tem estudos salvos</p>
            <v-btn
              color="primary"
              class="mt-4"
              prepend-icon="mdi-plus"
              @click="router.push('/generate')"
            >
              Criar Novo Estudo
            </v-btn>
          </div>

          <v-card
            v-else
            v-for="study in userStudies"
            :key="study.id"
            class="mb-4 pa-4"
            variant="outlined"
            hover
            @click="viewStudy(study.id)"
          >
            <div class="d-flex flex-wrap justify-space-between align-center">
              <div class="mb-2 mb-sm-0">
                <div class="text-h6" v-if="study.name !== ''">{{ study.name  }}</div>
                <div :class="{ 'text-h6': study.name === '', 'text-body-1 text-grey': study.name !== '' }">{{ study.book }} {{ study.chapter }}:{{ study.verse }}</div>
                <div class="text-body-2 text-grey">
                  Salvo em {{ new Date(study.savedAt).toLocaleDateString('pt-BR') }}
                </div>
              </div>
              <v-btn
                icon="mdi-delete"
                variant="text"
                color="error"
                class="ml-auto ml-sm-2"
                @click.stop="confirmDelete(study)"
              ></v-btn>
            </div>
            <div class="text-body-1 mt-4">
              <MarkdownContent :content="study.content" preview />
            </div>
          </v-card>
        </v-card>
      </v-col>
    </v-row>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="showDeleteDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h5 pa-4">
          Confirmar Exclusão
        </v-card-title>
        <v-card-text class="pa-4">
          Tem certeza que deseja excluir este estudo? Esta ação não pode ser desfeita.
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn
            color="grey-darken-1"
            variant="text"
            @click="showDeleteDialog = false"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="error"
            variant="flat"
            @click="deleteConfirmed"
          >
            Excluir
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useSavedStudiesStore, type SavedStudy } from '../store/savedStudiesStore'
import MarkdownContent from '../components/MarkdownContent.vue'

const router = useRouter()
const savedStudiesStore = useSavedStudiesStore()

const userStudies = computed(() => savedStudiesStore.userStudies)

const showDeleteDialog = ref(false)
const studyToDelete = ref<SavedStudy | null>(null)

const viewStudy = (id: string) => {
  router.push(`/saved-study/${id}`)
}

const confirmDelete = (study: SavedStudy) => {
  studyToDelete.value = study
  showDeleteDialog.value = true
}

const deleteConfirmed = () => {
  if (studyToDelete.value) {
    savedStudiesStore.deleteStudy(studyToDelete.value.id)
    showDeleteDialog.value = false
    studyToDelete.value = null
  }
}
</script>

<style scoped>
.v-card {
  transition: transform 0.2s;
}

.v-card[variant="outlined"]:hover {
  transform: translateY(-2px);
  cursor: pointer;
}

@media (max-width: 600px) {
  :deep(.v-card-title) {
    font-size: 1.25rem;
  }
  
  :deep(.text-h6) {
    font-size: 1.1rem !important;
  }
}
</style>
