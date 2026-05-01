<script setup lang="ts">
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { trades } from '~/data/trades';
import { statuses } from '~/data/statuses';

const { isOpen, close } = useQuoteModal();

const form = reactive({
  name: '',
  mobile: '',
  category: '',
  jobDescription: '',
});

const errors = reactive({
  name: '',
  mobile: '',
  category: '',
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

  errors.category = form.category ? '' : 'Please select a trade category.';
  if (errors.category) valid = false;

  errors.jobDescription = form.jobDescription.trim()
    ? form.jobDescription.trim().length >= 10
      ? ''
      : 'Please give a little more detail about the job.'
    : 'Please describe the job you need quoting.';
  if (errors.jobDescription) valid = false;

  return valid;
};

const { $firestore } = useNuxtApp();

const handleSubmit = async () => {
  if (!validate()) return;
  submitting.value = true;
  try {
    await addDoc(collection($firestore as any, 'quotes'), {
      name: form.name.trim(),
      mobile: form.mobile.trim(),
      category: form.category,
      jobDescription: form.jobDescription.trim(),
      status: statuses[0],
      createdAt: serverTimestamp(),
    });
    submitted.value = true;
  } finally {
    submitting.value = false;
  }
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
      category: '',
      jobDescription: '',
    });
    Object.assign(errors, {
      name: '',
      mobile: '',
      category: '',
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
        class="fixed inset-0 z-[200] flex items-center justify-center p-4 backdrop-blur-[6px]"
        style="background: rgba(0, 0, 0, 0.7)"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        @click.self="handleClose"
      >
        <Transition name="modal-slide">
          <div
            v-if="isOpen"
            class="relative w-full max-w-[560px] max-h-[90svh] overflow-y-auto rounded-[20px] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(0,0,0,0.15)] [scrollbar-width:thin]"
          >
            <!-- Close button -->
            <button
              class="sticky top-4 float-right z-10 m-4 mb-0 flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-slate-100 text-slate-500 transition-all duration-200 hover:bg-slate-200 hover:text-slate-900"
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
              <div
                v-if="submitted"
                key="success"
                class="clear-both flex flex-col items-center gap-[0.85rem] px-8 pt-4 pb-10 text-center"
              >
                <div class="mt-2 text-[3.5rem] leading-none" aria-hidden="true">
                  ✅
                </div>
                <h2 class="m-0 text-[1.6rem] font-extrabold text-slate-900">
                  Request received!
                </h2>
                <p
                  class="m-0 mb-2 text-[0.98rem] leading-[1.65] text-slate-500"
                >
                  Thanks,
                  <strong class="text-slate-900">{{
                    form.name || 'there'
                  }}</strong
                  >! We'll be in touch shortly to arrange a visit and price up
                  your job.
                </p>
                <button
                  class="modal-btn w-full cursor-pointer rounded-[10px] border-none px-6 py-[0.7rem] font-semibold text-[0.95rem] text-white transition-all duration-200"
                  @click="handleClose"
                >
                  Done
                </button>
              </div>

              <!-- Form state -->
              <div
                v-else
                key="form"
                class="clear-both px-8 pb-8 max-[480px]:px-5 max-[480px]:pb-7"
              >
                <div class="mb-7">
                  <span
                    class="mb-3 inline-block rounded-full border border-[#0d9488] bg-[#f0fdfa] px-3 py-[0.25rem] text-[0.78rem] font-semibold text-[#0f5148]"
                    aria-hidden="true"
                    >⚡ Free &amp; no obligation</span
                  >
                  <h2
                    id="modal-title"
                    class="m-0 mb-2 text-[1.75rem] font-extrabold tracking-[-0.02em] text-slate-900 max-[480px]:text-[1.4rem]"
                  >
                    Get a Quote
                  </h2>
                  <p class="m-0 text-[0.93rem] leading-[1.6] text-slate-500">
                    Tell us about your job and we'll send someone out to give
                    you a fair, no-obligation quote.
                  </p>
                </div>

                <form novalidate @submit.prevent="handleSubmit">
                  <div
                    class="mb-[1.1rem] grid grid-cols-2 gap-4 max-[480px]:grid-cols-1"
                  >
                    <!-- Name -->
                    <div class="flex flex-col gap-[0.35rem]">
                      <label
                        class="text-[0.85rem] font-semibold text-slate-700"
                        for="quote-name"
                      >
                        Full Name
                        <span class="text-[#0d9488]" aria-hidden="true">*</span>
                      </label>
                      <input
                        id="quote-name"
                        v-model="form.name"
                        class="form-input w-full rounded-[10px] border border-slate-200 bg-slate-50 px-4 py-[0.7rem] font-[inherit] text-[0.95rem] text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-blue-700 focus:bg-white focus:shadow-[0_0_0_3px_rgba(29,78,216,0.12)]"
                        :class="{
                          'border-red-400 focus:shadow-[0_0_0_3px_rgba(248,113,113,0.2)]':
                            errors.name,
                        }"
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
                        class="m-0 text-[0.8rem] text-red-400"
                        role="alert"
                      >
                        {{ errors.name }}
                      </p>
                    </div>

                    <!-- Mobile -->
                    <div class="flex flex-col gap-[0.35rem]">
                      <label
                        class="text-[0.85rem] font-semibold text-slate-700"
                        for="quote-mobile"
                      >
                        Mobile
                        <span class="text-[#0d9488]" aria-hidden="true">*</span>
                      </label>
                      <input
                        id="quote-mobile"
                        v-model="form.mobile"
                        class="form-input w-full rounded-[10px] border border-slate-200 bg-slate-50 px-4 py-[0.7rem] font-[inherit] text-[0.95rem] text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-blue-700 focus:bg-white focus:shadow-[0_0_0_3px_rgba(29,78,216,0.12)]"
                        :class="{
                          'border-red-400 focus:shadow-[0_0_0_3px_rgba(248,113,113,0.2)]':
                            errors.mobile,
                        }"
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
                        class="m-0 text-[0.8rem] text-red-400"
                        role="alert"
                      >
                        {{ errors.mobile }}
                      </p>
                    </div>
                  </div>

                  <!-- Category -->
                  <div class="mb-[1.1rem] flex flex-col gap-[0.35rem]">
                    <label
                      class="text-[0.85rem] font-semibold text-slate-700"
                      for="quote-category"
                    >
                      Trade Category
                      <span class="text-[#0d9488]" aria-hidden="true">*</span>
                    </label>
                    <select
                      id="quote-category"
                      v-model="form.category"
                      class="form-input form-select w-full cursor-pointer rounded-[10px] border border-slate-200 bg-slate-50 px-4 py-[0.7rem] pr-10 font-[inherit] text-[0.95rem] text-slate-900 outline-none transition-all duration-200 focus:border-blue-700 focus:bg-white focus:shadow-[0_0_0_3px_rgba(29,78,216,0.12)]"
                      :class="{ 'border-red-400': errors.category }"
                      :aria-describedby="
                        errors.category ? 'category-error' : undefined
                      "
                      :aria-invalid="!!errors.category"
                    >
                      <option value="" disabled>Select a trade…</option>
                      <option
                        v-for="trade in trades"
                        :key="trade"
                        :value="trade"
                      >
                        {{ trade }}
                      </option>
                    </select>
                    <p
                      v-if="errors.category"
                      id="category-error"
                      class="m-0 text-[0.8rem] text-red-400"
                      role="alert"
                    >
                      {{ errors.category }}
                    </p>
                  </div>

                  <!-- Job Description -->
                  <div class="mb-[1.1rem] flex flex-col gap-[0.35rem]">
                    <label
                      class="text-[0.85rem] font-semibold text-slate-700"
                      for="quote-job"
                    >
                      Job Description
                      <span class="text-[#0d9488]" aria-hidden="true">*</span>
                    </label>
                    <textarea
                      id="quote-job"
                      v-model="form.jobDescription"
                      class="form-input w-full resize-y rounded-[10px] border border-slate-200 bg-slate-50 px-4 py-[0.7rem] font-[inherit] text-[0.95rem] text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-blue-700 focus:bg-white focus:shadow-[0_0_0_3px_rgba(29,78,216,0.12)]"
                      :class="{ 'border-red-400': errors.jobDescription }"
                      rows="4"
                      style="min-height: 100px"
                      placeholder="e.g. Full bathroom retile — floor and walls, approx 5m². Also need the existing tiles removed."
                      :aria-describedby="
                        errors.jobDescription ? 'job-error' : undefined
                      "
                      :aria-invalid="!!errors.jobDescription"
                    />
                    <p
                      v-if="errors.jobDescription"
                      id="job-error"
                      class="m-0 text-[0.8rem] text-red-400"
                      role="alert"
                    >
                      {{ errors.jobDescription }}
                    </p>
                  </div>

                  <button
                    type="submit"
                    class="modal-btn w-full cursor-pointer rounded-[10px] border-none px-8 py-[0.9rem] font-[inherit] text-base font-semibold text-white transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-70"
                    :disabled="submitting"
                    :aria-busy="submitting"
                  >
                    <span
                      v-if="submitting"
                      class="btn-spinner mr-2 inline-block"
                      aria-hidden="true"
                    />
                    {{
                      submitting ? 'Sending your request…' : 'Request My Quote'
                    }}
                  </button>

                  <p
                    class="mt-[0.85rem] text-center text-[0.78rem] leading-[1.5] text-slate-400"
                  >
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
/* Teal button with shadow */
.modal-btn {
  background: #0d9488;
  box-shadow: 0 4px 20px rgba(13, 148, 136, 0.35);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.modal-btn:hover:not(:disabled) {
  background: #0f766e;
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(13, 148, 136, 0.5);
}

/* Select custom arrow */
.form-select {
  appearance: none;
  -webkit-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.85rem center;
}

/* Spinner */
.btn-spinner {
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

/* Transitions */
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
</style>
