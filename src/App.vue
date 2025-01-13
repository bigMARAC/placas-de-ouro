<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppFooter from './components/AppFooter.vue'

const route = useRoute()
const router = useRouter()

const showBackButton = computed(() => {
  return route.name !== 'home'
})

const handleBack = () => {
  router.back()
}
</script>

<template>
  <v-app>
    <v-app-bar color="primary">
      <v-container class="pa-0 fill-height">
        <div class="d-flex align-center fill-height w-100 position-relative">
          <v-btn
            v-if="showBackButton"
            icon="mdi-arrow-left"
            variant="text"
            size="small"
            color="white"
            class="position-absolute"
            style="left: 0;"
            @click="handleBack"
          />
          
          <v-app-bar-title class="text-center w-100">
            Placas de Ouro
          </v-app-bar-title>
        </div>
      </v-container>
    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>

    <AppFooter />
  </v-app>
</template>

<style scoped>
.v-app-bar-title {
  overflow: visible;
}

:deep(.v-container) {
  max-width: 100%;
}
</style>
