<script setup lang="ts">
import { reviews } from '~/data/reviews';

const { open: openQuoteModal } = useQuoteModal();

const visibleCount = 3;
const currentIndex = ref(0);
let autoplayTimer: ReturnType<typeof setInterval> | null = null;

const visibleReviews = computed(() => {
  return Array.from({ length: visibleCount }, (_, i) => {
    return reviews[(currentIndex.value + i) % reviews.length];
  });
});

const next = () => {
  currentIndex.value = (currentIndex.value + visibleCount) % reviews.length;
};

const prev = () => {
  currentIndex.value =
    (currentIndex.value - visibleCount + reviews.length) % reviews.length;
};

const startAutoplay = () => {
  autoplayTimer = setInterval(next, 4000);
};

const stopAutoplay = () => {
  if (autoplayTimer) clearInterval(autoplayTimer);
};

onMounted(startAutoplay);
onUnmounted(stopAutoplay);

useSeoMeta({
  title: 'Quote Any Job – Free Trades Quotes',
  description:
    "Need a decorator, plasterer, tiler or plumber? Submit your job and we'll send a trusted tradesperson to give you a free, no-obligation quote.",
});
</script>

<template>
  <main>
    <!-- Hero Section -->
    <section
      class="relative flex min-h-svh items-center overflow-hidden px-6 pt-[100px] pb-16"
      aria-labelledby="hero-heading"
    >
      <!-- Background -->
      <div class="pointer-events-none absolute inset-0" aria-hidden="true">
        <div class="hero-glow-1 absolute rounded-full opacity-25 blur-[80px]" />
        <div
          class="hero-glow-2 absolute rounded-full opacity-25 blur-[80px] sm:hidden"
        />
        <div class="hero-grid absolute inset-0" />
      </div>

      <div
        class="relative mx-auto flex w-full max-w-[800px] flex-col items-center gap-6 text-center"
      >
        <!-- Brand -->
        <p
          class="hero-brand m-0 font-extrabold tracking-[-0.02em] text-[#0d9488]"
        >
          Quote Any Job
        </p>

        <!-- Badge -->
        <div
          class="inline-flex items-center gap-2 rounded-full border border-[#0d9488] bg-[#f0fdfa] px-4 py-[0.4rem] text-[0.85rem] font-medium text-[#0f5148]"
          aria-label="Free service"
        >
          <span
            class="badge-dot h-[7px] w-[7px] rounded-full bg-[#0d9488]"
            aria-hidden="true"
          />
          Free quotes, no obligation
        </div>

        <!-- Heading -->
        <h1
          id="hero-heading"
          class="hero-title m-0 font-extrabold leading-[1.1] tracking-[-0.03em] text-slate-900"
        >
          Need a tradesperson?<br />
          <span class="hero-title-highlight">Get a free quote today</span>
        </h1>

        <!-- Subtitle -->
        <p class="hero-subtitle m-0 max-w-[580px] leading-[1.7] text-slate-500">
          Whether it's decorating, plastering, tiling, plumbing, or anything in
          between — tell us about your job and we'll send a trusted local
          tradesperson out to give you a fair, no-obligation quote.
        </p>

        <!-- Actions -->
        <div class="flex flex-wrap justify-center gap-3">
          <button
            class="btn-primary inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-[10px] border-none px-6 py-[0.7rem] font-semibold text-[0.95rem] text-white transition-all duration-200"
            aria-label="Get a free quote for your job"
            @click="openQuoteModal"
          >
            Get a Free Quote
            <svg
              class="btn-icon flex-shrink-0 transition-transform duration-200"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
          <a
            href="#how-it-works"
            class="inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-[10px] border border-[#1d4ed8] bg-white px-6 py-[0.7rem] font-semibold text-[0.95rem] text-[#1d4ed8] no-underline transition-all duration-200 hover:bg-[#dbeafe] hover:text-[#1e3a8a]"
            >See how it works</a
          >
        </div>

        <!-- Stats -->
        <div
          class="flex flex-wrap items-center justify-content-center gap-8 rounded-2xl border border-slate-200 bg-slate-50 px-10 py-6 max-[480px]:gap-5 max-[480px]:px-6"
          role="list"
          aria-label="Key statistics"
        >
          <div class="flex flex-col items-center gap-[0.2rem]" role="listitem">
            <span class="text-[1.75rem] font-bold leading-none text-[#1d4ed8]"
              >500+</span
            >
            <span class="text-[0.8rem] text-slate-500"
              >Trusted tradespeople</span
            >
          </div>
          <div
            class="stat-divider h-10 w-px bg-slate-200 max-[480px]:hidden"
            aria-hidden="true"
          />
          <div class="flex flex-col items-center gap-[0.2rem]" role="listitem">
            <span class="text-[1.75rem] font-bold leading-none text-[#1d4ed8]"
              >100%</span
            >
            <span class="text-[0.8rem] text-slate-500"
              >Free &amp; no obligation</span
            >
          </div>
          <div
            class="stat-divider h-10 w-px bg-slate-200 max-[480px]:hidden"
            aria-hidden="true"
          />
          <div class="flex flex-col items-center gap-[0.2rem]" role="listitem">
            <span class="text-[1.75rem] font-bold leading-none text-[#1d4ed8]"
              >24 hr</span
            >
            <span class="text-[0.8rem] text-slate-500">Response time</span>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works -->
    <section
      id="how-it-works"
      class="px-6 py-24"
      aria-labelledby="steps-heading"
    >
      <div class="mx-auto max-w-[1100px] text-center">
        <h2
          id="steps-heading"
          class="m-0 mb-3 text-[0.8rem] font-bold uppercase tracking-[0.15em] text-[#1d4ed8]"
        >
          How it works
        </h2>
        <p
          class="section-title m-0 mb-12 font-extrabold tracking-[-0.02em] text-slate-900"
        >
          Your quote in three easy steps
        </p>

        <div class="steps-grid grid gap-6">
          <article
            class="step-card relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 text-left transition-all duration-300 hover:-translate-y-1 hover:border-[#1d4ed8] hover:shadow-[0_8px_32px_rgba(29,78,216,0.1)]"
            aria-labelledby="step1-title"
          >
            <div
              class="mb-4 text-[0.75rem] font-bold tracking-[0.1em] text-[#93c5fd]"
              aria-hidden="true"
            >
              01
            </div>
            <div class="mb-4 text-[2rem] leading-none" aria-hidden="true">
              📋
            </div>
            <h3
              id="step1-title"
              class="m-0 mb-[0.6rem] text-[1.15rem] font-bold text-slate-900"
            >
              Describe Your Job
            </h3>
            <p class="m-0 text-[0.93rem] leading-[1.65] text-slate-500">
              Fill in your name, contact details, and a brief description of the
              work you need done — decorating, plastering, tiling, plumbing, and
              more.
            </p>
          </article>

          <article
            class="step-card relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 text-left transition-all duration-300 hover:-translate-y-1 hover:border-[#1d4ed8] hover:shadow-[0_8px_32px_rgba(29,78,216,0.1)]"
            aria-labelledby="step2-title"
          >
            <div
              class="mb-4 text-[0.75rem] font-bold tracking-[0.1em] text-[#93c5fd]"
              aria-hidden="true"
            >
              02
            </div>
            <div class="mb-4 text-[2rem] leading-none" aria-hidden="true">
              🔨
            </div>
            <h3
              id="step2-title"
              class="m-0 mb-[0.6rem] text-[1.15rem] font-bold text-slate-900"
            >
              We Find Your Tradesperson
            </h3>
            <p class="m-0 text-[0.93rem] leading-[1.65] text-slate-500">
              We match your job to a trusted, vetted local tradesperson and
              arrange for them to visit at a time that suits you.
            </p>
          </article>

          <article
            class="step-card relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 text-left transition-all duration-300 hover:-translate-y-1 hover:border-[#1d4ed8] hover:shadow-[0_8px_32px_rgba(29,78,216,0.1)]"
            aria-labelledby="step3-title"
          >
            <div
              class="mb-4 text-[0.75rem] font-bold tracking-[0.1em] text-[#93c5fd]"
              aria-hidden="true"
            >
              03
            </div>
            <div class="mb-4 text-[2rem] leading-none" aria-hidden="true">
              ✅
            </div>
            <h3
              id="step3-title"
              class="m-0 mb-[0.6rem] text-[1.15rem] font-bold text-slate-900"
            >
              Get Your Free Quote
            </h3>
            <p class="m-0 text-[0.93rem] leading-[1.65] text-slate-500">
              Your tradesperson visits, scopes the job, and provides a clear,
              itemised quote — completely free and with no obligation to
              proceed.
            </p>
          </article>
        </div>
      </div>
    </section>

    <!-- Reviews Carousel -->
    <section class="bg-slate-50 px-6 py-24" aria-labelledby="reviews-heading">
      <div class="mx-auto max-w-[1100px] text-center">
        <p
          class="m-0 mb-3 text-[0.8rem] font-bold uppercase tracking-[0.15em] text-[#1d4ed8]"
        >
          What our customers say
        </p>
        <h2
          id="reviews-heading"
          class="section-title m-0 mb-10 font-extrabold tracking-[-0.02em] text-slate-900"
        >
          Trusted by homeowners across the UK
        </h2>

        <div
          class="relative flex items-center gap-2"
          @mouseenter="stopAutoplay"
          @mouseleave="startAutoplay"
        >
          <button
            class="flex h-10 w-10 flex-shrink-0 cursor-pointer items-center justify-content-center rounded-full border border-slate-200 bg-white text-base text-slate-500 transition-all duration-200 hover:border-[#0d9488] hover:bg-[#0d9488] hover:text-white"
            aria-label="Previous reviews"
            @click="prev"
          >
            &#8592;
          </button>

          <Transition name="slide" mode="out-in">
            <div
              :key="currentIndex"
              class="reviews-grid min-w-0 flex-1 grid gap-6"
            >
              <article
                v-for="(review, i) in visibleReviews"
                :key="i"
                class="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-7 text-left"
              >
                <div
                  class="text-[1.1rem] tracking-[0.05em] text-amber-400"
                  aria-label="5 stars"
                >
                  ★★★★★
                </div>
                <p
                  class="m-0 flex-1 text-[0.92rem] leading-[1.65] text-slate-500"
                >
                  "{{ review?.text }}"
                </p>
                <span class="text-[0.85rem] font-semibold text-slate-900"
                  >— {{ review?.name }}</span
                >
              </article>
            </div>
          </Transition>

          <button
            class="flex h-10 w-10 flex-shrink-0 cursor-pointer items-center justify-content-center rounded-full border border-slate-200 bg-white text-base text-slate-500 transition-all duration-200 hover:border-[#0d9488] hover:bg-[#0d9488] hover:text-white"
            aria-label="Next reviews"
            @click="next"
          >
            &#8594;
          </button>
        </div>

        <div
          class="mt-6 flex justify-center gap-2"
          role="list"
          aria-label="Review pages"
        >
          <button
            v-for="(_, i) in Array.from({
              length: reviews.length / visibleCount,
            })"
            :key="i"
            class="h-2 w-2 cursor-pointer rounded-full border-none p-0 transition-all duration-200"
            :class="
              currentIndex === i * visibleCount
                ? 'scale-[1.3] bg-[#0d9488]'
                : 'bg-slate-300'
            "
            :aria-label="`Go to page ${i + 1}`"
            @click="currentIndex = i * visibleCount"
          />
        </div>
      </div>
    </section>

    <!-- CTA Banner -->
    <section class="px-6 py-20" aria-labelledby="cta-heading">
      <div
        class="mx-auto flex max-w-[700px] flex-col items-center gap-4 rounded-3xl bg-gradient-to-br from-[#1d4ed8] to-[#1e3a8a] px-10 py-16 text-center shadow-[0_8px_40px_rgba(29,78,216,0.25)] max-[480px]:px-6 max-[480px]:py-10"
      >
        <h2
          id="cta-heading"
          class="cta-title m-0 font-extrabold tracking-[-0.02em] text-white"
        >
          Ready to get your job quoted?
        </h2>
        <p class="m-0 mb-2 max-w-[460px] text-base text-white/75">
          It takes less than a minute. Tell us what you need done and we'll take
          care of the rest.
        </p>
        <button
          class="btn-primary inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-[10px] border-none px-8 py-[0.9rem] text-base font-semibold text-white transition-all duration-200"
          aria-label="Request a free quote now"
          @click="openQuoteModal"
        >
          Request a Free Quote
        </button>
      </div>
    </section>
  </main>
</template>

<style scoped>
/* clamp fluid sizes — not expressible as standard Tailwind utilities */
.hero-brand {
  font-size: clamp(3rem, 8vw, 6rem);
}

.hero-title {
  font-size: clamp(2.5rem, 6vw, 4.5rem);
}

.hero-subtitle {
  font-size: clamp(1rem, 2vw, 1.2rem);
}

.hero-title-highlight {
  background: linear-gradient(135deg, #1d4ed8 0%, #1e3a8a 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.section-title {
  font-size: clamp(1.75rem, 4vw, 2.75rem);
}

.cta-title {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
}

/* Decorative glows */
.hero-glow-1 {
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, #bfdbfe, transparent);
  top: -150px;
  left: -100px;
}

.hero-glow-2 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, #99f6e4, transparent);
  bottom: -100px;
  right: -80px;
}

.hero-grid {
  background-image:
    linear-gradient(rgba(29, 78, 216, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(29, 78, 216, 0.05) 1px, transparent 1px);
  background-size: 60px 60px;
}

/* Step card pseudo-element hover overlay */
.step-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(29, 78, 216, 0.04), transparent);
  opacity: 0;
  transition: opacity 0.3s;
}

.step-card:hover::before {
  opacity: 1;
}

/* Steps auto-fit grid */
.steps-grid {
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
}

/* Primary button */
.btn-primary {
  background: #0d9488;
  box-shadow: 0 4px 20px rgba(13, 148, 136, 0.35);
  font-family: inherit;
}

.btn-primary:hover {
  background: #0f766e;
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(13, 148, 136, 0.5);
}

.btn-primary:hover .btn-icon {
  transform: translateX(3px);
}

/* Badge dot pulse animation */
.badge-dot {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
}

/* Reviews grid responsive */
.reviews-grid {
  grid-template-columns: repeat(3, 1fr);
}

@media (max-width: 768px) {
  .reviews-grid {
    grid-template-columns: 1fr;
  }

  .reviews-grid article:nth-child(n + 2) {
    display: none;
  }
}

/* Slide carousel transition */
.slide-enter-active,
.slide-leave-active {
  transition:
    opacity 0.35s ease,
    transform 0.35s ease;
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>
