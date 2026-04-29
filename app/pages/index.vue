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
    <section class="hero" aria-labelledby="hero-heading">
      <div class="hero__bg" aria-hidden="true">
        <div class="hero__glow hero__glow--1" />
        <div class="hero__glow hero__glow--2" />
        <div class="hero__grid" />
      </div>

      <div class="hero__container">
        <div class="hero__badge" aria-label="Free service">
          <span class="hero__badge-dot" aria-hidden="true" />
          Free quotes, no obligation
        </div>

        <h1 id="hero-heading" class="hero__title">
          Need a tradesperson?<br />
          <span class="hero__title-highlight">Get a free quote today</span>
        </h1>

        <p class="hero__subtitle">
          Whether it's decorating, plastering, tiling, plumbing, or anything in
          between — tell us about your job and we'll send a trusted local
          tradesperson out to give you a fair, no-obligation quote.
        </p>

        <div class="hero__actions">
          <button
            class="btn btn--primary"
            aria-label="Get a free quote for your job"
            @click="openQuoteModal"
          >
            Get a Free Quote
            <svg
              class="btn__icon"
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
          <a href="#how-it-works" class="btn btn--secondary"
            >See how it works</a
          >
        </div>

        <div class="hero__stats" role="list" aria-label="Key statistics">
          <div class="hero__stat" role="listitem">
            <span class="hero__stat-value">500+</span>
            <span class="hero__stat-label">Trusted tradespeople</span>
          </div>
          <div class="hero__stat-divider" aria-hidden="true" />
          <div class="hero__stat" role="listitem">
            <span class="hero__stat-value">100%</span>
            <span class="hero__stat-label">Free &amp; no obligation</span>
          </div>
          <div class="hero__stat-divider" aria-hidden="true" />
          <div class="hero__stat" role="listitem">
            <span class="hero__stat-value">24 hr</span>
            <span class="hero__stat-label">Response time</span>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works -->
    <section id="how-it-works" class="steps" aria-labelledby="steps-heading">
      <div class="steps__container">
        <h2 id="steps-heading" class="section-label">How it works</h2>
        <p class="section-title">Your quote in three easy steps</p>

        <div class="steps__grid">
          <article class="step-card" aria-labelledby="step1-title">
            <div class="step-card__number" aria-hidden="true">01</div>
            <div class="step-card__icon" aria-hidden="true">📋</div>
            <h3 id="step1-title" class="step-card__title">Describe Your Job</h3>
            <p class="step-card__desc">
              Fill in your name, contact details, and a brief description of the
              work you need done — decorating, plastering, tiling, plumbing, and
              more.
            </p>
          </article>

          <article class="step-card" aria-labelledby="step2-title">
            <div class="step-card__number" aria-hidden="true">02</div>
            <div class="step-card__icon" aria-hidden="true">🔨</div>
            <h3 id="step2-title" class="step-card__title">
              We Find Your Tradesperson
            </h3>
            <p class="step-card__desc">
              We match your job to a trusted, vetted local tradesperson and
              arrange for them to visit at a time that suits you.
            </p>
          </article>

          <article class="step-card" aria-labelledby="step3-title">
            <div class="step-card__number" aria-hidden="true">03</div>
            <div class="step-card__icon" aria-hidden="true">✅</div>
            <h3 id="step3-title" class="step-card__title">
              Get Your Free Quote
            </h3>
            <p class="step-card__desc">
              Your tradesperson visits, scopes the job, and provides a clear,
              itemised quote — completely free and with no obligation to
              proceed.
            </p>
          </article>
        </div>
      </div>
    </section>

    <!-- Reviews Carousel -->
    <section class="reviews" aria-labelledby="reviews-heading">
      <div class="reviews__container">
        <p class="section-label">What our customers say</p>
        <h2 id="reviews-heading" class="section-title">
          Trusted by homeowners across the UK
        </h2>

        <div
          class="reviews__track"
          @mouseenter="stopAutoplay"
          @mouseleave="startAutoplay"
        >
          <button
            class="reviews__arrow reviews__arrow--prev"
            aria-label="Previous reviews"
            @click="prev"
          >
            &#8592;
          </button>

          <Transition name="slide" mode="out-in">
            <div :key="currentIndex" class="reviews__grid">
              <article
                v-for="(review, i) in visibleReviews"
                :key="i"
                class="review-card"
              >
                <div class="review-card__stars" aria-label="5 stars">★★★★★</div>
                <p class="review-card__text">"{{ review?.text }}"</p>
                <span class="review-card__name">— {{ review?.name }}</span>
              </article>
            </div>
          </Transition>

          <button
            class="reviews__arrow reviews__arrow--next"
            aria-label="Next reviews"
            @click="next"
          >
            &#8594;
          </button>
        </div>

        <div class="reviews__dots" role="list" aria-label="Review pages">
          <button
            v-for="(_, i) in Array.from({
              length: reviews.length / visibleCount,
            })"
            :key="i"
            class="reviews__dot"
            :class="{
              'reviews__dot--active': currentIndex === i * visibleCount,
            }"
            :aria-label="`Go to page ${i + 1}`"
            @click="currentIndex = i * visibleCount"
          />
        </div>
      </div>
    </section>

    <!-- CTA Banner -->
    <section class="cta-banner" aria-labelledby="cta-heading">
      <div class="cta-banner__container">
        <h2 id="cta-heading" class="cta-banner__title">
          Ready to get your job quoted?
        </h2>
        <p class="cta-banner__subtitle">
          It takes less than a minute. Tell us what you need done and we'll take
          care of the rest.
        </p>
        <button
          class="btn btn--primary btn--lg"
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
/* ─── Hero ─────────────────────────────────────────── */
.hero {
  position: relative;
  min-height: 100svh;
  display: flex;
  align-items: center;
  overflow: hidden;
  padding: 100px 1.5rem 4rem;
}

.hero__bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.hero__glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.25;
}

.hero__glow--1 {
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, #bfdbfe, transparent);
  top: -150px;
  left: -100px;
}

.hero__glow--2 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, #99f6e4, transparent);
  bottom: -100px;
  right: -80px;
}

.hero__grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(29, 78, 216, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(29, 78, 216, 0.05) 1px, transparent 1px);
  background-size: 60px 60px;
}

.hero__container {
  position: relative;
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.hero__badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 1rem;
  background: #f0fdfa;
  border: 1px solid #0d9488;
  border-radius: 999px;
  color: #0f5148;
  font-size: 0.85rem;
  font-weight: 500;
}

.hero__badge-dot {
  width: 7px;
  height: 7px;
  background: #0d9488;
  border-radius: 50%;
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

.hero__title {
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.03em;
  color: #0f172a;
  margin: 0;
}

.hero__title-highlight {
  background: linear-gradient(135deg, #1d4ed8 0%, #1e3a8a 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero__subtitle {
  max-width: 580px;
  font-size: clamp(1rem, 2vw, 1.2rem);
  color: #475569;
  line-height: 1.7;
  margin: 0;
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
}

.hero__stats {
  display: flex;
  align-items: center;
  gap: 2rem;
  padding: 1.5rem 2.5rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  flex-wrap: wrap;
  justify-content: center;
}

.hero__stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
}

.hero__stat-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1d4ed8;
  line-height: 1;
}

.hero__stat-label {
  font-size: 0.8rem;
  color: #64748b;
}

.hero__stat-divider {
  width: 1px;
  height: 40px;
  background: #e2e8f0;
}

/* ─── Buttons ───────────────────────────────────────── */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.7rem 1.5rem;
  font-size: 0.95rem;
  font-weight: 600;
  font-family: inherit;
  border: none;
  border-radius: 10px;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.btn--primary {
  background: #0d9488;
  color: #fff;
  box-shadow: 0 4px 20px rgba(13, 148, 136, 0.35);
}

.btn--primary:hover {
  background: #0f766e;
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(13, 148, 136, 0.5);
}

.btn--secondary {
  background: #fff;
  color: #1d4ed8;
  border: 1.5px solid #1d4ed8;
}

.btn--secondary:hover {
  background: #dbeafe;
  color: #1e3a8a;
}

.btn--lg {
  padding: 0.9rem 2rem;
  font-size: 1rem;
}

.btn__icon {
  flex-shrink: 0;
  transition: transform 0.2s;
}

.btn--primary:hover .btn__icon {
  transform: translateX(3px);
}

/* ─── Steps ─────────────────────────────────────────── */
.steps {
  padding: 6rem 1.5rem;
}

.steps__container {
  max-width: 1100px;
  margin: 0 auto;
  text-align: center;
}

.section-label {
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: #1d4ed8;
  margin: 0 0 0.75rem;
}

.section-title {
  font-size: clamp(1.75rem, 4vw, 2.75rem);
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 3rem;
  letter-spacing: -0.02em;
}

.steps__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
}

.step-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 2rem 1.75rem;
  text-align: left;
  transition:
    border-color 0.3s,
    transform 0.3s,
    box-shadow 0.3s;
  position: relative;
  overflow: hidden;
}

.step-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(29, 78, 216, 0.04), transparent);
  opacity: 0;
  transition: opacity 0.3s;
}

.step-card:hover {
  border-color: #1d4ed8;
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(29, 78, 216, 0.1);
}

.step-card:hover::before {
  opacity: 1;
}

.step-card__number {
  font-size: 0.75rem;
  font-weight: 700;
  color: #93c5fd;
  letter-spacing: 0.1em;
  margin-bottom: 1rem;
}

.step-card__icon {
  font-size: 2rem;
  margin-bottom: 1rem;
  line-height: 1;
}

.step-card__title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 0.6rem;
}

.step-card__desc {
  font-size: 0.93rem;
  color: #64748b;
  line-height: 1.65;
  margin: 0;
}

/* ─── Reviews ───────────────────────────────────────── */
.reviews {
  padding: 6rem 1.5rem;
  background: #f8fafc;
}

.reviews__container {
  max-width: 1100px;
  margin: 0 auto;
  text-align: center;
}

.reviews__track {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.reviews__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  flex: 1;
  min-width: 0;
}

.review-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 1.75rem;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.review-card__stars {
  color: #f59e0b;
  font-size: 1.1rem;
  letter-spacing: 0.05em;
}

.review-card__text {
  font-size: 0.92rem;
  color: #475569;
  line-height: 1.65;
  margin: 0;
  flex: 1;
}

.review-card__name {
  font-size: 0.85rem;
  font-weight: 600;
  color: #0f172a;
}

.reviews__arrow {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid #e2e8f0;
  background: #fff;
  color: #64748b;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    background 0.2s,
    color 0.2s;
}

.reviews__arrow:hover {
  background: #0d9488;
  color: #fff;
  border-color: #0d9488;
}

.reviews__dots {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
}

.reviews__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: none;
  background: #cbd5e1;
  cursor: pointer;
  transition:
    background 0.2s,
    transform 0.2s;
  padding: 0;
}

.reviews__dot--active {
  background: #0d9488;
  transform: scale(1.3);
}

/* slide transition */
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

@media (max-width: 768px) {
  .reviews__grid {
    grid-template-columns: 1fr;
  }

  .reviews__grid article:nth-child(n + 2) {
    display: none;
  }
}

/* ─── CTA Banner ────────────────────────────────────── */
.cta-banner {
  padding: 5rem 1.5rem;
}

.cta-banner__container {
  max-width: 700px;
  margin: 0 auto;
  text-align: center;
  padding: 4rem 2.5rem;
  background: linear-gradient(135deg, #1d4ed8, #1e3a8a);
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 8px 40px rgba(29, 78, 216, 0.25);
}

.cta-banner__title {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 800;
  color: #ffffff;
  margin: 0;
  letter-spacing: -0.02em;
}

.cta-banner__subtitle {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.75);
  margin: 0 0 0.5rem;
  max-width: 460px;
}

/* ─── Responsive tweaks ─────────────────────────────── */
@media (min-width: 481px) {
  .hero__glow--2 {
    display: none;
  }
}

@media (max-width: 480px) {
  .hero__stats {
    gap: 1.25rem;
    padding: 1.25rem 1.5rem;
  }

  .hero__stat-divider {
    display: none;
  }

  .hero__stats {
    gap: 1.5rem;
  }

  .cta-banner__container {
    padding: 2.5rem 1.5rem;
  }
}
</style>
