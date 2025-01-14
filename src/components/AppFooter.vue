<script setup lang="ts">
const openWhatsApp = () => {
  const phoneNumber = import.meta.env.VITE_WHATSAPP_NUMBER
  const message = 'Olá! Estou usando o app Placas de Ouro.'
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
  window.open(whatsappUrl, '_blank')
}
</script>

<template>
  <v-footer class="bg-primary">
    <v-container class="py-2">
      <div class="d-flex flex-column align-center text-center">
        <div class="d-flex align-center text-white mb-1">
          <v-icon icon="mdi-heart" size="x-small" class="mr-1" />
          <span class="text-caption">
            Desenvolvido por Marcos E. da Silva
          </span>
        </div>

        <v-chip
          size="x-small"
          color="white"
          variant="flat"
          class="mb-1 text-primary"
        >
          v0.0.2
        </v-chip>

        <div class="d-flex align-center gap-1">
          <v-btn
            to="/release-notes"
            variant="text"
            density="compact"
            size="small"
            class="text-white"
            prepend-icon="mdi-note-text-outline"
          >
            Atualizações
          </v-btn>

          <v-divider vertical class="mx-1 bg-white" />

          <v-btn
            variant="text"
            density="compact"
            size="small"
            class="text-white"
            prepend-icon="mdi-whatsapp"
            @click="openWhatsApp"
          >
            Contato
          </v-btn>
        </div>
      </div>
    </v-container>
  </v-footer>
</template>

<style scoped>
.v-footer {
  max-height: 125px;
  min-height: 48px !important;
}

.v-container {
  max-width: 600px;
}

:deep(.v-btn) {
  text-transform: none;
}

:deep(.v-divider) {
  opacity: 0.3;
  height: 12px;
}
</style>
