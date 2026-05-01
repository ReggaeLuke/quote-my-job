<script setup lang="ts">
const isMenuOpen = ref(false);
const { open: openQuoteModal } = useQuoteModal();
const { logout, user } = useAuth();
const route = useRoute();
const router = useRouter();

const isQuotesRoute = computed(() => route.path.startsWith('/quotes'));

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};

const handleQuoteCta = () => {
  closeMenu();
  openQuoteModal();
};

const handleLogout = async () => {
  await logout();
  router.push('/login');
};
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-[100] border-b border-slate-200 bg-white/90 backdrop-blur-[16px]"
    role="banner"
  >
    <div
      class="mx-auto flex h-[68px] max-w-[1200px] items-center justify-between px-6"
    >
      <!-- Logo -->
      <NuxtLink
        to="/"
        class="flex flex-shrink-0 items-center gap-2 no-underline opacity-100 transition-opacity duration-200 hover:opacity-85"
        aria-label="Quote Any Job - Home"
        @click="closeMenu"
      >
        <img
          src="/QAJ_Tick.png"
          alt=""
          class="block h-[80px] w-auto flex-shrink-0"
          aria-hidden="true"
        />
      </NuxtLink>

      <!-- Desktop Nav -->
      <nav
        class="hidden items-center gap-2 sm:flex"
        aria-label="Main navigation"
      >
        <template v-if="isQuotesRoute">
          <span class="px-2 text-[0.85rem] text-slate-500">{{
            user?.email
          }}</span>
          <button
            class="navbar-btn cursor-pointer rounded-lg border-none px-5 py-2 font-semibold text-[0.85rem] text-white transition-all duration-200 hover:-translate-y-px"
            @click="handleLogout"
          >
            Sign out
          </button>
        </template>
        <template v-else>
          <button
            class="navbar-btn ml-3 cursor-pointer rounded-lg border-none px-5 py-2 font-bold text-[0.9rem] text-white transition-all duration-200 hover:-translate-y-px"
            @click="handleQuoteCta"
          >
            Get a Quote
          </button>
        </template>
      </nav>

      <!-- Hamburger Button -->
      <button
        class="hamburger flex cursor-pointer flex-col justify-center gap-[5px] rounded-md border-none bg-transparent p-2 transition-colors duration-200 hover:bg-slate-100 sm:hidden"
        :class="{ 'hamburger--open': isMenuOpen }"
        :aria-expanded="isMenuOpen"
        aria-controls="mobile-menu"
        aria-label="Toggle navigation menu"
        @click="toggleMenu"
      >
        <span
          class="bar block h-[2px] w-[22px] origin-center rounded-sm bg-slate-900 transition-all duration-300"
        />
        <span
          class="bar block h-[2px] w-[22px] origin-center rounded-sm bg-slate-900 transition-all duration-300"
        />
        <span
          class="bar block h-[2px] w-[22px] origin-center rounded-sm bg-slate-900 transition-all duration-300"
        />
      </button>
    </div>

    <!-- Mobile Menu -->
    <Transition name="mobile-menu">
      <nav
        v-if="isMenuOpen"
        id="mobile-menu"
        class="flex flex-col gap-1 border-t border-slate-200 bg-white px-6 pb-5 pt-3"
        aria-label="Mobile navigation"
      >
        <button
          class="navbar-btn mt-2 w-full cursor-pointer rounded-lg border-none py-[0.8rem] font-bold text-[0.95rem] text-white transition-colors duration-200"
          @click="handleQuoteCta"
        >
          Get a Quote
        </button>
      </nav>
    </Transition>
  </header>
</template>

<style scoped>
/* Teal CTA button with shadow — not expressible as plain Tailwind */
.navbar-btn {
  background: #0d9488;
  box-shadow: 0 2px 12px rgba(13, 148, 136, 0.3);
  font-family: inherit;
}

.navbar-btn:hover {
  background: #0f766e;
}

/* Hamburger open animation */
.hamburger--open .bar:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}

.hamburger--open .bar:nth-child(2) {
  opacity: 0;
  transform: scaleX(0);
}

.hamburger--open .bar:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}

/* Mobile menu transition */
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
