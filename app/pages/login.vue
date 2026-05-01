<script setup lang="ts">
definePageMeta({ layout: false });

const { login } = useAuth();
const router = useRouter();
const route = useRoute();

const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

const handleLogin = async () => {
  error.value = '';
  loading.value = true;
  try {
    await login(email.value, password.value);
    const redirect =
      typeof route.query.redirect === 'string'
        ? route.query.redirect
        : '/quotes';
    await router.push(redirect);
  } catch {
    error.value = 'Invalid email or password.';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="flex min-h-svh items-center justify-center bg-slate-50 p-4">
    <div
      class="w-full max-w-[400px] rounded-2xl border border-slate-200 bg-white p-10 shadow-[0_8px_32px_rgba(0,0,0,0.08)]"
    >
      <h1
        class="mb-7 mt-0 text-[1.6rem] font-extrabold tracking-[-0.02em] text-slate-900"
      >
        Sign in
      </h1>
      <form novalidate @submit.prevent="handleLogin">
        <div class="mb-[1.1rem] flex flex-col gap-[0.35rem]">
          <label
            class="text-[0.85rem] font-semibold text-slate-700"
            for="login-email"
            >Email</label
          >
          <input
            id="login-email"
            v-model="email"
            class="login-input"
            type="email"
            autocomplete="email"
            required
          />
        </div>
        <div class="mb-[1.1rem] flex flex-col gap-[0.35rem]">
          <label
            class="text-[0.85rem] font-semibold text-slate-700"
            for="login-password"
            >Password</label
          >
          <input
            id="login-password"
            v-model="password"
            class="login-input"
            type="password"
            autocomplete="current-password"
            required
          />
        </div>
        <p
          v-if="error"
          class="mb-4 mt-0 text-[0.85rem] text-red-400"
          role="alert"
        >
          {{ error }}
        </p>
        <button
          type="submit"
          class="login-btn mt-2 w-full"
          :disabled="loading"
          :aria-busy="loading"
        >
          {{ loading ? 'Signing in…' : 'Sign in' }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-input {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  color: #0f172a;
  font-size: 0.95rem;
  padding: 0.7rem 1rem;
  width: 100%;
  font-family: inherit;
  outline: none;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
  box-sizing: border-box;
}

.login-input:focus {
  border-color: #1d4ed8;
  box-shadow: 0 0 0 3px rgba(29, 78, 216, 0.12);
  background: #fff;
}

.login-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  font-size: 0.95rem;
  font-weight: 600;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  font-family: inherit;
  background: #0d9488;
  color: #fff;
  box-shadow: 0 4px 20px rgba(13, 148, 136, 0.35);
}

.login-btn:hover:not(:disabled) {
  background: #0f766e;
  transform: translateY(-2px);
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
