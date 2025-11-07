<template>
  <div class="access-input">
    <q-input
      :model-value="modelValue"
      :label="label"
      :placeholder="placeholder"
      :error="showError"
      :error-message="errorMessage"
      filled
      data-cy="access-input-field"
      @update:model-value="(value) => $emit('update:modelValue', String(value || ''))"
    >
      <template #prepend>
        <q-icon name="vpn_key" />
      </template>
    </q-input>

    <!-- Custom error display for better control -->
    <div
      v-if="showError && errorMessage"
      class="text-negative text-caption q-mt-xs"
      data-cy="access-input-error"
    >
      {{ errorMessage }}
    </div>

    <!-- Hidden label for accessibility (screen readers) -->
    <label class="sr-only" data-cy="access-input-label">
      {{ label }}
    </label>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: string;
  label: string;
  placeholder: string;
  showError: boolean;
  errorMessage: string;
}

interface Emits {
  (event: 'update:modelValue', value: string): void;
}

defineProps<Props>();
defineEmits<Emits>();
</script>

<style scoped>
.access-input {
  width: 100%;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
