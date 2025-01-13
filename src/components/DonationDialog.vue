<template>
  <v-dialog :model-value="open" @update:model-value="$emit('update:open')" max-width="400">
    <v-card>
      <v-card-title class="text-center pa-4">
        Apoie com PIX
      </v-card-title>

      <v-card-text class="text-center">
        <p class="mb-4">Se este app te ajudou, considere fazer uma doação para ajudar a mantê-lo online.</p>
        
        <v-img
          :src="pixQrCodeUrl"
          alt="PIX QR Code"
          class="mx-auto mb-4"
          max-width="200"
        ></v-img>

        <v-text-field
          :model-value="pixKey"
          label="Chave PIX"
          readonly
          class="mb-2"
          append-inner-icon="mdi-content-copy"
          @click:append-inner="copyPixKey"
        ></v-text-field>

        <v-alert
          v-if="showCopySuccess"
          type="success"
          variant="tonal"
          class="mb-4"
        >
          Chave PIX copiada com sucesso!
        </v-alert>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          variant="text"
          @click="$emit('update:open', false)"
        >
          Fechar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  open: boolean
}>()

defineEmits<{
  'update:open': [value: boolean]
}>()

const showCopySuccess = ref(false)
const pixKey = ref(import.meta.env.VITE_PIX_KEY)
const pixQrCodeUrl = ref('/qrcode-pix.png')

const copyPixKey = async () => {
  try {
    await navigator.clipboard.writeText(pixKey.value)
    showCopySuccess.value = true
    setTimeout(() => {
      showCopySuccess.value = false
    }, 3000)
  } catch (err) {
    console.error('Failed to copy PIX key:', err)
  }
}
</script>
