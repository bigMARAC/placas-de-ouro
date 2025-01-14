<script setup lang="ts">
import { useDisplay } from 'vuetify'
const { mobile } = useDisplay()

const releases = [
  {
    version: '0.0.2',
    date: '14/01/2025',
    type: 'update',
    description: 'Melhoria no prompt para análise teológica',
    features: [
      'Prompt revisado para maior clareza e objetividade',
      'Respostas direcionadas a um público que acredita no Livro de Mórmon',
      'Formatação em Markdown para melhor organização',
      'Análises mais profundas com exegese e hermenêutica'
    ]
  },
  {
    version: '0.0.1',
    date: '13/01/2025',
    type: 'beta',
    description: 'Versão beta para testes',
    features: [
      'Interface básica implementada',
      'Seleção de livros, capítulos e versículos',
      'Estrutura inicial do aplicativo'
    ]
  }
]

const getVersionColor = (type: string) => {
  switch (type) {
    case 'major':
      return 'success'
    case 'beta':
      return 'warning'
    default:
      return 'primary'
  }
}
</script>

<template>
  <v-container class="pa-4 mt-4">
    <v-row justify="center">
      <v-col cols="12" :md="8">
        <div class="d-flex align-center mb-6">
          <v-icon
            icon="mdi-note-text-outline"
            size="x-large"
            color="primary"
            class="mr-4"
          />
          <div>
            <h1 class="text-h4 font-weight-bold mb-1">Atualizações</h1>
            <div class="text-body-2 text-medium-emphasis">
              Acompanhe as novidades e melhorias do aplicativo
            </div>
          </div>
        </div>

        <v-card
          v-for="release in releases"
          :key="release.version"
          class="mb-4"
          variant="outlined"
          :rounded="mobile ? 'lg' : 'xl'"
        >
          <v-card-item>
            <div class="d-flex flex-wrap align-start justify-space-between">
              <div>
                <div class="d-flex align-center mb-2">
                  <v-chip
                    :color="getVersionColor(release.type)"
                    size="small"
                    class="mr-2 font-weight-medium"
                  >
                    v{{ release.version }}
                  </v-chip>
                  <span class="text-caption text-medium-emphasis">
                    {{ release.date }}
                  </span>
                </div>
                <div class="text-subtitle-1 font-weight-bold mb-1">
                  {{ release.description }}
                </div>
              </div>
            </div>
          </v-card-item>

          <v-card-text class="pt-2">
            <v-list class="bg-transparent pa-0">
              <v-list-item
                v-for="(feature, index) in release.features"
                :key="index"
                class="pa-0 mb-2"
                density="compact"
              >
                <template v-slot:prepend>
                  <v-icon
                    :color="getVersionColor(release.type)"
                    size="small"
                    class="mr-2"
                  >
                    mdi-check-circle-outline
                  </v-icon>
                </template>
                <div class="text-body-2">
                  {{ feature }}
                </div>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
:deep(.v-list-item) {
  min-height: 24px !important;
}

:deep(.v-list) {
  --v-list-padding: 0;
}

.v-card {
  transition: transform 0.2s ease-in-out;
}

.v-card:hover {
  transform: translateY(-2px);
}

@media (max-width: 600px) {
  .v-card {
    transform: none !important;
  }
}
</style>
