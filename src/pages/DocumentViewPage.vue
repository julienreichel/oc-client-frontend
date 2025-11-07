<template>
  <q-page data-cy="document-view-page" class="flex flex-center">
    <div class="q-pa-md" style="max-width: 800px; width: 100%">
      <!-- Back to Home Button -->
      <div class="q-mb-lg">
        <q-btn
          :to="{ name: 'access' }"
          color="primary"
          outline
          icon="arrow_back"
          :label="$t('document.backToHome')"
          data-cy="back-to-home"
          class="q-mb-md"
        />
      </div>

      <!-- Loading State -->
      <LoadingState v-if="state.loading.value" data-cy="loading-spinner" />

      <!-- Error State -->
      <ErrorState
        v-else-if="state.error.value"
        :error="state.error.value"
        data-cy="error-state"
        @retry="handleRetry"
      />

      <!-- Success State -->
      <DocumentViewer
        v-else-if="state.data.value"
        :document="state.data.value"
        data-cy="document-viewer"
      />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useDocumentByCode } from 'src/composables/useDocumentByCode';
import DocumentViewer from 'src/components/DocumentViewer.vue';
import LoadingState from 'src/components/LoadingState.vue';
import ErrorState from 'src/components/ErrorState.vue';

const route = useRoute();
const { state, load, reload } = useDocumentByCode();

const accessCode = route.params.code as string;

onMounted(() => {
  if (accessCode) {
    void load(accessCode);
  }
});

const handleRetry = (): void => {
  void reload();
};
</script>
