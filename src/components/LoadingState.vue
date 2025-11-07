<template>
  <div class="loading-state">
    <div class="row justify-center q-my-xl">
      <div class="col-auto text-center">
        <!-- Loading Spinner -->
        <q-spinner-dots color="primary" size="3em" role="status" aria-label="Loading spinner" data-cy="loading-spinner" />

        <!-- Loading Text -->
        <div class="q-mt-md text-body2 text-grey-6" aria-label="Loading message" role="status" data-cy="loading-text">
          {{ $t('document.loading') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Simple loading state component - no props needed
</script>

<style scoped>
.loading-state {
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
