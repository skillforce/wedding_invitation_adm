# Wedding Smart Checklist — Implementation Guide

> Full implementation blueprint for a Vue 3 + Pinia + PrimeVue + vue-echarts wedding checklist page with i18n, light/dark theming, animated transitions, and mobile-first responsive layout.

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Project Prerequisites & Dependencies](#2-project-prerequisites--dependencies)
3. [File & Folder Structure](#3-file--folder-structure)
4. [Theme System (Light / Dark)](#4-theme-system-light--dark)
5. [Internationalization (i18n)](#5-internationalization-i18n)
6. [Pinia Store — `useChecklistStore`](#6-pinia-store--usecheckliststore)
7. [Page Component — `WeddingChecklist.vue`](#7-page-component--weddingchecklistvue)
8. [ECharts Integration — Progress Dashboard](#8-echarts-integration--progress-dashboard)
9. [Transitions & Animations](#9-transitions--animations)
10. [Responsive Layout Strategy (1920 → 320 px)](#10-responsive-layout-strategy-1920--320-px)
11. [Accessibility & UX Notes](#11-accessibility--ux-notes)
12. [Testing Checklist](#12-testing-checklist)

---

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                     App.vue                         │
│  ┌───────────────────────────────────────────────┐  │
│  │  ThemeProvider (CSS vars on :root)             │  │
│  │  ┌─────────────────────────────────────────┐  │  │
│  │  │  RouterView → WeddingChecklist.vue       │  │  │
│  │  │  ┌──────────┐ ┌───────────────────────┐ │  │  │
│  │  │  │ ECharts  │ │ Phase Timeline        │ │  │  │
│  │  │  │ Dashboard│ │ ┌───────────────────┐ │ │  │  │
│  │  │  │ (gauge + │ │ │ TaskCard × N      │ │ │  │  │
│  │  │  │  pie +   │ │ │ (animated open/   │ │ │  │  │
│  │  │  │  bar)    │ │ │  close via        │ │ │  │  │
│  │  │  │          │ │ │  Transition)      │ │ │  │  │
│  │  │  └──────────┘ │ └───────────────────┘ │ │  │  │
│  │  │               └───────────────────────┘ │  │  │
│  │  └─────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────┘  │
│  Pinia Store ←→ localStorage persistence            │
│  i18n (vue-i18n) ←→ en.json / pl.json / etc.       │
└─────────────────────────────────────────────────────┘
```

**Key tech stack:**

| Layer        | Library                        | Version   |
|------------- |------------------------------- |---------- |
| Framework    | Vue 3 (Composition API)        | ^3.4      |
| State        | Pinia                          | ^2.1      |
| UI Kit       | PrimeVue (Material preset)     | ^4.x      |
| Charts       | vue-echarts + echarts          | ^7.x / ^5 |
| i18n         | vue-i18n                       | ^9.x      |
| Transitions  | Vue built-in `<Transition>`    | —         |
| Font         | System font stack              | —         |

**Font stack used everywhere:**

```css
font-family: system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
```

This avoids external font loading, improves performance, and renders native-feeling text on every OS.

---

## 2. Project Prerequisites & Dependencies

### Install required packages

```bash
# Core UI
npm install primevue @primevue/themes primeicons

# Charts
npm install echarts vue-echarts

# State & i18n
npm install pinia vue-i18n

# (Optional) animation helper
npm install @vueuse/core
```

### main.ts / main.js setup

```js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import PrimeVue from 'primevue/config'
import Material from '@primevue/themes/material'
import 'primeicons/primeicons.css'

import App from './App.vue'
import router from './router'
import en from './locales/en.json'
import pl from './locales/pl.json'

// ── i18n ──
const i18n = createI18n({
  legacy: false,              // Composition API mode
  locale: localStorage.getItem('locale') || 'en',
  fallbackLocale: 'en',
  messages: { en, pl },
})

// ── App ──
const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n)
app.use(PrimeVue, {
  theme: {
    preset: Material,
    options: {
      darkModeSelector: '.dark-mode',   // We toggle this class on <html>
    },
  },
})

app.mount('#app')
```

> **Important:** The `darkModeSelector` tells PrimeVue to switch its own tokens when `.dark-mode` is on the root element. This keeps PrimeVue components and your custom CSS in sync.

---

## 3. File & Folder Structure

```
src/
├── assets/
│   └── styles/
│       ├── _variables.css          ← CSS custom properties (light + dark)
│       ├── _transitions.css        ← shared transition classes
│       └── main.css                ← global resets, font-family
│
├── composables/
│   ├── useTheme.ts                 ← toggle dark/light, persist
│   └── useChecklistCharts.ts       ← ECharts option builders
│
├── locales/
│   ├── en.json
│   └── pl.json                     ← (or any language you need)
│
├── stores/
│   └── checklistStore.ts           ← Pinia store
│
├── components/
│   ├── checklist/
│   │   ├── ChecklistHero.vue       ← header, progress ring, filters
│   │   ├── PhaseCard.vue           ← collapsible phase with transition
│   │   ├── TaskCard.vue            ← individual task item
│   │   ├── ChecklistCharts.vue     ← ECharts dashboard section
│   │   └── CelebrationOverlay.vue  ← 100% confetti overlay
│   └── common/
│       └── ThemeToggle.vue         ← sun/moon switch
│
├── pages/
│   └── WeddingChecklist.vue        ← page that composes everything
│
└── main.ts
```

---

## 4. Theme System (Light / Dark)

### 4a. CSS Custom Properties — `_variables.css`

Define **all** colors as CSS variables. The dark variant overrides them when `.dark-mode` is present on `<html>`.

```css
/* ─── src/assets/styles/_variables.css ─── */

:root {
  /* ── Surface & Background ── */
  --cl-bg:            #FAF7F2;
  --cl-bg-warm:       #F3EDE4;
  --cl-surface:       #FFFFFF;
  --cl-surface-hover: #F9F6F1;

  /* ── Brand / Gold ── */
  --cl-gold:          #C9956B;
  --cl-gold-light:    #E8C9A0;
  --cl-gold-deep:     #8B6F5E;

  /* ── Text ── */
  --cl-text:          #3A3028;
  --cl-text-soft:     #8C7E72;
  --cl-text-faint:    #B8ADA3;

  /* ── Semantic ── */
  --cl-priority:      #C97B5B;
  --cl-done:          #7EAD8B;
  --cl-done-bg:       #E8F5EC;
  --cl-line:          #E6DDD3;

  /* ── Shadows ── */
  --shadow-card:      0 2px 20px rgba(58,48,40,0.06),
                      0 0 0 1px rgba(58,48,40,0.03);
  --shadow-hover:     0 8px 32px rgba(58,48,40,0.10),
                      0 0 0 1px rgba(201,149,107,0.15);

  /* ── Radii ── */
  --radius-sm:  10px;
  --radius-md:  16px;
  --radius-lg:  24px;

  /* ── Font ── */
  --font-body: system-ui, -apple-system, 'Segoe UI', Roboto,
               'Helvetica Neue', Arial, sans-serif;

  /* ── Chart colors (used by ECharts) ── */
  --chart-gold:       #C9956B;
  --chart-done:       #7EAD8B;
  --chart-todo:       #E6DDD3;
  --chart-priority:   #C97B5B;
  --chart-text:       #3A3028;
  --chart-axis:       #B8ADA3;
}

/* ═══════════════════════════════════════════
   DARK MODE OVERRIDES
   ═══════════════════════════════════════════ */
html.dark-mode {
  --cl-bg:            #1A1614;
  --cl-bg-warm:       #221E1B;
  --cl-surface:       #2A2521;
  --cl-surface-hover: #332D28;

  --cl-gold:          #D4A574;
  --cl-gold-light:    #A07B56;
  --cl-gold-deep:     #E8C9A0;

  --cl-text:          #F0EAE3;
  --cl-text-soft:     #A89E94;
  --cl-text-faint:    #6B6058;

  --cl-priority:      #E09A7A;
  --cl-done:          #8FC09A;
  --cl-done-bg:       rgba(126,173,139,0.12);
  --cl-line:          #3A3330;

  --shadow-card:      0 2px 20px rgba(0,0,0,0.25),
                      0 0 0 1px rgba(255,255,255,0.04);
  --shadow-hover:     0 8px 32px rgba(0,0,0,0.35),
                      0 0 0 1px rgba(201,149,107,0.2);

  --chart-gold:       #D4A574;
  --chart-done:       #8FC09A;
  --chart-todo:       #3A3330;
  --chart-priority:   #E09A7A;
  --chart-text:       #F0EAE3;
  --chart-axis:       #6B6058;
}
```

### 4b. Theme Composable — `useTheme.ts`

```ts
// src/composables/useTheme.ts
import { ref, watch, onMounted } from 'vue'

const STORAGE_KEY = 'wedding-theme'

// Global reactive state (shared across components via module scope)
const isDark = ref(false)

export function useTheme() {
  function apply() {
    document.documentElement.classList.toggle('dark-mode', isDark.value)
  }

  function toggle() {
    isDark.value = !isDark.value
  }

  // Persist
  watch(isDark, (val) => {
    localStorage.setItem(STORAGE_KEY, val ? 'dark' : 'light')
    apply()
  })

  onMounted(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'dark') {
      isDark.value = true
    } else if (!saved) {
      // Respect OS preference on first visit
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    apply()
  })

  return { isDark, toggle }
}
```

### 4c. ThemeToggle Component

```vue
<!-- src/components/common/ThemeToggle.vue -->
<template>
  <button
    class="theme-toggle"
    :aria-label="isDark ? t('theme.switchLight') : t('theme.switchDark')"
    @click="toggle"
  >
    <Transition name="icon-flip" mode="out-in">
      <i v-if="isDark" class="pi pi-sun" key="sun" />
      <i v-else class="pi pi-moon" key="moon" />
    </Transition>
  </button>
</template>

<script setup lang="ts">
import { useTheme } from '@/composables/useTheme'
import { useI18n } from 'vue-i18n'

const { isDark, toggle } = useTheme()
const { t } = useI18n()
</script>

<style scoped>
.theme-toggle {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1.5px solid var(--cl-line);
  background: var(--cl-surface);
  color: var(--cl-text-soft);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  transition: all 0.25s ease;
  -webkit-tap-highlight-color: transparent;
}
.theme-toggle:hover {
  border-color: var(--cl-gold);
  color: var(--cl-gold);
  box-shadow: 0 0 16px rgba(201, 149, 107, 0.2);
}

/* Icon flip animation */
.icon-flip-enter-active,
.icon-flip-leave-active {
  transition: all 0.25s ease;
}
.icon-flip-enter-from {
  opacity: 0;
  transform: rotateY(90deg) scale(0.5);
}
.icon-flip-leave-to {
  opacity: 0;
  transform: rotateY(-90deg) scale(0.5);
}
</style>
```

---

## 5. Internationalization (i18n)

### 5a. English locale — `en.json`

```json
{
  "checklist": {
    "eyebrow": "Your Wedding Journey",
    "title_the": "The",
    "title_checklist": "Checklist",
    "tasks_progress": "{done} of {total} tasks complete",
    "filter": {
      "all": "All",
      "todo": "To Do",
      "done": "Done",
      "priority": "Priority"
    },
    "phase": {
      "first_steps": "First Steps",
      "first_steps_time": "12–10 months before",
      "building_team": "Building the Team",
      "building_team_time": "9–7 months before",
      "design_details": "Design & Details",
      "design_details_time": "6–4 months before",
      "final_countdown": "Final Countdown",
      "final_countdown_time": "3–1 months before",
      "final_week": "The Final Week",
      "final_week_time": "Last 7 days"
    },
    "task": {
      "set_date":          "Set your wedding date",
      "set_date_note":     "Consider season & venue availability",
      "budget":            "Determine your budget",
      "budget_note":       "Be realistic — include a 10% buffer",
      "guest_list":        "Create your guest list draft",
      "guest_list_note":   "A-list vs B-list strategy",
      "venue":             "Book your venue",
      "venue_note":        "Visit at least 3 options",
      "planner":           "Hire a wedding planner",
      "planner_note":      "Optional but highly recommended",
      "mood_board":        "Start building a mood board",
      "mood_board_note":   "Pinterest, magazines, or physical board",
      "photographer":      "Book your photographer",
      "photographer_note": "Review portfolios & meet in person",
      "caterer":           "Book your caterer",
      "caterer_note":      "Schedule a tasting session",
      "bridal_party":      "Choose your bridal party",
      "bridal_party_note": "Think about roles carefully",
      "entertainment":     "Book entertainment / DJ / band",
      "entertainment_note":"Share your must-play and never-play lists",
      "florist":           "Hire a florist",
      "florist_note":      "Bring your mood board",
      "officiant":         "Book officiant",
      "officiant_note":    "Discuss ceremony style",
      "invitations":       "Order invitations",
      "invitations_note":  "Send save-the-dates first",
      "ceremony":          "Plan your ceremony",
      "ceremony_note":     "Readings, vows, music",
      "attire":            "Choose your wedding attire",
      "attire_note":       "Allow time for alterations",
      "registry":          "Register for gifts",
      "registry_note":     "Choose 2-3 registries",
      "transport":         "Book transportation",
      "transport_note":    "For bridal party & guests if needed",
      "cake":              "Order wedding cake",
      "cake_note":         "Schedule a tasting",
      "send_invitations":      "Send invitations",
      "send_invitations_note": "6-8 weeks before the date",
      "fitting":               "Final dress fitting",
      "fitting_note":          "Bring your shoes & accessories",
      "seating":               "Create seating chart",
      "seating_note":          "The ultimate puzzle",
      "vows":                  "Write your vows",
      "vows_note":             "Start early, revise often",
      "confirm_vendors":       "Confirm all vendors",
      "confirm_vendors_note":  "Double-check dates, times, details",
      "license":               "Get marriage license",
      "license_note":          "Check local requirements & deadlines",
      "rehearsal":             "Rehearsal & rehearsal dinner",
      "rehearsal_note":        "Keep it relaxed and fun",
      "emergency_kit":         "Prepare emergency kit",
      "emergency_kit_note":    "Sewing kit, pain relief, stain remover…",
      "day_timeline":          "Finalize day-of timeline",
      "day_timeline_note":     "Share with all vendors & bridal party",
      "honeymoon":             "Pack for the honeymoon",
      "honeymoon_note":        "Don't forget your passport!",
      "payments":              "Prepare vendor payments & tips",
      "payments_note":         "Cash envelopes labeled clearly",
      "breathe":               "Breathe. You've got this.",
      "breathe_note":          ""
    },
    "celebration": {
      "title": "All Done!",
      "subtitle": "You're ready for your big day"
    },
    "chart": {
      "title": "Your Progress",
      "by_phase": "By Phase",
      "by_priority": "By Priority",
      "overall": "Overall",
      "completed": "Completed",
      "remaining": "Remaining",
      "high_priority": "High Priority"
    },
    "empty": "No tasks match this filter."
  },
  "theme": {
    "switchDark": "Switch to dark mode",
    "switchLight": "Switch to light mode"
  }
}
```

### 5b. Second locale example — `pl.json` (Polish, abbreviated)

```json
{
  "checklist": {
    "eyebrow": "Twoja Podróż Ślubna",
    "title_the": "Lista",
    "title_checklist": "Zadań",
    "tasks_progress": "{done} z {total} zadań ukończonych",
    "filter": {
      "all": "Wszystkie",
      "todo": "Do zrobienia",
      "done": "Gotowe",
      "priority": "Priorytet"
    },
    "phase": {
      "first_steps": "Pierwsze Kroki",
      "first_steps_time": "12–10 miesięcy przed",
      "building_team": "Budowanie Zespołu",
      "building_team_time": "9–7 miesięcy przed",
      "design_details": "Projekt i Szczegóły",
      "design_details_time": "6–4 miesiące przed",
      "final_countdown": "Ostatnie Odliczanie",
      "final_countdown_time": "3–1 miesiące przed",
      "final_week": "Ostatni Tydzień",
      "final_week_time": "Ostatnie 7 dni"
    },
    "task": {
      "set_date": "Ustal datę ślubu",
      "set_date_note": "Rozważ sezon i dostępność miejsca",
      "budget": "Określ budżet",
      "budget_note": "Bądź realistą — dodaj 10% buforu",
      "guest_list": "Stwórz wstępną listę gości",
      "guest_list_note": "Strategia lista A vs lista B",
      "venue": "Zarezerwuj miejsce",
      "venue_note": "Odwiedź przynajmniej 3 opcje",
      "planner": "Wynajmij wedding plannera",
      "planner_note": "Opcjonalnie, ale bardzo zalecane",
      "mood_board": "Zacznij tworzyć mood board",
      "mood_board_note": "Pinterest, magazyny lub fizyczna tablica"
    },
    "celebration": {
      "title": "Gotowe!",
      "subtitle": "Jesteś gotowa na swój wielki dzień"
    },
    "chart": {
      "title": "Twój Postęp",
      "by_phase": "Według Etapu",
      "by_priority": "Według Priorytetu",
      "overall": "Ogólnie",
      "completed": "Ukończone",
      "remaining": "Pozostałe",
      "high_priority": "Wysoki Priorytet"
    },
    "empty": "Brak zadań pasujących do filtra."
  },
  "theme": {
    "switchDark": "Tryb ciemny",
    "switchLight": "Tryb jasny"
  }
}
```

### 5c. Using translations in components

```vue
<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<template>
  <!-- Simple key -->
  <p class="eyebrow">{{ t('checklist.eyebrow') }}</p>

  <!-- With interpolation -->
  <p class="sub">
    {{ t('checklist.tasks_progress', { done: completedCount, total: totalCount }) }}
  </p>

  <!-- Task titles from i18n keys stored in data -->
  <span class="task-title">{{ t(task.titleKey) }}</span>
</template>
```

### 5d. Store task data with i18n keys (not hardcoded strings)

Instead of storing literal `title: "Set your wedding date"`, store a reference key:

```ts
{
  id: 't1',
  titleKey: 'checklist.task.set_date',       // i18n lookup key
  noteKey:  'checklist.task.set_date_note',   // i18n lookup key
  completed: false,
  priority: 'high',
}
```

Then in the template: `{{ t(task.titleKey) }}`.

---

## 6. Pinia Store — `useChecklistStore`

```ts
// src/stores/checklistStore.ts
import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

export interface Task {
  id: string
  titleKey: string          // i18n key
  noteKey: string           // i18n key
  completed: boolean
  priority: 'high' | 'normal'
}

export interface Phase {
  id: string
  nameKey: string           // i18n key
  timelineKey: string       // i18n key
  icon: string              // PrimeIcons class
  tasks: Task[]
}

const STORAGE_KEY = 'wedding-checklist-state'

function buildDefaultPhases(): Phase[] {
  return [
    {
      id: 'p1',
      nameKey: 'checklist.phase.first_steps',
      timelineKey: 'checklist.phase.first_steps_time',
      icon: 'pi pi-sparkles',
      tasks: [
        { id: 't1',  titleKey: 'checklist.task.set_date',
          noteKey: 'checklist.task.set_date_note',
          completed: false, priority: 'high' },
        { id: 't2',  titleKey: 'checklist.task.budget',
          noteKey: 'checklist.task.budget_note',
          completed: false, priority: 'high' },
        { id: 't3',  titleKey: 'checklist.task.guest_list',
          noteKey: 'checklist.task.guest_list_note',
          completed: false, priority: 'normal' },
        { id: 't4',  titleKey: 'checklist.task.venue',
          noteKey: 'checklist.task.venue_note',
          completed: false, priority: 'high' },
        { id: 't5',  titleKey: 'checklist.task.planner',
          noteKey: 'checklist.task.planner_note',
          completed: false, priority: 'normal' },
        { id: 't6',  titleKey: 'checklist.task.mood_board',
          noteKey: 'checklist.task.mood_board_note',
          completed: false, priority: 'normal' },
      ],
    },
    {
      id: 'p2',
      nameKey: 'checklist.phase.building_team',
      timelineKey: 'checklist.phase.building_team_time',
      icon: 'pi pi-users',
      tasks: [
        { id: 't7',  titleKey: 'checklist.task.photographer',
          noteKey: 'checklist.task.photographer_note',
          completed: false, priority: 'high' },
        { id: 't8',  titleKey: 'checklist.task.caterer',
          noteKey: 'checklist.task.caterer_note',
          completed: false, priority: 'high' },
        { id: 't9',  titleKey: 'checklist.task.bridal_party',
          noteKey: 'checklist.task.bridal_party_note',
          completed: false, priority: 'normal' },
        { id: 't10', titleKey: 'checklist.task.entertainment',
          noteKey: 'checklist.task.entertainment_note',
          completed: false, priority: 'normal' },
        { id: 't11', titleKey: 'checklist.task.florist',
          noteKey: 'checklist.task.florist_note',
          completed: false, priority: 'normal' },
        { id: 't12', titleKey: 'checklist.task.officiant',
          noteKey: 'checklist.task.officiant_note',
          completed: false, priority: 'high' },
      ],
    },
    {
      id: 'p3',
      nameKey: 'checklist.phase.design_details',
      timelineKey: 'checklist.phase.design_details_time',
      icon: 'pi pi-palette',
      tasks: [
        { id: 't13', titleKey: 'checklist.task.invitations',
          noteKey: 'checklist.task.invitations_note',
          completed: false, priority: 'high' },
        { id: 't14', titleKey: 'checklist.task.ceremony',
          noteKey: 'checklist.task.ceremony_note',
          completed: false, priority: 'normal' },
        { id: 't15', titleKey: 'checklist.task.attire',
          noteKey: 'checklist.task.attire_note',
          completed: false, priority: 'high' },
        { id: 't16', titleKey: 'checklist.task.registry',
          noteKey: 'checklist.task.registry_note',
          completed: false, priority: 'normal' },
        { id: 't17', titleKey: 'checklist.task.transport',
          noteKey: 'checklist.task.transport_note',
          completed: false, priority: 'normal' },
        { id: 't18', titleKey: 'checklist.task.cake',
          noteKey: 'checklist.task.cake_note',
          completed: false, priority: 'normal' },
      ],
    },
    {
      id: 'p4',
      nameKey: 'checklist.phase.final_countdown',
      timelineKey: 'checklist.phase.final_countdown_time',
      icon: 'pi pi-clock',
      tasks: [
        { id: 't19', titleKey: 'checklist.task.send_invitations',
          noteKey: 'checklist.task.send_invitations_note',
          completed: false, priority: 'high' },
        { id: 't20', titleKey: 'checklist.task.fitting',
          noteKey: 'checklist.task.fitting_note',
          completed: false, priority: 'normal' },
        { id: 't21', titleKey: 'checklist.task.seating',
          noteKey: 'checklist.task.seating_note',
          completed: false, priority: 'normal' },
        { id: 't22', titleKey: 'checklist.task.vows',
          noteKey: 'checklist.task.vows_note',
          completed: false, priority: 'normal' },
        { id: 't23', titleKey: 'checklist.task.confirm_vendors',
          noteKey: 'checklist.task.confirm_vendors_note',
          completed: false, priority: 'high' },
        { id: 't24', titleKey: 'checklist.task.license',
          noteKey: 'checklist.task.license_note',
          completed: false, priority: 'high' },
      ],
    },
    {
      id: 'p5',
      nameKey: 'checklist.phase.final_week',
      timelineKey: 'checklist.phase.final_week_time',
      icon: 'pi pi-heart',
      tasks: [
        { id: 't25', titleKey: 'checklist.task.rehearsal',
          noteKey: 'checklist.task.rehearsal_note',
          completed: false, priority: 'high' },
        { id: 't26', titleKey: 'checklist.task.emergency_kit',
          noteKey: 'checklist.task.emergency_kit_note',
          completed: false, priority: 'normal' },
        { id: 't27', titleKey: 'checklist.task.day_timeline',
          noteKey: 'checklist.task.day_timeline_note',
          completed: false, priority: 'high' },
        { id: 't28', titleKey: 'checklist.task.honeymoon',
          noteKey: 'checklist.task.honeymoon_note',
          completed: false, priority: 'normal' },
        { id: 't29', titleKey: 'checklist.task.payments',
          noteKey: 'checklist.task.payments_note',
          completed: false, priority: 'normal' },
        { id: 't30', titleKey: 'checklist.task.breathe',
          noteKey: 'checklist.task.breathe_note',
          completed: false, priority: 'normal' },
      ],
    },
  ]
}

export const useChecklistStore = defineStore('wedding-checklist', () => {
  // ─── State ───
  const phases = ref<Phase[]>(loadState())

  function loadState(): Phase[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const saved = JSON.parse(raw) as Phase[]
        // Merge saved completion state with latest default structure.
        // This handles adding new tasks in future updates without
        // wiping the user's existing progress.
        const defaults = buildDefaultPhases()
        return defaults.map((dp) => {
          const sp = saved.find((s) => s.id === dp.id)
          if (!sp) return dp
          return {
            ...dp,
            tasks: dp.tasks.map((dt) => {
              const st = sp.tasks.find((s) => s.id === dt.id)
              return st ? { ...dt, completed: st.completed } : dt
            }),
          }
        })
      }
    } catch { /* corrupt data — fall through to defaults */ }
    return buildDefaultPhases()
  }

  // Persist on every change
  watch(phases, (val) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
  }, { deep: true })

  // ─── Getters ───
  const allTasks    = computed(() => phases.value.flatMap((p) => p.tasks))
  const totalCount  = computed(() => allTasks.value.length)
  const doneCount   = computed(() =>
    allTasks.value.filter((t) => t.completed).length
  )
  const donePct     = computed(() =>
    totalCount.value
      ? Math.round((doneCount.value / totalCount.value) * 100)
      : 0
  )
  const highTotal   = computed(() =>
    allTasks.value.filter((t) => t.priority === 'high').length
  )
  const highDone    = computed(() =>
    allTasks.value.filter((t) => t.priority === 'high' && t.completed).length
  )

  // Per-phase stats (consumed by ECharts composable)
  const phaseStats = computed(() =>
    phases.value.map((p) => ({
      id: p.id,
      nameKey: p.nameKey,
      total: p.tasks.length,
      done: p.tasks.filter((t) => t.completed).length,
      pct: p.tasks.length
        ? Math.round(
            (p.tasks.filter((t) => t.completed).length / p.tasks.length) * 100
          )
        : 0,
    }))
  )

  // ─── Actions ───
  function toggleTask(phaseId: string, taskId: string) {
    const phase = phases.value.find((p) => p.id === phaseId)
    if (!phase) return
    const task = phase.tasks.find((t) => t.id === taskId)
    if (!task) return
    task.completed = !task.completed
  }

  function resetAll() {
    phases.value = buildDefaultPhases()
  }

  function addCustomTask(
    phaseId: string,
    title: string,
    priority: 'high' | 'normal' = 'normal'
  ) {
    const phase = phases.value.find((p) => p.id === phaseId)
    if (!phase) return
    phase.tasks.push({
      id: `custom_${Date.now()}`,
      titleKey: title,          // literal text for user-created tasks
      noteKey: '',
      completed: false,
      priority,
    })
  }

  return {
    phases,
    allTasks,
    totalCount,
    doneCount,
    donePct,
    highTotal,
    highDone,
    phaseStats,
    toggleTask,
    resetAll,
    addCustomTask,
  }
})
```

---

## 7. Page Component — `WeddingChecklist.vue`

This is the orchestrating page. It imports sub-components and wires them to the store.

```vue
<!-- src/pages/WeddingChecklist.vue -->
<template>
  <div class="checklist-page">

    <!-- Theme toggle (fixed top-right) -->
    <ThemeToggle class="floating-toggle" />

    <!-- Hero section -->
    <ChecklistHero
      :done-pct="store.donePct"
      :done-count="store.doneCount"
      :total-count="store.totalCount"
      :active-filter="activeFilter"
      @filter-change="activeFilter = $event"
    />

    <!-- ECharts dashboard -->
    <ChecklistCharts />

    <!-- Phase timeline -->
    <main class="timeline-area">
      <div class="timeline-line" aria-hidden="true" />

      <TransitionGroup name="phase-list" tag="div">
        <PhaseCard
          v-for="phase in filteredPhases"
          :key="phase.id"
          :phase="phase"
          :is-open="expandedPhases.has(phase.id)"
          @toggle="togglePhase(phase.id)"
          @task-toggle="(taskId) => store.toggleTask(phase.id, taskId)"
        />
      </TransitionGroup>

      <div v-if="filteredPhases.length === 0" class="empty-state">
        <i class="pi pi-search" />
        <p>{{ t('checklist.empty') }}</p>
      </div>
    </main>

    <!-- 100% celebration -->
    <Transition name="celebrate">
      <CelebrationOverlay
        v-if="showCelebration"
        @close="showCelebration = false"
      />
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { useChecklistStore } from '@/stores/checklistStore'
import { useTheme } from '@/composables/useTheme'

import ThemeToggle from '@/components/common/ThemeToggle.vue'
import ChecklistHero from '@/components/checklist/ChecklistHero.vue'
import ChecklistCharts from '@/components/checklist/ChecklistCharts.vue'
import PhaseCard from '@/components/checklist/PhaseCard.vue'
import CelebrationOverlay from '@/components/checklist/CelebrationOverlay.vue'

const { t } = useI18n()
const store = useChecklistStore()
useTheme()   // initializes theme on mount

const activeFilter = ref<'all' | 'todo' | 'done' | 'high'>('all')
const expandedPhases = reactive(new Set<string>())
const showCelebration = ref(false)
const celebShown = ref(false)

const filteredPhases = computed(() =>
  store.phases
    .map((phase) => {
      let tasks = phase.tasks
      if (activeFilter.value === 'todo')
        tasks = tasks.filter((t) => !t.completed)
      if (activeFilter.value === 'done')
        tasks = tasks.filter((t) => t.completed)
      if (activeFilter.value === 'high')
        tasks = tasks.filter((t) => t.priority === 'high')
      return { ...phase, tasks }
    })
    .filter((phase) => phase.tasks.length > 0)
)

function togglePhase(id: string) {
  expandedPhases.has(id)
    ? expandedPhases.delete(id)
    : expandedPhases.add(id)
}

onMounted(() => {
  if (store.phases.length) expandedPhases.add(store.phases[0].id)
})

watch(() => store.donePct, (val) => {
  if (val === 100 && !celebShown.value) {
    showCelebration.value = true
    celebShown.value = true
  }
})
</script>

<style scoped>
.checklist-page {
  min-height: 100vh;
  background: var(--cl-bg);
  font-family: var(--font-body);
  color: var(--cl-text);
  position: relative;
  overflow-x: hidden;
  transition: background-color 0.4s ease, color 0.4s ease;
}

.floating-toggle {
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 50;
}

.timeline-area {
  position: relative;
  max-width: 680px;
  margin: 0 auto;
  padding: 20px 20px 80px;
}

.timeline-line {
  position: absolute;
  left: 39px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(
    180deg,
    var(--cl-gold-light) 0%,
    var(--cl-line) 50%,
    transparent 100%
  );
  transition: background 0.4s ease;
}

/* TransitionGroup for phases */
.phase-list-enter-active {
  animation: phase-in 0.4s ease both;
}
.phase-list-leave-active {
  animation: phase-in 0.3s ease reverse both;
}
.phase-list-move {
  transition: transform 0.4s ease;
}
@keyframes phase-in {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--cl-text-faint);
}
.empty-state i {
  font-size: 40px;
  display: block;
  margin-bottom: 12px;
}

/* Celebration transition */
.celebrate-enter-active { animation: fadeScale 0.3s ease; }
.celebrate-leave-active { animation: fadeScale 0.3s ease reverse; }
@keyframes fadeScale {
  from { opacity: 0; transform: scale(0.95); }
  to   { opacity: 1; transform: scale(1); }
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .timeline-area { padding: 16px 16px 60px; }
  .timeline-line { left: 31px; }
}
@media (max-width: 480px) {
  .timeline-area { padding: 12px 12px 60px; }
  .timeline-line { display: none; }
}
@media (min-width: 1200px) {
  .timeline-area { max-width: 720px; }
}
</style>
```

---

## 8. ECharts Integration — Progress Dashboard

### 8a. Composable — `useChecklistCharts.ts`

This composable builds reactive ECharts option objects that auto-update when tasks or theme change.

```ts
// src/composables/useChecklistCharts.ts
import { computed } from 'vue'
import { useChecklistStore } from '@/stores/checklistStore'
import { useI18n } from 'vue-i18n'
import { useTheme } from './useTheme'

const FONT = "system-ui, -apple-system, 'Segoe UI', Roboto, " +
             "'Helvetica Neue', Arial, sans-serif"

export function useChecklistCharts() {
  const store = useChecklistStore()
  const { t } = useI18n()
  const { isDark } = useTheme()

  // Read a CSS custom property from :root at call-time
  function cv(name: string): string {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(name)
      .trim()
  }

  // ── 1. GAUGE — Overall percentage ──
  const gaugeOption = computed(() => {
    // Touch isDark so this recomputes on theme change
    const _theme = isDark.value

    return {
      series: [{
        type: 'gauge',
        startAngle: 220,
        endAngle: -40,
        min: 0,
        max: 100,
        pointer: { show: false },
        progress: {
          show: true,
          width: 14,
          roundCap: true,
          itemStyle: { color: cv('--chart-gold') },
        },
        axisLine: {
          lineStyle: {
            width: 14,
            color: [[1, cv('--chart-todo')]],
          },
        },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        detail: {
          fontSize: 32,
          fontFamily: FONT,
          fontWeight: 700,
          color: cv('--chart-text'),
          formatter: '{value}%',
          offsetCenter: [0, '10%'],
        },
        title: {
          fontSize: 14,
          fontFamily: FONT,
          color: cv('--chart-axis'),
          offsetCenter: [0, '35%'],
        },
        data: [{
          value: store.donePct,
          name: t('checklist.chart.overall'),
        }],
      }],
    }
  })

  // ── 2. BAR — Per-phase progress ──
  const barOption = computed(() => {
    const _theme = isDark.value
    const stats = store.phaseStats

    return {
      tooltip: {
        trigger: 'axis',
        backgroundColor: cv('--cl-surface'),
        borderColor: cv('--cl-line'),
        textStyle: {
          color: cv('--chart-text'),
          fontFamily: FONT,
          fontSize: 13,
        },
      },
      grid: {
        left: 8, right: 8, top: 24, bottom: 4,
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: stats.map((s) => t(s.nameKey)),
        axisLabel: {
          fontSize: 11,
          color: cv('--chart-axis'),
          fontFamily: FONT,
          rotate: window.innerWidth < 480 ? 30 : 0,
          interval: 0,
        },
        axisLine: { lineStyle: { color: cv('--cl-line') } },
        axisTick: { show: false },
      },
      yAxis: {
        type: 'value',
        max: 100,
        axisLabel: {
          fontSize: 11,
          color: cv('--chart-axis'),
          fontFamily: FONT,
          formatter: '{value}%',
        },
        splitLine: {
          lineStyle: { color: cv('--cl-line'), type: 'dashed' },
        },
      },
      series: [{
        type: 'bar',
        data: stats.map((s) => ({
          value: s.pct,
          itemStyle: {
            color: s.pct === 100
              ? cv('--chart-done')
              : cv('--chart-gold'),
            borderRadius: [6, 6, 0, 0],
          },
        })),
        barWidth: '45%',
        animationDuration: 800,
        animationEasing: 'cubicOut',
      }],
    }
  })

  // ── 3. PIE / DOUGHNUT — Priority breakdown ──
  const pieOption = computed(() => {
    const _theme = isDark.value

    return {
      tooltip: {
        backgroundColor: cv('--cl-surface'),
        borderColor: cv('--cl-line'),
        textStyle: {
          color: cv('--chart-text'),
          fontFamily: FONT,
        },
      },
      legend: {
        bottom: 0,
        textStyle: {
          color: cv('--chart-axis'),
          fontFamily: FONT,
          fontSize: 12,
        },
      },
      series: [{
        type: 'pie',
        radius: ['48%', '72%'],
        center: ['50%', '44%'],
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 6,
          borderColor: cv('--cl-bg'),
          borderWidth: 2,
        },
        label: { show: false },
        data: [
          {
            value: store.doneCount,
            name: t('checklist.chart.completed'),
            itemStyle: { color: cv('--chart-done') },
          },
          {
            value: store.highTotal - store.highDone,
            name: t('checklist.chart.high_priority'),
            itemStyle: { color: cv('--chart-priority') },
          },
          {
            value:
              store.totalCount -
              store.doneCount -
              (store.highTotal - store.highDone),
            name: t('checklist.chart.remaining'),
            itemStyle: { color: cv('--chart-todo') },
          },
        ],
        animationType: 'scale',
        animationDuration: 600,
      }],
    }
  })

  return { gaugeOption, barOption, pieOption }
}
```

> **Why `isDark.value` inside each computed?** ECharts options aren't CSS-aware — they receive color strings at build time. By reading `isDark` as a reactive dependency, the computed re-runs after the dark-mode class is toggled and `cv()` returns the updated CSS variable values.

### 8b. ChecklistCharts.vue — Dashboard Component

```vue
<!-- src/components/checklist/ChecklistCharts.vue -->
<template>
  <section class="chart-section">
    <h2 class="chart-section-title">
      {{ t('checklist.chart.title') }}
    </h2>

    <div class="chart-grid">
      <!-- Gauge: overall % -->
      <div class="chart-card">
        <p class="chart-label">{{ t('checklist.chart.overall') }}</p>
        <VChart
          class="chart"
          :option="gaugeOption"
          :autoresize="true"
          :style="{ height: chartHeight + 'px' }"
        />
      </div>

      <!-- Bar: per-phase -->
      <div class="chart-card chart-card--wide">
        <p class="chart-label">{{ t('checklist.chart.by_phase') }}</p>
        <VChart
          class="chart"
          :option="barOption"
          :autoresize="true"
          :style="{ height: (chartHeight + 20) + 'px' }"
        />
      </div>

      <!-- Pie: priority breakdown -->
      <div class="chart-card">
        <p class="chart-label">{{ t('checklist.chart.by_priority') }}</p>
        <VChart
          class="chart"
          :option="pieOption"
          :autoresize="true"
          :style="{ height: (chartHeight + 20) + 'px' }"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import VChart from 'vue-echarts'

// ── Selective ECharts imports for tree-shaking ──
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { GaugeChart, BarChart, PieChart } from 'echarts/charts'
import {
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from 'echarts/components'

use([
  CanvasRenderer,
  GaugeChart, BarChart, PieChart,
  TooltipComponent, LegendComponent, GridComponent,
])

import { useChecklistCharts } from '@/composables/useChecklistCharts'

const { t } = useI18n()
const { gaugeOption, barOption, pieOption } = useChecklistCharts()

// Dynamic chart height based on viewport
const chartHeight = ref(200)

function updateChartHeight() {
  chartHeight.value = window.innerWidth < 480 ? 160 : 200
}

onMounted(() => {
  updateChartHeight()
  window.addEventListener('resize', updateChartHeight)
})
onUnmounted(() => {
  window.removeEventListener('resize', updateChartHeight)
})
</script>

<style scoped>
.chart-section {
  max-width: 720px;
  margin: 0 auto;
  padding: 0 20px 20px;
}

.chart-section-title {
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--cl-gold);
  margin-bottom: 16px;
}

.chart-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.chart-card {
  background: var(--cl-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
  padding: 16px;
  transition: background-color 0.4s ease,
              box-shadow 0.3s ease;
}
.chart-card:hover {
  box-shadow: var(--shadow-hover);
}

.chart-card--wide {
  grid-column: span 2;
}

.chart-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--cl-text-soft);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 4px;
}

.chart { width: 100%; }

/* ── Mobile: stack everything ── */
@media (max-width: 600px) {
  .chart-grid {
    grid-template-columns: 1fr;
  }
  .chart-card--wide {
    grid-column: span 1;
  }
  .chart-section {
    padding: 0 12px 16px;
  }
}
</style>
```

---

## 9. Transitions & Animations

### 9a. Global transition classes — `_transitions.css`

```css
/* src/assets/styles/_transitions.css */

/* ── Phase expand / collapse ── */
.expand-enter-active {
  animation: expandDown 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.expand-leave-active {
  animation: expandDown 0.3s ease reverse;
}
@keyframes expandDown {
  from {
    opacity: 0;
    max-height: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    max-height: 2000px;
    transform: translateY(0);
  }
}

/* ── Task card staggered entrance ── */
.task-enter-active {
  animation: taskSlideIn 0.35s ease both;
  animation-delay: calc(var(--task-index, 0) * 40ms);
}
.task-leave-active {
  animation: taskSlideIn 0.25s ease reverse both;
}
@keyframes taskSlideIn {
  from { opacity: 0; transform: translateX(-12px); }
  to   { opacity: 1; transform: translateX(0); }
}

/* ── Checkbox pop ── */
.pop-enter-active {
  animation: popIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.pop-leave-active {
  animation: popIn 0.2s ease reverse;
}
@keyframes popIn {
  0%   { transform: scale(0) rotate(-45deg); opacity: 0; }
  100% { transform: scale(1) rotate(0deg);   opacity: 1; }
}

/* ── Icon flip (theme toggle) ── */
.icon-flip-enter-active,
.icon-flip-leave-active {
  transition: all 0.25s ease;
}
.icon-flip-enter-from {
  opacity: 0;
  transform: rotateY(90deg) scale(0.5);
}
.icon-flip-leave-to {
  opacity: 0;
  transform: rotateY(-90deg) scale(0.5);
}

/* ── Smooth theme crossfade on all elements ── */
.checklist-page,
.checklist-page *:not(svg):not(canvas) {
  transition-property: background-color, color, border-color, box-shadow;
  transition-duration: 0.4s;
  transition-timing-function: ease;
}

/* ── Respect reduced motion ── */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 9b. PhaseCard.vue — Expand/collapse with `<Transition>`

```vue
<!-- src/components/checklist/PhaseCard.vue -->
<template>
  <section class="phase-block">
    <div class="phase-header" @click="$emit('toggle')">
      <div class="phase-icon-wrap">
        <i :class="phase.icon" class="phase-icon" />
      </div>
      <div class="phase-meta">
        <span class="phase-timeline">{{ t(phase.timelineKey) }}</span>
        <h2 class="phase-name">{{ t(phase.nameKey) }}</h2>
        <div class="phase-progress-bar">
          <div class="phase-progress-fill"
               :style="{ width: phasePct + '%' }" />
        </div>
      </div>
      <button class="phase-toggle"
              :aria-label="isOpen ? 'Collapse' : 'Expand'">
        <Transition name="icon-flip" mode="out-in">
          <i v-if="isOpen"  class="pi pi-chevron-up"   key="up" />
          <i v-else         class="pi pi-chevron-down"  key="down" />
        </Transition>
      </button>
    </div>

    <!-- Animated task list -->
    <Transition name="expand">
      <div v-if="isOpen" class="task-grid">
        <TransitionGroup name="task" tag="div" class="task-list">
          <TaskCard
            v-for="(task, index) in phase.tasks"
            :key="task.id"
            :task="task"
            :style="{ '--task-index': index }"
            @toggle="$emit('task-toggle', task.id)"
          />
        </TransitionGroup>
      </div>
    </Transition>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import TaskCard from './TaskCard.vue'
import type { Phase } from '@/stores/checklistStore'

const props = defineProps<{
  phase: Phase
  isOpen: boolean
}>()

defineEmits<{
  toggle: []
  'task-toggle': [taskId: string]
}>()

const { t } = useI18n()

const phasePct = computed(() => {
  const total = props.phase.tasks.length
  const done = props.phase.tasks.filter((t) => t.completed).length
  return total ? Math.round((done / total) * 100) : 0
})
</script>
```

### 9c. TaskCard.vue — Animated checkbox

```vue
<!-- src/components/checklist/TaskCard.vue -->
<template>
  <div
    class="task-card"
    :class="{ done: task.completed, priority: task.priority === 'high' }"
    role="checkbox"
    :aria-checked="task.completed"
    tabindex="0"
    @click="$emit('toggle')"
    @keydown.enter.space.prevent="$emit('toggle')"
  >
    <div class="check-orb">
      <Transition name="pop">
        <i v-if="task.completed"
           class="pi pi-check check-icon"
           key="check" />
      </Transition>
      <svg v-if="!task.completed" class="orb-ring" viewBox="0 0 32 32">
        <circle cx="16" cy="16" r="14" />
      </svg>
    </div>

    <div class="task-body">
      <span class="task-title">{{ resolveText(task.titleKey) }}</span>
      <span v-if="task.noteKey" class="task-note">
        {{ resolveText(task.noteKey) }}
      </span>
    </div>

    <span v-if="task.priority === 'high'" class="priority-gem">
      <i class="pi pi-exclamation-triangle" />
    </span>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { Task } from '@/stores/checklistStore'

defineProps<{ task: Task }>()
defineEmits<{ toggle: [] }>()

const { t, te } = useI18n()

// Resolve i18n key or return raw text (for custom tasks)
function resolveText(key: string): string {
  return te(key) ? t(key) : key
}
</script>
```

---

## 10. Responsive Layout Strategy (1920 → 320 px)

### Breakpoint map

| Breakpoint         | Width        | Layout changes                                          |
|------------------- |------------- |-------------------------------------------------------- |
| Desktop XL         | ≥ 1200 px    | Task grid → 2 columns, chart grid → 2 cols             |
| Desktop            | 769–1199 px  | Single column tasks, 2-col charts                       |
| Tablet             | 481–768 px   | Reduced padding, smaller phase icons                    |
| Mobile             | 361–480 px   | Timeline line hidden, filter pills icon-only, 1-col all |
| Small mobile       | ≤ 360 px     | Compact spacing, smaller title, ring shrinks            |

### CSS — Mobile-first approach

```css
/* ── src/assets/styles/main.css ── */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto,
               'Helvetica Neue', Arial, sans-serif;
  -webkit-text-size-adjust: 100%;
}

body {
  min-height: 100vh;
  background: var(--cl-bg);
  color: var(--cl-text);
}
```

### Key responsive rules

```css
/* ── Base: smallest screens (320px) ── */
.timeline-area {
  max-width: 680px;
  margin: 0 auto;
  padding: 12px 12px 60px;
}

.hero-title { font-size: 38px; }
.progress-ring-wrap { width: 100px; height: 100px; }
.filter-pill .pill-text { display: none; }
.timeline-line { display: none; }

/* ── 480px+: basic mobile ── */
@media (min-width: 481px) {
  .timeline-area { padding: 16px 16px 60px; }
  .timeline-line { display: block; }
  .filter-pill .pill-text { display: inline; }
  .hero-title { font-size: clamp(44px, 8vw, 72px); }
  .progress-ring-wrap { width: 120px; height: 120px; }
}

/* ── 769px+: tablet/desktop ── */
@media (min-width: 769px) {
  .timeline-area { padding: 20px 20px 80px; }
  .chart-grid { grid-template-columns: 1fr 1fr; }
}

/* ── 1200px+: wide desktop ── */
@media (min-width: 1200px) {
  .timeline-area { max-width: 720px; }
  .task-list {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }
}
```

### Critical mobile rules

```css
/* Prevent iOS zoom on focus — all interactive text ≥ 16px */
.task-title,
.filter-pill,
input, select, textarea {
  font-size: 16px;   /* prevents mobile browser zoom */
}

/* Touch targets ≥ 44px per Apple HIG / WCAG */
.task-card      { min-height: 52px; }
.filter-pill    { min-height: 44px; }
.phase-toggle   { width: 44px; height: 44px; }
.theme-toggle   { width: 44px; height: 44px; }

/* Smooth scrolling on iOS */
.checklist-page {
  -webkit-overflow-scrolling: touch;
}

/* Safe area insets for notched devices */
.hero {
  padding-top: calc(56px + env(safe-area-inset-top));
}
.timeline-area {
  padding-bottom: calc(80px + env(safe-area-inset-bottom));
}
```

---

## 11. Accessibility & UX Notes

| Concern              | Implementation                                                                 |
|--------------------- |------------------------------------------------------------------------------- |
| Keyboard navigation  | `tabindex="0"` on task cards + `@keydown.enter.space` to toggle               |
| Screen readers       | `role="checkbox"` + `aria-checked` on tasks, `aria-label` on buttons          |
| Color contrast       | Light: `#3A3028` on `#FAF7F2` = 9.4:1 (AAA). Dark: `#F0EAE3` on `#1A1614`   |
| Reduced motion       | `@media (prefers-reduced-motion: reduce)` kills all animation                 |
| Focus indicators     | `:focus-visible` outline on all interactive elements                           |
| Min font size        | 16px on all interactive text (prevents mobile zoom)                           |

```css
/* Focus-visible ring */
.task-card:focus-visible,
.filter-pill:focus-visible,
.phase-toggle:focus-visible,
.theme-toggle:focus-visible {
  outline: 2px solid var(--cl-gold);
  outline-offset: 2px;
}
```

---

## 12. Testing Checklist

Before shipping, verify each of these:

### Functionality
- [ ] Toggling a task updates the ring, phase bar, and all 3 ECharts
- [ ] Filter pills correctly show All / To-do / Done / Priority subsets
- [ ] Phase expand/collapse animates smoothly (no layout jumps)
- [ ] 100% completion triggers celebration overlay
- [ ] Refresh preserves state (localStorage round-trip)
- [ ] Changing locale updates all labels, chart tooltips, and task titles
- [ ] Adding a custom task appears immediately and persists

### Theming
- [ ] Dark mode toggle updates all surfaces, text, borders, and shadows
- [ ] ECharts re-render with correct dark/light palette
- [ ] PrimeVue components follow `.dark-mode` class
- [ ] OS `prefers-color-scheme` detected on first visit
- [ ] Theme preference persists across refreshes

### Responsive
- [ ] 1920px: two-column task grid, two-column chart grid
- [ ] 1024px: single-column tasks, two-column charts
- [ ] 768px: reduced padding, smaller phase icons
- [ ] 480px: timeline line hidden, filter pills icon-only
- [ ] 375px (iPhone SE): no horizontal overflow, all text readable
- [ ] 320px: compact title, smaller ring, no clipping

### Accessibility
- [ ] Full keyboard navigation (Tab → Enter/Space)
- [ ] VoiceOver / NVDA announces checkbox state
- [ ] `prefers-reduced-motion` disables all animations
- [ ] Focus ring visible on all interactive elements
- [ ] No text smaller than 16px on interactive elements

---

> **Implementation order:** Store → Theme composable → CSS variables → i18n files → Page component → Sub-components → ECharts → Transitions → Responsive polish → Accessibility pass. Each layer is independently testable.
