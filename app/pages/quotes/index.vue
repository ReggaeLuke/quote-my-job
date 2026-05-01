<script setup lang="ts">
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { statuses } from '~/data/statuses';

definePageMeta({ middleware: 'auth' });

const { $firestore } = useNuxtApp();
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

const quotes = ref<Quote[]>([]);
const loading = ref(true);
const error = ref('');
const activeFilter = ref<string | null>(null);

const filteredQuotes = computed(() =>
  activeFilter.value
    ? quotes.value.filter(
        (q) => q.status.toLowerCase() === activeFilter.value!.toLowerCase(),
      )
    : quotes.value,
);

const fetchQuotes = async () => {
  loading.value = true;
  error.value = '';
  try {
    const q = query(
      collection($firestore as any, 'quotes'),
      orderBy('createdAt', 'desc'),
    );
    const snapshot = await getDocs(q);
    quotes.value = snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() }) as Quote,
    );
  } catch (err) {
    console.error('Firestore error:', err);
    error.value = 'Failed to load quotes.';
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

onMounted(fetchQuotes);
</script>

<template>
  <div class="min-h-svh bg-slate-50 pt-[68px]">
    <main class="p-8">
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
      <div
        v-else-if="quotes.length === 0"
        class="px-4 py-12 text-center text-[0.95rem] text-slate-500"
      >
        No quote requests yet.
      </div>

      <template v-else>
        <div class="mb-5 flex flex-wrap gap-2">
          <button
            class="filter-pill"
            :class="{ 'filter-pill--active': activeFilter === null }"
            @click="activeFilter = null"
          >
            All
          </button>
          <button
            v-for="status in statuses"
            :key="status"
            class="filter-pill"
            :class="[
              `filter-pill--${status.toLowerCase()}`,
              { 'filter-pill--active': activeFilter === status },
            ]"
            @click="activeFilter = activeFilter === status ? null : status"
          >
            {{ status }}
          </button>
        </div>

        <div
          v-if="filteredQuotes.length === 0"
          class="px-4 py-12 text-center text-[0.95rem] text-slate-500"
        >
          No quotes with status "{{ activeFilter }}".
        </div>

        <div
          v-else
          class="overflow-x-auto rounded-xl border border-slate-200 bg-white"
        >
          <table class="w-full border-collapse text-[0.9rem]">
            <thead>
              <tr>
                <th
                  class="border-b border-slate-200 bg-slate-50 px-4 py-[0.85rem] text-left text-[0.78rem] font-semibold uppercase tracking-[0.05em] whitespace-nowrap text-slate-500"
                >
                  Date
                </th>
                <th
                  class="border-b border-slate-200 bg-slate-50 px-4 py-[0.85rem] text-left text-[0.78rem] font-semibold uppercase tracking-[0.05em] whitespace-nowrap text-slate-500"
                >
                  Name
                </th>
                <th
                  class="border-b border-slate-200 bg-slate-50 px-4 py-[0.85rem] text-left text-[0.78rem] font-semibold uppercase tracking-[0.05em] whitespace-nowrap text-slate-500"
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="quote in filteredQuotes"
                :key="quote.id"
                class="group cursor-pointer"
                @click="router.push(`/quotes/${quote.id}`)"
              >
                <td
                  class="border-b border-slate-100 px-4 py-[0.85rem] align-top whitespace-nowrap text-[0.85rem] text-slate-500 group-hover:bg-slate-100"
                >
                  {{ formatDate(quote.createdAt) }}
                </td>
                <td
                  class="border-b border-slate-100 px-4 py-[0.85rem] align-top text-slate-900 group-hover:bg-slate-100"
                >
                  {{ quote.name }}
                </td>
                <td
                  class="border-b border-slate-100 px-4 py-[0.85rem] align-top group-hover:bg-slate-100"
                >
                  <span
                    class="badge"
                    :class="`badge--${quote.status.toLowerCase()}`"
                  >
                    {{ quote.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </main>
  </div>
</template>

<style scoped>
/* ── Filter pills ───────────────────────────────────── */
.filter-pill {
  padding: 0.35rem 0.9rem;
  font-size: 0.8rem;
  font-weight: 600;
  font-family: inherit;
  border-radius: 999px;
  border: 1.5px solid #e2e8f0;
  background: #fff;
  color: #64748b;
  cursor: pointer;
  transition: all 0.15s ease;
}

.filter-pill:hover {
  border-color: #94a3b8;
  color: #0f172a;
}

.filter-pill--active {
  border-color: #0d9488 !important;
  background: #0d9488 !important;
  color: #fff !important;
}

.filter-pill--pending,
.filter-pill--contacted,
.filter-pill--cancelled,
.filter-pill--closed {
  border-color: #0d9488;
  color: #0d9488;
}

/* ── Table last row ─────────────────────────────────── */
tbody tr:last-child td {
  border-bottom: none;
}

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
</style>
