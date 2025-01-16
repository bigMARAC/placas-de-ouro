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
                    <v-icon
                      v-if="getVersionIcon(release.type)"
                      :icon="getVersionIcon(release.type)"
                      size="small"
                      start
                      class="mr-1"
                    />
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
            <ul class="release-features pa-0">
              <li
                v-for="(feature, index) in release.features"
                :key="index"
                class="mb-2"
              >
                {{ feature }}
              </li>
            </ul>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'
import releaseData from '../data/releases.json'

const { mobile } = useDisplay()

type ReleaseType = 'major' | 'beta' | 'update' | 'first' | 'coming-soon'

const releases = releaseData.releases

const getVersionColor = (type: ReleaseType): string => {
  switch (type) {
    case 'major':
      return 'success'
    case 'beta':
      return 'warning'
    case 'coming-soon':
      return 'info'
    default:
      return 'primary'
  }
}

const getVersionIcon = (type: ReleaseType): string | undefined => {
  switch (type) {
    case 'coming-soon':
      return 'mdi-clock-outline'
    default:
      return undefined
  }
}
</script>

<style scoped>
.release-features {
  list-style-type: none;
  margin: 0;
}

.release-features li {
  position: relative;
  padding-left: 1.5em;
}

.release-features li::before {
  content: "•";
  position: absolute;
  left: 0.5em;
  color: rgba(0, 0, 0, 0.6);
}

@media (max-width: 600px) {
  :deep(.text-h4) {
    font-size: 1.5rem !important;
  }
}
</style>
