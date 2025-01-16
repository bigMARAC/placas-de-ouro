<template>
  <v-container class="fill-height">
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card class="pa-8" elevation="2">
          <h1 class="text-h4 mb-6 text-center primary--text">Placas de Ouro</h1>
          
          <v-card-text class="text-body-1 pa-0">
            <p class="text-h6 mb-6">
              Bem-vindo ao seu assistente de estudos do Livro de Mórmon!
            </p>
            
            <div class="feature-list mb-8">
              <div class="d-flex align-start mb-4">
                <v-icon color="primary" size="32" class="mr-4 mt-1">mdi-book-open-page-variant</v-icon>
                <span class="text-body-1">Estude qualquer versículo do Livro de Mórmon com ajuda da inteligência artificial</span>
              </div>
              
              <div class="d-flex align-start mb-4">
                <v-icon color="primary" size="32" class="mr-4 mt-1">mdi-clock-outline</v-icon>
                <span class="text-body-1">Escolha quanto tempo você tem disponível para estudar</span>
              </div>
              
              <div class="d-flex align-start mb-4">
                <v-icon color="primary" size="32" class="mr-4 mt-1">mdi-format-list-checks</v-icon>
                <span class="text-body-1">Receba explicações claras e insights profundos sobre as escrituras</span>
              </div>
            </div>

            <v-divider class="mb-8"></v-divider>

            <p class="text-h6 mb-4">
              Para começar, digite seu e-mail:
            </p>

            <v-form @submit.prevent="handleSubmit">
              <v-text-field
                v-model="email"
                label="Seu e-mail"
                type="email"
                variant="outlined"
                :rules="[v => !!v || 'E-mail é obrigatório', v => /.+@.+\..+/.test(v) || 'E-mail deve ser válido']"
                required
                class="large-input mb-6"
                hide-details="auto"
              ></v-text-field>

              <v-btn
                block
                color="primary"
                size="x-large"
                type="submit"
                :disabled="!isValidEmail"
                class="text-white text-h6 py-6"
                prepend-icon="mdi-book-open-variant"
              >
                Começar a Estudar
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/authStore'

const router = useRouter()
const authStore = useAuthStore()
const email = ref('')

const isValidEmail = computed(() => {
  return /.+@.+\..+/.test(email.value)
})

onMounted(() => {
  if (authStore.isAuthenticated()) {
    router.push('/generate')
  }
})

const handleSubmit = () => {
  if (isValidEmail.value) {
    authStore.setEmail(email.value)
    router.push('/generate')
  }
}
</script>

<style scoped>
.v-card {
  background-color: #faf7f5;
}

.large-input :deep(.v-field__input) {
  font-size: 1.1rem !important;
  min-height: 52px !important;
  padding: 8px 16px !important;
}

.feature-list {
  font-size: 1.1rem;
}

@media (max-width: 600px) {
  .large-input :deep(.v-field__input) {
    font-size: 1rem !important;
    min-height: 48px !important;
    padding: 6px 12px !important;
  }

  .feature-list {
    font-size: 1rem;
  }

  .v-card {
    padding: 16px !important;
  }
}
</style>
