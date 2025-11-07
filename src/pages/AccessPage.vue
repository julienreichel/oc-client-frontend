<template>
  <q-page padding>
    <div class="row justify-center">
      <div class="col-12 col-sm-8 col-md-6 col-lg-4">
        <q-card class="q-pa-lg">
          <q-card-section>
            <div class="text-h5 text-center q-mb-lg">
              {{ $t('access.title') }}
            </div>

            <form @submit.prevent="handleSubmit">
              <AccessInput
                v-model="form.code.value"
                :label="$t('access.label')"
                :placeholder="$t('access.placeholder')"
                :show-error="!form.isValid.value && form.isValidated.value"
                :error-message="$t('access.validation.required')"
                class="q-mb-md"
              />

              <div class="row justify-center">
                <q-btn
                  type="submit"
                  color="primary"
                  :label="$t('access.submit')"
                  class="q-px-xl"
                  data-cy="submit-button"
                />
              </div>
            </form>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import AccessInput from '../components/AccessInput.vue';
import { useAccessCodeForm } from '../composables/useAccessCodeForm';

const router = useRouter();
const form = useAccessCodeForm();

/**
 * Handles form submission
 * Validates the form and navigates to the view page if valid
 */
function handleSubmit(): void {
  const result = form.submit();

  if (result.valid) {
    // Navigate to the view page with the normalized code
    void router.push(`/view/${result.normalizedCode}`);
  }
  // If invalid, form.isValid will be false and error will be shown
}
</script>

<style scoped>
.q-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
}
</style>
