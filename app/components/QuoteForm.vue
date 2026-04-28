<script setup lang="ts">
const { isOpen, close } = useQuoteModal();

const form = reactive({
  name: '',
  mobile: '',
  email: '',
  jobDescription: '',
});

const errors = reactive({
  name: '',
  mobile: '',
  email: '',
  jobDescription: '',
});

const submitted = ref(false);
const submitting = ref(false);

const validate = () => {
  let valid = true;

  errors.name = form.name.trim() ? '' : 'Please enter your name.';
  if (errors.name) valid = false;

  const mobileRe = /^[\d\s\+\-\(\)]{7,15}$/;
  errors.mobile = form.mobile.trim()
    ? mobileRe.test(form.mobile.trim())
      ? ''
      : 'Please enter a valid mobile number.'
    : 'Please enter your mobile number.';
  if (errors.mobile) valid = false;

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  errors.email = form.email.trim()
    ? emailRe.test(form.email.trim())
      ? ''
      : 'Please enter a valid email address.'
    : 'Please enter your email address.';
  if (errors.email) valid = false;

  errors.jobDescription = form.jobDescription.trim()
    ? form.jobDescription.trim().length >= 10
      ? ''
      : 'Please give a little more detail about the job.'
    : 'Please describe the job you need quoting.';
  if (errors.jobDescription) valid = false;

  return valid;
};

const handleSubmit = async () => {
  if (!validate()) return;
  submitting.value = true;
  // Simulate network request
  await new Promise((resolve) => setTimeout(resolve, 1200));
  submitting.value = false;
  submitted.value = true;
};

const handleClose = () => {
  close();
  // Reset after transition
  setTimeout(() => {
    submitted.value = false;
    submitting.value = false;
    Object.assign(form, {
      name: '',
      mobile: '',
      email: '',
      jobDescription: '',
    });
    Object.assign(errors, {
      name: '',
      mobile: '',
      email: '',
      jobDescription: '',
    });
  }, 300);
};

// Close on Escape key
onMounted(() => {
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen.value) handleClose();
  };
  window.addEventListener('keydown', onKey);
  onUnmounted(() => window.removeEventListener('keydown', onKey));
});
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="isOpen"
        class="modal-overlay"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        @click.self="handleClose"
      >
        <Transition name="modal-slide">
          <div v-if="isOpen" class="modal">
            <!-- Close button -->
            <button
              class="modal__close"
              aria-label="Close quote form"
              @click="handleClose"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>

            <!-- Success state -->
            <Transition name="fade" mode="out-in">
              <div v-if="submitted" class="modal__success" key="success">
                <div class="modal__success-icon" aria-hidden="true">✅</div>
                <h2 class="modal__success-title">Request received!</h2>
                <p class="modal__success-text">
                  Thanks, <strong>{{ form.name || 'there' }}</strong
                  >! We'll be in touch shortly to arrange a visit and price up
                  your job.
                </p>
                <button class="btn btn--primary btn--full" @click="handleClose">
                  Done
                </button>
              </div>

              <!-- Form state -->
              <div v-else key="form" class="modal__body">
                <div class="modal__header">
                  <span class="modal__badge" aria-hidden="true"
                    >⚡ Free &amp; no obligation</span
                  >
                  <h2 id="modal-title" class="modal__title">Get a Quote</h2>
                  <p class="modal__subtitle">
                    Tell us about your job and we'll send someone out to give
                    you a fair, no-obligation quote.
                  </p>
                </div>

                <form novalidate @submit.prevent="handleSubmit">
                  <div class="form__row form__row--2col">
                    <!-- Name -->
                    <div class="form__field">
                      <label class="form__label" for="quote-name">
                        Full Name
                        <span class="form__required" aria-hidden="true">*</span>
                      </label>
                      <input
                        id="quote-name"
                        v-model="form.name"
                        class="form__input"
                        :class="{ 'form__input--error': errors.name }"
                        type="text"
                        autocomplete="name"
                        placeholder="Jane Smith"
                        :aria-describedby="
                          errors.name ? 'name-error' : undefined
                        "
                        :aria-invalid="!!errors.name"
                      />
                      <p
                        v-if="errors.name"
                        id="name-error"
                        class="form__error"
                        role="alert"
                      >
                        {{ errors.name }}
                      </p>
                    </div>

                    <!-- Mobile -->
                    <div class="form__field">
                      <label class="form__label" for="quote-mobile">
                        Mobile
                        <span class="form__required" aria-hidden="true">*</span>
                      </label>
                      <input
                        id="quote-mobile"
                        v-model="form.mobile"
                        class="form__input"
                        :class="{ 'form__input--error': errors.mobile }"
                        type="tel"
                        autocomplete="tel"
                        placeholder="07700 900000"
                        :aria-describedby="
                          errors.mobile ? 'mobile-error' : undefined
                        "
                        :aria-invalid="!!errors.mobile"
                      />
                      <p
                        v-if="errors.mobile"
                        id="mobile-error"
                        class="form__error"
                        role="alert"
                      >
                        {{ errors.mobile }}
                      </p>
                    </div>
                  </div>

                  <!-- Email -->
                  <div class="form__field">
                    <label class="form__label" for="quote-email">
                      Email Address
                      <span class="form__required" aria-hidden="true">*</span>
                    </label>
                    <input
                      id="quote-email"
                      v-model="form.email"
                      class="form__input"
                      :class="{ 'form__input--error': errors.email }"
                      type="email"
                      autocomplete="email"
                      placeholder="jane@example.com"
                      :aria-describedby="
                        errors.email ? 'email-error' : undefined
                      "
                      :aria-invalid="!!errors.email"
                    />
                    <p
                      v-if="errors.email"
                      id="email-error"
                      class="form__error"
                      role="alert"
                    >
                      {{ errors.email }}
                    </p>
                  </div>

                  <!-- Job Description -->
                  <div class="form__field">
                    <label class="form__label" for="quote-job">
                      Job Description
                      <span class="form__required" aria-hidden="true">*</span>
                    </label>
                    <textarea
                      id="quote-job"
                      v-model="form.jobDescription"
                      class="form__input form__textarea"
                      :class="{ 'form__input--error': errors.jobDescription }"
                      rows="4"
                      placeholder="e.g. Full bathroom retile — floor and walls, approx 5m². Also need the existing tiles removed."
                      :aria-describedby="
                        errors.jobDescription ? 'job-error' : undefined
                      "
                      :aria-invalid="!!errors.jobDescription"
                    />
                    <p
                      v-if="errors.jobDescription"
                      id="job-error"
                      class="form__error"
                      role="alert"
                    >
                      {{ errors.jobDescription }}
                    </p>
                  </div>

                  <button
                    type="submit"
                    class="btn btn--primary btn--full btn--lg"
                    :disabled="submitting"
                    :aria-busy="submitting"
                  >
                    <span
                      v-if="submitting"
                      class="btn__spinner"
                      aria-hidden="true"
                    />
                    {{
                      submitting ? 'Sending your request…' : 'Request My Quote'
                    }}
                  </button>

                  <p class="form__footnote">
                    We'll never share your details. By submitting you agree to
                    be contacted about your quote.
                  </p>
                </form>
              </div>
            </Transition>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* ── Overlay ─────────────────────────────────────── */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

/* ── Modal box ───────────────────────────────────── */
.modal {
  position: relative;
  width: 100%;
  max-width: 560px;
  max-height: 90svh;
  overflow-y: auto;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.15);
  scrollbar-width: thin;
}

.modal__close {
  position: sticky;
  top: 1rem;
  float: right;
  margin: 1rem 1rem 0 0;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  color: #64748b;
  cursor: pointer;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    background 0.2s,
    color 0.2s;
  z-index: 10;
}

.modal__close:hover {
  background: #e2e8f0;
  color: #0f172a;
}

/* ── Body ────────────────────────────────────────── */
.modal__body {
  padding: 0 2rem 2rem;
  clear: both;
}

.modal__header {
  margin-bottom: 1.75rem;
}

.modal__badge {
  display: inline-block;
  font-size: 0.78rem;
  font-weight: 600;
  color: #0f5148;
  background: #f0fdfa;
  border: 1px solid #0d9488;
  border-radius: 999px;
  padding: 0.25rem 0.75rem;
  margin-bottom: 0.75rem;
}

.modal__title {
  font-size: 1.75rem;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.02em;
  margin: 0 0 0.5rem;
}

.modal__subtitle {
  font-size: 0.93rem;
  color: #64748b;
  line-height: 1.6;
  margin: 0;
}

/* ── Form ────────────────────────────────────────── */
.form__row--2col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form__field {
  margin-bottom: 1.1rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.form__label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #334155;
}

.form__required {
  color: #0d9488;
}

.form__input {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  color: #0f172a;
  font-size: 0.95rem;
  padding: 0.7rem 1rem;
  width: 100%;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
  font-family: inherit;
  outline: none;
}

.form__input::placeholder {
  color: #94a3b8;
}

.form__input:focus {
  border-color: #1d4ed8;
  box-shadow: 0 0 0 3px rgba(29, 78, 216, 0.12);
  background: #fff;
}

.form__input--error {
  border-color: #f87171;
}

.form__input--error:focus {
  box-shadow: 0 0 0 3px rgba(248, 113, 113, 0.2);
}

.form__textarea {
  resize: vertical;
  min-height: 100px;
}

.form__error {
  font-size: 0.8rem;
  color: #f87171;
  margin: 0;
}

.form__footnote {
  font-size: 0.78rem;
  color: #94a3b8;
  text-align: center;
  margin-top: 0.85rem;
  line-height: 1.5;
}

/* ── Buttons ─────────────────────────────────────── */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.7rem 1.5rem;
  font-size: 0.95rem;
  font-weight: 600;
  border-radius: 10px;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  white-space: nowrap;
  font-family: inherit;
}

.btn--primary {
  background: #0d9488;
  color: #fff;
  box-shadow: 0 4px 20px rgba(13, 148, 136, 0.35);
}

.btn--primary:hover:not(:disabled) {
  background: #0f766e;
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(13, 148, 136, 0.5);
}

.btn--primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn--full {
  width: 100%;
}

.btn--lg {
  padding: 0.9rem 2rem;
  font-size: 1rem;
}

.btn__spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  flex-shrink: 0;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ── Success ─────────────────────────────────────── */
.modal__success {
  padding: 1rem 2rem 2.5rem;
  clear: both;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.85rem;
}

.modal__success-icon {
  font-size: 3.5rem;
  line-height: 1;
  margin-top: 0.5rem;
}

.modal__success-title {
  font-size: 1.6rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
}

.modal__success-text {
  font-size: 0.98rem;
  color: #64748b;
  line-height: 1.65;
  margin: 0 0 0.5rem;
}

.modal__success-text strong {
  color: #0f172a;
}

/* ── Transitions ─────────────────────────────────── */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-slide-enter-active,
.modal-slide-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}
.modal-slide-enter-from,
.modal-slide-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.98);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ── Responsive ──────────────────────────────────── */
@media (max-width: 480px) {
  .modal__body {
    padding: 0 1.25rem 1.75rem;
  }

  .form__row--2col {
    grid-template-columns: 1fr;
  }

  .modal__title {
    font-size: 1.4rem;
  }
}
</style>
