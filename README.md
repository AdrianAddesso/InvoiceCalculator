# InvoiceCalc — Billing Days Calculator

A tool for calculating billable days and amounts each month, accounting for Argentine public holidays, rest bonus days, sick days, and training expenses with automatic ARS → USD conversion.

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Vue 3 (Options API) |
| State management | Pinia |
| Styles | UnoCSS + custom CSS (base.css) |
| HTTP | Axios |
| Build | Vite 7 |
| Holiday data | nolaborables.com.ar (fallback: argentinadatos.com) |
| USD exchange rate | dolarapi.com (BCRA Official) |

---

## Project structure

```
src/
├── assets/
│   └── base.css              # Design system: variables, primitives (.card, .btn, .inp, .chip…)
├── components/
│   ├── Calculadora.vue        # Input form
│   └── Resultados.vue         # Summary table and invoice note
├── services/
│   ├── diasLaborables.js      # Counts Mon–Fri days in a given month/year (no external deps)
│   ├── feriados.js            # Fetches public holidays via API (with automatic fallback)
│   └── training.js            # Converts ARS → USD using BCRA rate (10-min in-memory cache)
├── stores/
│   └── global.js              # Pinia store with all state and reactive calculations
├── App.vue                    # Shell: header, layout, footer
└── main.js                    # Bootstrap: Pinia + UnoCSS + base.css
```

---

## Setup

```bash
npm install
npm run dev
```

> Requires Node `^20.19.0` or `>=22.12.0`

---

## Calculation logic

### Working days
The `diasLaborables.js` service iterates over every day in the month and counts those falling Monday through Friday (`getDay() !== 0 && !== 6`). Public holidays are not excluded from this count — they are handled separately.

### Store formulas

```
valorPorHora (daily rate)  = feeMensual / cantDiasLaborables

totDiasFee                 = cantDiasLaborables − cantVacacionesRest − cantDiasSick
totPrecioFee               = totDiasFee × valorPorHora

precioVacacionesRest       = cantVacacionesRest × valorPorHora
precioDiasSick             = cantDiasSick × valorPorHora
precioFeriadosTrabajados   = cantFeriadosTrabajados × valorPorHora

grandTotalDias             = totDiasFee + cantFeriadosTrabajados
grandTotalPrecio           = totPrecioFee
                           + precioVacacionesRest
                           + precioDiasSick
                           + precioFeriadosTrabajados
                           + totalTrainingUSD
```

### Training (ARS → USD)
Calls `dolarapi.com/v1/dolares/oficial` to fetch the **sell rate** published by the BCRA. The exchange rate is cached in memory for **10 minutes** to avoid hammering the API. Each item stores the ARS amount, its USD equivalent, the exchange rate used, and the exact query timestamp formatted as `dd/mm/yyyy hh:mm:ss`.

---

## External services

### Public holidays
- **Primary:** `GET https://nolaborables.com.ar/api/v2/feriados/{year}`
  Returns `[{ dia, mes, motivo, tipo, … }]`
- **Automatic fallback:** `GET https://api.argentinadatos.com/v1/feriados/{year}`
  Returns `[{ fecha: "YYYY-MM-DD", descripcion, tipo, … }]` — normalized to the same internal schema before use.

If both sources fail, an error message is shown and the holiday list is left empty — the rest of the calculator continues to work normally.

### BCRA exchange rate
- `GET https://dolarapi.com/v1/dolares/oficial`
- Field used: `venta` (sell rate)
- No authentication required, CORS enabled

---

## Invoice note

`Resultados.vue` automatically generates a ready-to-copy text block with the full month breakdown:

```
February 2026 — Fee: USD 4,160.00 | Daily rate: USD 192.59

Fee:  18 days × USD 192.59 = USD 3,466.67
Rest: 1d [14/02] = USD 192.59
Holiday Worked: 1d [24/02] = USD 192.59

Training (USD 45.23):
• React Course: ARS 50,000 = USD 45.23 (BCRA sell rate: $1105 — 28/02/2026 10:14:32)

TOTAL: 19 days = USD 3,897.08
```

Each table row also has its own individual copy button (⎘).

---

## Design system

Global styles live in `src/assets/base.css` and are imported from `main.js`. CSS custom properties serve as design tokens:

| Token | Value | Role |
|---|---|---|
| `--bg` | `#111822` | Main background (dark navy) |
| `--bg-card` | `#18202e` | Card surface |
| `--border` | `#383331` | Borders (warm charcoal) |
| `--text-primary` | `#f6dcb5` | Primary text (warm cream) |
| `--text-secondary` | `#c9a87c` | Secondary text |
| `--accent` | `#d85944` | Coral accent — CTAs and totals |

Typography: `Outfit` (UI) + `JetBrains Mono` (numbers and code) via Google Fonts.

---

## Available scripts

```bash
npm run dev      # development server with HMR
npm run build    # production build
npm run preview  # preview the production build
```