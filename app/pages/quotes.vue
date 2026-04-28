<script setup lang="ts">
import { collection, getDocs, orderBy, query } from 'firebase/firestore';

definePageMeta({ middleware: 'auth' });

const { logout, user } = useAuth();
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
  } catch {
    error.value = 'Failed to load quotes.';
  } finally {
    loading.value = false;
  }
};

const handleLogout = async () => {
  await logout();
  router.push('/login');
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
    <header class="admin__header">
      <h1 class="admin__title">Quote Requests</h1>
      <div class="admin__user">
        <span class="admin__email">{{ user?.email }}</span>
        <button class="btn btn--outline" @click="handleLogout">Sign out</button>
      </div>
    </header>

    <main class="admin__main">
      <div v-if="loading" class="admin__status">Loading…</div>
      <div v-else-if="error" class="admin__status admin__status--error">
        {{ error }}
      </div>
      <div v-else-if="quotes.length === 0" class="admin__status">
        No quote requests yet.
      </div>

      <div v-else class="table-wrap">
        <table class="quotes-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Name</th>
              <th>Mobile</th>
              <th>Category</th>
              <th>Job Description</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="quote in quotes" :key="quote.id">
              <td class="td--date">{{ formatDate(quote.createdAt) }}</td>
              <td>{{ quote.name }}</td>
              <td class="td--nowrap">{{ quote.mobile }}</td>
              <td class="td--nowrap">{{ quote.category }}</td>
              <td class="td--desc">{{ quote.jobDescription }}</td>
              <td>
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
    </main>
  </div>
</template>

<style scoped>
.admin {
  min-height: 100svh;
  background: #f8fafc;
  font-family: inherit;
}

.admin__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.25rem 2rem;
  background: #fff;
  border-bottom: 1px solid #e2e8f0;
}

.admin__title {
  font-size: 1.25rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
  letter-spacing: -0.02em;
}

.admin__user {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.admin__email {
  font-size: 0.85rem;
  color: #64748b;
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

.quotes-table tbody tr:hover td {
  background: #f8fafc;
}

.td--date {
  white-space: nowrap;
  color: #64748b;
  font-size: 0.85rem;
}

.td--nowrap {
  white-space: nowrap;
}

.td--desc {
  max-width: 320px;
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

/* ── Buttons ─────────────────────────────────────── */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  font-size: 0.85rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}

.btn--outline {
  background: transparent;
  border: 1px solid #e2e8f0;
  color: #64748b;
}

.btn--outline:hover {
  background: #f1f5f9;
  color: #0f172a;
}
</style>
