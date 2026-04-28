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
  <div class="login-page">
    <div class="login-card">
      <h1 class="login-title">Sign in</h1>
      <form novalidate @submit.prevent="handleLogin">
        <div class="form__field">
          <label class="form__label" for="login-email">Email</label>
          <input
            id="login-email"
            v-model="email"
            class="form__input"
            type="email"
            autocomplete="email"
            required
          />
        </div>
        <div class="form__field">
          <label class="form__label" for="login-password">Password</label>
          <input
            id="login-password"
            v-model="password"
            class="form__input"
            type="password"
            autocomplete="current-password"
            required
          />
        </div>
        <p v-if="error" class="login-error" role="alert">{{ error }}</p>
        <button
          type="submit"
          class="btn btn--primary btn--full"
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
.login-page {
  min-height: 100svh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  padding: 1rem;
}

.login-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 2.5rem;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
}

.login-title {
  font-size: 1.6rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 1.75rem;
  letter-spacing: -0.02em;
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

.form__input {
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
}

.form__input:focus {
  border-color: #1d4ed8;
  box-shadow: 0 0 0 3px rgba(29, 78, 216, 0.12);
  background: #fff;
}

.login-error {
  font-size: 0.85rem;
  color: #f87171;
  margin: 0 0 1rem;
}

.btn {
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
  margin-top: 0.5rem;
}

.btn--primary {
  background: #0d9488;
  color: #fff;
  box-shadow: 0 4px 20px rgba(13, 148, 136, 0.35);
}

.btn--primary:hover:not(:disabled) {
  background: #0f766e;
  transform: translateY(-2px);
}

.btn--primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn--full {
  width: 100%;
}
</style>
