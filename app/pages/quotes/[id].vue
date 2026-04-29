<script setup lang="ts">
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { statuses } from '~/data/statuses';

definePageMeta({ middleware: 'auth' });

const { $firestore } = useNuxtApp();
const route = useRoute();
const router = useRouter();

interface Quote {
  id: string;
  name: string;
  mobile: string;
  category: string;
  jobDescription: string;
  status: string;
  createdAt: { toDate: () => Date } | null;
}

const quote = ref<Quote | null>(null);
const loading = ref(true);
const error = ref('');
const updating = ref(false);
const updateError = ref('');
const modalOpen = ref(false);
const pendingStatus = ref('');

const openModal = () => {
  pendingStatus.value = quote.value?.status ?? '';
  modalOpen.value = true;
};

const closeModal = () => {
  modalOpen.value = false;
};

const saveStatus = async () => {
  if (!quote.value || pendingStatus.value === quote.value.status) return;
  const previous = quote.value.status;
  const next = pendingStatus.value;
  quote.value.status = next;
  updating.value = true;
  updateError.value = '';
  closeModal();
  try {
    const docRef = doc($firestore as any, 'quotes', quote.value.id);
    await updateDoc(docRef, { status: next });
  } catch (err) {
    console.error('Update error:', err);
    updateError.value = 'Failed to update status.';
    quote.value.status = previous;
  } finally {
    updating.value = false;
  }
};

const fetchQuote = async () => {
  loading.value = true;
  error.value = '';
  try {
    const docRef = doc($firestore as any, 'quotes', route.params.id as string);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) {
      error.value = 'Quote not found.';
    } else {
      quote.value = { id: snapshot.id, ...snapshot.data() } as Quote;
    }
  } catch (err) {
    console.error('Firestore error:', err);
    error.value = 'Failed to load quote.';
  } finally {
    loading.value = false;
  }
};

const formatDate = (ts: Quote['createdAt']) => {
  if (!ts) return '—';
  return ts.toDate().toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

onMounted(() => {
  fetchQuote();
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && modalOpen.value) closeModal();
  };
  window.addEventListener('keydown', onKey);
  onUnmounted(() => window.removeEventListener('keydown', onKey));
});
</script>

<template>
  <div class="detail">
    <main class="detail__main">
      <div v-if="loading" class="detail__status">Loading…</div>
      <div v-else-if="error" class="detail__status detail__status--error">
        {{ error }}
      </div>

      <div v-else-if="quote" class="card-wrap">
        <div class="card">
          <dl class="fields">
            <div class="fields__row">
              <dt class="fields__label">Date</dt>
              <dd class="fields__value">{{ formatDate(quote.createdAt) }}</dd>
            </div>
            <div class="fields__row">
              <dt class="fields__label">Name</dt>
              <dd class="fields__value">{{ quote.name }}</dd>
            </div>
            <div class="fields__row">
              <dt class="fields__label">Mobile</dt>
              <dd class="fields__value">
                <a :href="`tel:${quote.mobile}`" class="link">{{
                  quote.mobile
                }}</a>
              </dd>
            </div>
            <div class="fields__row">
              <dt class="fields__label">Category</dt>
              <dd class="fields__value">{{ quote.category }}</dd>
            </div>
            <div class="fields__row fields__row--status">
              <dt class="fields__label">Status</dt>
              <dd class="fields__value">
                <div class="status-row">
                  <span
                    class="badge"
                    :class="`badge--${quote.status.toLowerCase()}`"
                  >
                    <span v-if="updating" class="badge__spinner" />
                    <template v-else>{{ quote.status }}</template>
                  </span>
                  <button
                    class="btn btn--update"
                    :disabled="updating"
                    @click="openModal"
                  >
                    Update
                  </button>
                </div>
                <p v-if="updateError" class="status-error">{{ updateError }}</p>
              </dd>
            </div>
            <div class="fields__row fields__row--full">
              <dt class="fields__label">Job Description</dt>
              <dd class="fields__value fields__value--desc">
                {{ quote.jobDescription }}
              </dd>
            </div>
          </dl>
        </div>
        <button class="btn btn--back" @click="router.push('/quotes')">
          ← Back
        </button>
      </div>
    </main>
  </div>

  <!-- Status update modal -->
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="modalOpen"
        class="status-overlay"
        role="dialog"
        aria-modal="true"
        aria-labelledby="status-modal-title"
        @click.self="closeModal"
      >
        <Transition name="modal-slide">
          <div v-if="modalOpen" class="status-modal">
            <button
              class="status-modal__close"
              aria-label="Close"
              @click="closeModal"
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
            <div class="status-modal__body">
              <h2 id="status-modal-title" class="status-modal__title">
                Update Status
              </h2>
              <p class="status-modal__subtitle">
                Select a new status for this quote.
              </p>
              <div class="status-modal__options">
                <button
                  v-for="s in statuses"
                  :key="s"
                  class="status-modal__option"
                  :class="[
                    `status-modal__option--${s.toLowerCase()}`,
                    { 'status-modal__option--selected': s === pendingStatus },
                  ]"
                  @click="pendingStatus = s"
                >
                  <span class="status-modal__dot" />
                  {{ s }}
                  <svg
                    v-if="s === pendingStatus"
                    class="status-modal__tick"
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </button>
              </div>
              <div class="status-modal__actions">
                <button class="btn btn--ghost" @click="closeModal">
                  Cancel
                </button>
                <button
                  class="btn btn--primary"
                  :disabled="pendingStatus === quote?.status"
                  @click="saveStatus"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.detail {
  min-height: 100svh;
  background: #f8fafc;
  font-family: inherit;
  padding-top: 68px;
}

.detail__main {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.card-wrap {
  width: 100%;
  max-width: 640px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.card {
  width: 100%;
  max-width: 640px;
}

.detail__status {
  text-align: center;
  color: #64748b;
  padding: 3rem 1rem;
  font-size: 0.95rem;
}

.detail__status--error {
  color: #f87171;
}

.card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
}

.fields {
  margin: 0;
  padding: 0;
}

.fields__row {
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 0.5rem 1rem;
  padding: 0.9rem 1.25rem;
  border-bottom: 1px solid #f1f5f9;
}

.fields__row:last-child {
  border-bottom: none;
}

.fields__row--full {
  grid-template-columns: 1fr;
}

.fields__label {
  font-size: 0.78rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #64748b;
  padding-top: 0.1rem;
}

.fields__value {
  font-size: 0.9rem;
  color: #0f172a;
  margin: 0;
}

.fields__value--desc {
  white-space: pre-wrap;
  line-height: 1.6;
  margin-top: 0.4rem;
}

.link {
  color: #3b82f6;
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
}

.badge {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  white-space: nowrap;
}

.badge--pending {
  background: #fef9c3;
  color: #854d0e;
}

.badge--contacted {
  background: #dbeafe;
  color: #1e40af;
}

.badge--cancelled {
  background: #fee2e2;
  color: #991b1b;
}

.badge--closed {
  background: #dcfce7;
  color: #166534;
}

/* ── Status row ─────────────────────────────────────── */
.status-row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.badge__spinner {
  display: inline-block;
  width: 10px;
  height: 10px;
  border: 1.5px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  vertical-align: middle;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.status-error {
  font-size: 0.78rem;
  color: #f87171;
  margin: 0.35rem 0 0;
}

/* ── Status modal ───────────────────────────────────── */
.status-overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.status-modal {
  position: relative;
  width: 100%;
  max-width: 400px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.15);
}

.status-modal__close {
  position: absolute;
  top: 1rem;
  right: 1rem;
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
}

.status-modal__close:hover {
  background: #e2e8f0;
  color: #0f172a;
}

.status-modal__body {
  padding: 1.75rem 1.75rem 1.5rem;
}

.status-modal__title {
  font-size: 1.3rem;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.02em;
  margin: 0 0 0.35rem;
  padding-right: 2.5rem;
}

.status-modal__subtitle {
  font-size: 0.88rem;
  color: #64748b;
  margin: 0 0 1.25rem;
}

.status-modal__options {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.status-modal__option {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
  font-weight: 600;
  font-family: inherit;
  border-radius: 10px;
  border: 1.5px solid #e2e8f0;
  background: #f8fafc;
  color: #0f172a;
  cursor: pointer;
  transition:
    border-color 0.15s,
    background 0.15s;
  text-align: left;
}

.status-modal__option:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

.status-modal__option--selected {
  border-color: #0d9488;
  background: #f0fdfa;
}

.status-modal__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.status-modal__option--pending .status-modal__dot {
  background: #f59e0b;
}
.status-modal__option--contacted .status-modal__dot {
  background: #3b82f6;
}
.status-modal__option--cancelled .status-modal__dot {
  background: #ef4444;
}
.status-modal__option--closed .status-modal__dot {
  background: #22c55e;
}

.status-modal__tick {
  margin-left: auto;
  color: #0d9488;
  flex-shrink: 0;
}

.status-modal__actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}

/* Modal transitions */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-slide-enter-active,
.modal-slide-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
.modal-slide-enter-from,
.modal-slide-leave-to {
  opacity: 0;
  transform: translateY(12px);
}

/* ── Buttons ─────────────────────────────────────── */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.5rem 1rem;
  font-size: 0.85rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  border: none;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn--back {
  background: #0d9488;
  color: #fff;
  box-shadow: 0 2px 12px rgba(13, 148, 136, 0.3);
}

.btn--back:hover {
  background: #0f766e;
  transform: translateY(-1px);
}

.btn--update {
  background: transparent;
  border: 1.5px solid #0d9488;
  color: #0d9488;
  font-size: 0.78rem;
  padding: 0.2rem 0.65rem;
  border-radius: 6px;
}

.btn--update:hover:not(:disabled) {
  background: #f0fdfa;
}

.btn--primary {
  background: #0d9488;
  color: #fff;
  padding: 0.55rem 1.25rem;
  box-shadow: 0 2px 12px rgba(13, 148, 136, 0.25);
}

.btn--primary:hover:not(:disabled) {
  background: #0f766e;
}

.btn--ghost {
  background: #f1f5f9;
  color: #64748b;
  border: 1px solid #e2e8f0;
  padding: 0.55rem 1.25rem;
}

.btn--ghost:hover {
  background: #e2e8f0;
  color: #0f172a;
}
</style>
