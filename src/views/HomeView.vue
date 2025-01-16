<template>
  <v-container class="fill-height">
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card class="pa-6" elevation="2">
          <h1 class="text-h4 mb-6 text-center">Placas de Ouro</h1>
          
          <v-card-text class="text-body-1">
            <p class="mb-4">
              Bem-vindo ao Placas de Ouro! Este é um assistente de estudos do Livro de Mórmon que utiliza 
              inteligência artificial para gerar insights profundos e relevantes sobre as escrituras.
            </p>
            <p class="mb-4">
              Com nossa ferramenta, você pode selecionar qualquer versículo do Livro de Mórmon e receber 
              um estudo detalhado que inclui contexto histórico, princípios doutrinários e aplicações práticas 
              para sua vida.
            </p>
          </v-card-text>

          <v-form @submit.prevent="handleSubmit" class="mt-4">
            <v-text-field
              v-model="email"
              label="Seu e-mail"
              type="email"
              variant="outlined"
              :rules="[v => !!v || 'E-mail é obrigatório', v => /.+@.+\..+/.test(v) || 'E-mail deve ser válido']"
              required
            ></v-text-field>

            <v-btn
              block
              color="primary"
              size="large"
              type="submit"
              :disabled="!isValidEmail"
              class="text-white mt-4"
            >
              Começar a Estudar
            </v-btn>
          </v-form>
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
</style>
