<script setup lang="ts">
const { open: openQuoteModal } = useQuoteModal();

useSeoMeta({
  title: 'Quote My Job – Free Trades Quotes',
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
  background: radial-gradient(circle, #7c3aed, transparent);
  top: -150px;
  left: -100px;
}

.hero__glow--2 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, #4f46e5, transparent);
  bottom: -100px;
  right: -80px;
}

.hero__grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
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
  background: rgba(124, 58, 237, 0.15);
  border: 1px solid rgba(124, 58, 237, 0.35);
  border-radius: 999px;
  color: #c4b5fd;
  font-size: 0.85rem;
  font-weight: 500;
}

.hero__badge-dot {
  width: 7px;
  height: 7px;
  background: #a78bfa;
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
  color: #fff;
  margin: 0;
}

.hero__title-highlight {
  background: linear-gradient(135deg, #a78bfa 0%, #60a5fa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero__subtitle {
  max-width: 580px;
  font-size: clamp(1rem, 2vw, 1.2rem);
  color: rgba(255, 255, 255, 0.6);
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
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
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
  color: #fff;
  line-height: 1;
}

.hero__stat-label {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
}

.hero__stat-divider {
  width: 1px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
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
  background: linear-gradient(135deg, #7c3aed, #4f46e5);
  color: #fff;
  box-shadow: 0 4px 20px rgba(124, 58, 237, 0.4);
}

.btn--primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(124, 58, 237, 0.55);
}

.btn--secondary {
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.btn--secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
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
  color: #a78bfa;
  margin: 0 0 0.75rem;
}

.section-title {
  font-size: clamp(1.75rem, 4vw, 2.75rem);
  font-weight: 800;
  color: #fff;
  margin: 0 0 3rem;
  letter-spacing: -0.02em;
}

.steps__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
}

.step-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 2rem 1.75rem;
  text-align: left;
  transition:
    border-color 0.3s,
    transform 0.3s;
  position: relative;
  overflow: hidden;
}

.step-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(124, 58, 237, 0.06), transparent);
  opacity: 0;
  transition: opacity 0.3s;
}

.step-card:hover {
  border-color: rgba(124, 58, 237, 0.4);
  transform: translateY(-4px);
}

.step-card:hover::before {
  opacity: 1;
}

.step-card__number {
  font-size: 0.75rem;
  font-weight: 700;
  color: rgba(167, 139, 250, 0.5);
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
  color: #fff;
  margin: 0 0 0.6rem;
}

.step-card__desc {
  font-size: 0.93rem;
  color: rgba(255, 255, 255, 0.55);
  line-height: 1.65;
  margin: 0;
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
  background: linear-gradient(
    135deg,
    rgba(124, 58, 237, 0.2),
    rgba(79, 70, 229, 0.2)
  );
  border: 1px solid rgba(124, 58, 237, 0.35);
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.cta-banner__title {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 800;
  color: #fff;
  margin: 0;
  letter-spacing: -0.02em;
}

.cta-banner__subtitle {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0 0 0.5rem;
  max-width: 460px;
}

/* ─── Responsive tweaks ─────────────────────────────── */
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
