<template>
  <v-container class="fill-height">
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card class="pa-4 pa-sm-8" elevation="2" v-if="study">
          <div class="d-flex flex-wrap align-center justify-center mb-6">
            <div class="d-flex flex-column align-center">
              <div class="text-h4" v-if="study.name !== ''">{{ study.name  }}</div>
              <div :class="{ 'text-h4': study.name === '', 'text-body-1 text-grey': study.name !== '' }">{{ study.book }} {{ study.chapter }}:{{ study.verse }}</div>
              <div class="text-body-2 text-grey">
                Salvo em {{ new Date(study.savedAt).toLocaleDateString('pt-BR') }}
              </div>
            </div>
          </div>

          <v-divider class="mb-6"></v-divider>

          <MarkdownContent :content="study.content" />
        </v-card>

        <v-card v-else class="pa-4 pa-sm-8 text-center" elevation="2">
          <v-icon size="64" color="grey" class="mb-4">mdi-alert</v-icon>
          <p class="text-h6 text-grey-darken-1">Estudo não encontrado</p>
          <v-btn
            color="primary"
            class="mt-4"
            prepend-icon="mdi-arrow-left"
            @click="router.push('/saved-studies')"
          >
            Voltar para Estudos Salvos
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useSavedStudiesStore } from '../store/savedStudiesStore'
import MarkdownContent from '../components/MarkdownContent.vue'

const router = useRouter()
const route = useRoute()
const savedStudiesStore = useSavedStudiesStore()

const study = computed(() => {
  const id = route.params.id as string
  return savedStudiesStore.getStudyById(id)
})
</script>

<style scoped>
@media (max-width: 600px) {
  :deep(.text-h4) {
    font-size: 1.5rem !important;
  }
}
</style>
