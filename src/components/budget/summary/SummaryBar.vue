<script setup lang="ts">
import { ref } from 'vue'
import SummaryCardLimit from './SummaryCardLimit.vue'
import SummaryCardPlanned from './SummaryCardPlanned.vue'
import SummaryCardCurrency from './SummaryCardCurrency.vue'
import SummaryCardRemaining from './SummaryCardRemaining.vue'
import SummaryCardPaid from './SummaryCardPaid.vue'
import SummaryCardPriority from './SummaryCardPriority.vue'

const limitCardHovered = ref(false)
</script>

<template>
  <section class="summary-bar">
    <div class="summary-row summary-row--top">
      <article
        class="summary-card"
        @mouseenter="limitCardHovered = true"
        @mouseleave="limitCardHovered = false"
      >
        <SummaryCardLimit :hovered="limitCardHovered" />
      </article>
      <article class="summary-card">
        <SummaryCardCurrency />
      </article>

      <article class="summary-card">
        <SummaryCardPlanned />
      </article>



      <article class="summary-card">
        <SummaryCardRemaining />
      </article>
    </div>

    <div class="summary-row summary-row--bottom">
      <article class="summary-card">
        <SummaryCardPaid />
      </article>
      <article class="summary-card">
        <SummaryCardPriority />
      </article>
    </div>
  </section>
</template>

<style scoped>
.summary-bar {
  --summary-label-size: 0.8rem;
  --summary-value-size: 1.2rem;
  --summary-badge-size: 0.82rem;
  --summary-card-padding-y: 0.85rem;
  --summary-card-padding-x: 1rem;

  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.summary-row {
  display: grid;
  gap: 0.75rem;
}

.summary-row--top {
  grid-template-columns: repeat(4, 1fr);
}

.summary-row--bottom {
  grid-template-columns: repeat(2, 1fr);
}

.summary-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: var(--summary-card-padding-y) var(--summary-card-padding-x);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 0.45rem;
  min-height: 6.25rem;
  transition: box-shadow 0.2s ease;
  box-shadow: var(--shadow-card);
}

.summary-card:hover {
  box-shadow: 0 4px 12px var(--color-border-strong);
}

@media (min-width: 1025px) {
  .summary-bar {
    --summary-icon-font-size: 1.5rem;
    --summary-label-size: 1.125rem;
  }
}

@media (max-width: 1100px) {
  .summary-row--top {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .summary-bar {
    gap: 0.4rem;
    width: 100%;
    box-sizing: border-box;
    --summary-label-size: 0.78rem;
    --summary-value-size: 1.1rem;
    --summary-badge-size: 0.68rem;
    --summary-card-padding-y: 0.6rem;
    --summary-card-padding-x: 0.7rem;
  }

  .summary-row--top,
  .summary-row--bottom {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }

  .summary-row {
    gap: 0.4rem;
  }

  .summary-card {
    gap: 0.2rem;
    min-width: 0;
    min-height: 0;
    border-radius: 12px;
  }
}

@media (max-width: 380px) {
  .summary-row--top,
  .summary-row--bottom {
    grid-template-columns: minmax(0, 1fr);
    justify-items: center;
  }

  .summary-row--top > .summary-card,
  .summary-row--bottom > .summary-card {
    width: 100%;
  }
  .summary-bar {
    --summary-card-padding-y: 0.4rem;
    --summary-card-padding-x: 0.5rem;
    --summary-value-size: 0.9rem;
  }
}
</style>
