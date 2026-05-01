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
  <div class="min-h-svh bg-slate-50 pt-[68px]">
    <main class="flex flex-col items-center p-8">
      <div
        v-if="loading"
        class="px-4 py-12 text-center text-[0.95rem] text-slate-500"
      >
        Loading…
      </div>
      <div
        v-else-if="error"
        class="px-4 py-12 text-center text-[0.95rem] text-red-400"
      >
        {{ error }}
      </div>

      <div v-else-if="quote" class="flex w-full max-w-[640px] flex-col gap-4">
        <div
          class="w-full overflow-hidden rounded-xl border border-slate-200 bg-white"
        >
          <dl class="m-0 p-0">
            <div
              class="grid grid-cols-[100px_1fr] gap-x-4 gap-y-2 border-b border-slate-100 px-4 py-[0.9rem]"
            >
              <dt
                class="pt-[0.1rem] text-[0.78rem] font-semibold uppercase tracking-[0.05em] text-slate-500"
              >
                Date
              </dt>
              <dd class="m-0 text-[0.9rem] text-slate-900">
                {{ formatDate(quote.createdAt) }}
              </dd>
            </div>
            <div
              class="grid grid-cols-[100px_1fr] gap-x-4 gap-y-2 border-b border-slate-100 px-4 py-[0.9rem]"
            >
              <dt
                class="pt-[0.1rem] text-[0.78rem] font-semibold uppercase tracking-[0.05em] text-slate-500"
              >
                Name
              </dt>
              <dd class="m-0 text-[0.9rem] text-slate-900">{{ quote.name }}</dd>
            </div>
            <div
              class="grid grid-cols-[100px_1fr] gap-x-4 gap-y-2 border-b border-slate-100 px-4 py-[0.9rem]"
            >
              <dt
                class="pt-[0.1rem] text-[0.78rem] font-semibold uppercase tracking-[0.05em] text-slate-500"
              >
                Mobile
              </dt>
              <dd class="m-0 text-[0.9rem] text-slate-900">
                <a
                  :href="`tel:${quote.mobile}`"
                  class="text-blue-500 no-underline hover:underline"
                >
                  {{ quote.mobile }}
                </a>
              </dd>
            </div>
            <div
              class="grid grid-cols-[100px_1fr] gap-x-4 gap-y-2 border-b border-slate-100 px-4 py-[0.9rem]"
            >
              <dt
                class="pt-[0.1rem] text-[0.78rem] font-semibold uppercase tracking-[0.05em] text-slate-500"
              >
                Category
              </dt>
              <dd class="m-0 text-[0.9rem] text-slate-900">
                {{ quote.category }}
              </dd>
            </div>
            <div
              class="grid grid-cols-[100px_1fr] gap-x-4 gap-y-2 border-b border-slate-100 px-4 py-[0.9rem]"
            >
              <dt
                class="pt-[0.1rem] text-[0.78rem] font-semibold uppercase tracking-[0.05em] text-slate-500"
              >
                Status
              </dt>
              <dd class="m-0 text-[0.9rem] text-slate-900">
                <div class="flex items-center gap-[0.6rem]">
                  <span
                    class="badge"
                    :class="`badge--${quote.status.toLowerCase()}`"
                  >
                    <span v-if="updating" class="badge-spinner" />
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
                <p
                  v-if="updateError"
                  class="mb-0 mt-[0.35rem] text-[0.78rem] text-red-400"
                >
                  {{ updateError }}
                </p>
              </dd>
            </div>
            <div class="grid grid-cols-1 px-4 py-[0.9rem]">
              <dt
                class="pt-[0.1rem] text-[0.78rem] font-semibold uppercase tracking-[0.05em] text-slate-500"
              >
                Job Description
              </dt>
              <dd
                class="m-0 mt-[0.4rem] whitespace-pre-wrap text-[0.9rem] leading-[1.6] text-slate-900"
              >
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
        class="fixed inset-0 z-[200] flex items-center justify-center p-4 backdrop-blur-[6px]"
        style="background: rgba(0, 0, 0, 0.6)"
        role="dialog"
        aria-modal="true"
        aria-labelledby="status-modal-title"
        @click.self="closeModal"
      >
        <Transition name="modal-slide">
          <div
            v-if="modalOpen"
            class="relative w-full max-w-[400px] rounded-[20px] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(0,0,0,0.15)]"
          >
            <button
              class="status-close absolute right-4 top-4 flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-slate-100 text-slate-500"
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
            <div class="px-7 pb-6 pt-7">
              <h2
                id="status-modal-title"
                class="mb-[0.35rem] mt-0 pr-10 text-[1.3rem] font-extrabold tracking-[-0.02em] text-slate-900"
              >
                Update Status
              </h2>
              <p class="mb-5 mt-0 text-[0.88rem] text-slate-500">
                Select a new status for this quote.
              </p>
              <div class="mb-6 flex flex-col gap-2">
                <button
                  v-for="s in statuses"
                  :key="s"
                  class="status-option"
                  :class="[
                    `status-option--${s.toLowerCase()}`,
                    { 'status-option--selected': s === pendingStatus },
                  ]"
                  @click="pendingStatus = s"
                >
                  <span class="status-dot" />
                  {{ s }}
                  <svg
                    v-if="s === pendingStatus"
                    class="ml-auto shrink-0 text-[#0d9488]"
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
              <div class="flex justify-end gap-3">
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
/* ── Badges ─────────────────────────────────────────── */
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

.badge-spinner {
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

/* ── Close button ───────────────────────────────────── */
.status-close:hover {
  background: #e2e8f0;
  color: #0f172a;
}

/* ── Status option buttons ──────────────────────────── */
.status-option {
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

.status-option:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

.status-option--selected {
  border-color: #0d9488;
  background: #f0fdfa;
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.status-option--pending .status-dot {
  background: #f59e0b;
}
.status-option--contacted .status-dot {
  background: #3b82f6;
}
.status-option--cancelled .status-dot {
  background: #ef4444;
}
.status-option--closed .status-dot {
  background: #22c55e;
}

/* ── Buttons ────────────────────────────────────────── */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
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
  padding: 0.5rem 1rem;
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

/* ── Modal transitions ──────────────────────────────── */
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
</style>
