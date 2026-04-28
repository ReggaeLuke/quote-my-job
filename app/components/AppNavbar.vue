<script setup lang="ts">
const isMenuOpen = ref(false);
const { open: openQuoteModal } = useQuoteModal();

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

const navLinks = [{ label: 'Home', to: '/' }];
</script>

<template>
  <header class="navbar" role="banner">
    <div class="navbar__container">
      <!-- Logo -->
      <NuxtLink
        to="/"
        class="navbar__logo"
        aria-label="Quote Any Job - Home"
        @click="closeMenu"
      >
        <span class="navbar__logo-icon" aria-hidden="true">⚡</span>
        <span class="navbar__logo-text">Quote Any Job</span>
      </NuxtLink>

      <!-- Desktop Nav -->
      <nav class="navbar__links" aria-label="Main navigation">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="navbar__link"
          active-class="navbar__link--active"
        >
          {{ link.label }}
        </NuxtLink>
        <button class="navbar__cta" @click="handleQuoteCta">Get a Quote</button>
      </nav>

      <!-- Hamburger Button -->
      <button
        class="navbar__hamburger"
        :class="{ 'navbar__hamburger--open': isMenuOpen }"
        :aria-expanded="isMenuOpen"
        aria-controls="mobile-menu"
        aria-label="Toggle navigation menu"
        @click="toggleMenu"
      >
        <span class="navbar__hamburger-bar" />
        <span class="navbar__hamburger-bar" />
        <span class="navbar__hamburger-bar" />
      </button>
    </div>

    <!-- Mobile Menu -->
    <Transition name="mobile-menu">
      <nav
        v-if="isMenuOpen"
        id="mobile-menu"
        class="navbar__mobile"
        aria-label="Mobile navigation"
      >
        <NuxtLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="navbar__mobile-link"
          active-class="navbar__mobile-link--active"
          @click="closeMenu"
        >
          {{ link.label }}
        </NuxtLink>
        <button class="navbar__mobile-cta" @click="handleQuoteCta">
          Get a Quote
        </button>
      </nav>
    </Transition>
  </header>
</template>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid #e2e8f0;
}

.navbar__container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  height: 68px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Logo */
.navbar__logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: #0f172a;
  font-weight: 700;
  font-size: 1.15rem;
  letter-spacing: -0.01em;
  transition: opacity 0.2s;
}

.navbar__logo:hover {
  opacity: 0.85;
}

.navbar__logo-icon {
  font-size: 1.4rem;
  line-height: 1;
}

.navbar__logo-text {
  background: linear-gradient(135deg, #1d4ed8 0%, #1e3a8a 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Desktop links */
.navbar__links {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.navbar__link {
  color: #475569;
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 500;
  padding: 0.4rem 0.85rem;
  border-radius: 6px;
  transition:
    color 0.2s,
    background 0.2s;
}

.navbar__link:hover,
.navbar__link--active {
  color: #1d4ed8;
  background: #dbeafe;
}

.navbar__cta {
  margin-left: 0.75rem;
  padding: 0.5rem 1.25rem;
  background: #0d9488;
  color: #fff;
  font-size: 0.9rem;
  font-weight: 700;
  font-family: inherit;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition:
    background 0.2s,
    transform 0.15s;
  box-shadow: 0 2px 12px rgba(13, 148, 136, 0.3);
}

.navbar__cta:hover {
  background: #0f766e;
  transform: translateY(-1px);
}

/* Hamburger */
.navbar__hamburger {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: background 0.2s;
}

.navbar__hamburger:hover {
  background: #f1f5f9;
}

.navbar__hamburger-bar {
  display: block;
  width: 22px;
  height: 2px;
  background: #0f172a;
  border-radius: 2px;
  transition:
    transform 0.3s,
    opacity 0.3s;
  transform-origin: center;
}

.navbar__hamburger--open .navbar__hamburger-bar:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}

.navbar__hamburger--open .navbar__hamburger-bar:nth-child(2) {
  opacity: 0;
  transform: scaleX(0);
}

.navbar__hamburger--open .navbar__hamburger-bar:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}

/* Mobile menu */
.navbar__mobile {
  display: flex;
  flex-direction: column;
  padding: 0.75rem 1.5rem 1.25rem;
  border-top: 1px solid #e2e8f0;
  background: #fff;
  gap: 0.25rem;
}

.navbar__mobile-link {
  color: #475569;
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;
  padding: 0.75rem 0.85rem;
  border-radius: 8px;
  transition:
    color 0.2s,
    background 0.2s;
}

.navbar__mobile-link:hover,
.navbar__mobile-link--active {
  color: #1d4ed8;
  background: #dbeafe;
}

.navbar__mobile-cta {
  margin-top: 0.5rem;
  padding: 0.8rem 1.25rem;
  background: #0d9488;
  color: #fff;
  font-size: 0.95rem;
  font-weight: 700;
  font-family: inherit;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  text-align: center;
  transition: background 0.2s;
  box-shadow: 0 2px 12px rgba(13, 148, 136, 0.25);
}

.navbar__mobile-cta:hover {
  background: #0f766e;
}

/* Transition */
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

/* Responsive */
@media (max-width: 640px) {
  .navbar__links {
    display: none;
  }

  .navbar__hamburger {
    display: flex;
  }
}
</style>
