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
  <div class="admin">
    <main class="admin__main">
      <div v-if="loading" class="admin__status">Loading…</div>
      <div v-else-if="error" class="admin__status admin__status--error">
        {{ error }}
      </div>
      <div v-else-if="quotes.length === 0" class="admin__status">
        No quote requests yet.
      </div>

      <template v-else>
        <div class="filter-bar">
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

        <div v-if="filteredQuotes.length === 0" class="admin__status">
          No quotes with status "{{ activeFilter }}".
        </div>

        <div v-else class="table-wrap">
          <table class="quotes-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Name</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="quote in filteredQuotes"
                :key="quote.id"
                class="quotes-table__row"
                @click="router.push(`/quotes/${quote.id}`)"
              >
                <td class="td--date">{{ formatDate(quote.createdAt) }}</td>
                <td>{{ quote.name }}</td>
                <td>
                  <span
                    class="badge"
                    :class="`badge--${quote.status.toLowerCase()}`"
                    >{{ quote.status }}</span
                  >
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
.admin {
  min-height: 100svh;
  background: #f8fafc;
  font-family: inherit;
  padding-top: 68px;
}

.admin__main {
  padding: 2rem;
}

.admin__status {
  text-align: center;
  color: #64748b;
  padding: 3rem 1rem;
  font-size: 0.95rem;
}

.admin__status--error {
  color: #f87171;
}

.table-wrap {
  overflow-x: auto;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  background: #fff;
}

.quotes-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.quotes-table th {
  text-align: left;
  padding: 0.85rem 1rem;
  font-size: 0.78rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #64748b;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  white-space: nowrap;
}

.quotes-table td {
  padding: 0.85rem 1rem;
  color: #0f172a;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: top;
}

.quotes-table tbody tr:last-child td {
  border-bottom: none;
}

.quotes-table__row {
  cursor: pointer;
}

.quotes-table__row:hover td {
  background: #f1f5f9;
}

.td--date {
  white-space: nowrap;
  color: #64748b;
  font-size: 0.85rem;
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

/* ── Filter bar ─────────────────────────────────────── */
.filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
}

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

.filter-pill--pending {
  border-color: #0d9488;
  color: #0d9488;
}
.filter-pill--contacted {
  border-color: #0d9488;
  color: #0d9488;
}
.filter-pill--cancelled {
  border-color: #0d9488;
  color: #0d9488;
}
.filter-pill--closed {
  border-color: #0d9488;
  color: #0d9488;
}
</style>
