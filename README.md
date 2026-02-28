# InvoiceCalc — Calculadora de Días a Facturar

Herramienta para calcular los días y montos a facturar mensualmente, contemplando feriados argentinos, días de rest bonus, sick days y gastos de training con conversión automática ARS → USD.

---

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Vue 3 (Options API) |
| Estado global | Pinia |
| Estilos | UnoCSS + CSS custom (base.css) |
| HTTP | Axios |
| Build | Vite 7 |
| Fuente de feriados | nolaborables.com.ar (fallback: argentinadatos.com) |
| Cotización USD | dolarapi.com (BCRA Oficial) |

---

## Estructura del proyecto

```
src/
├── assets/
│   └── base.css              # Design system: variables, primitivos (.card, .btn, .inp, .chip…)
├── components/
│   ├── Calculadora.vue        # Formulario de ingreso de datos
│   └── Resultados.vue         # Tabla de resumen y nota de invoice
├── services/
│   ├── diasLaborables.js      # Cuenta días L–V de un mes/año (sin deps externas)
│   ├── feriados.js            # Obtiene feriados del mes vía API (con fallback)
│   └── training.js            # Convierte ARS → USD con cotización BCRA (caché 10 min)
├── stores/
│   └── global.js              # Store Pinia con todo el estado y cálculos reactivos
├── App.vue                    # Shell: header, layout, footer
└── main.js                    # Bootstrap: Pinia + UnoCSS + base.css
```

---

## Instalación

```bash
npm install
npm run dev
```

> Requiere Node `^20.19.0` o `>=22.12.0`

---

## Lógica de cálculo

### Días laborables
El servicio `diasLaborables.js` recorre todos los días del mes y cuenta los que caen en lunes a viernes (`getDay() !== 0 && !== 6`). No incluye lógica de feriados — ese descuento no aplica al conteo base.

### Fórmulas del store

```
valorPorHora          = feeMensual / cantDiasLaborables

totDiasFee            = cantDiasLaborables − cantVacacionesRest − cantDiasSick
totPrecioFee          = totDiasFee × valorPorHora

precioVacacionesRest  = cantVacacionesRest × valorPorHora
precioDiasSick        = cantDiasSick × valorPorHora
precioFeriadosTrabajados = cantFeriadosTrabajados × valorPorHora

grandTotalDias        = totDiasFee + cantFeriadosTrabajados
grandTotalPrecio      = totPrecioFee
                      + precioVacacionesRest
                      + precioDiasSick
                      + precioFeriadosTrabajados
                      + totalTrainingUSD
```

### Training (ARS → USD)
Llama a `dolarapi.com/v1/dolares/oficial` para obtener el tipo de cambio de **venta** publicado por el BCRA. La cotización se cachea en memoria durante **10 minutos** para no saturar la API. Cada item guarda el monto ARS, el equivalente en USD, el valor de venta usado y el timestamp exacto de la consulta en formato `dd/mm/aaaa hh:mm:ss`.

---

## Servicios externos

### Feriados
- **Primario:** `GET https://nolaborables.com.ar/api/v2/feriados/{año}`
  Responde `[{ dia, mes, motivo, tipo, … }]`
- **Fallback automático:** `GET https://api.argentinadatos.com/v1/feriados/{año}`
  Responde `[{ fecha: "YYYY-MM-DD", descripcion, tipo, … }]` — se normaliza al mismo schema interno antes de usarse.

Si ambas fuentes fallan, se muestra un mensaje de error al usuario y la lista de feriados queda vacía (no bloquea el resto de la calculadora).

### Cotización BCRA
- `GET https://dolarapi.com/v1/dolares/oficial`
- Campo usado: `venta`
- Sin autenticación requerida, CORS habilitado

---

## Nota de invoice

El componente `Resultados.vue` genera automáticamente un bloque de texto con el detalle completo del mes, listo para copiar y pegar en una invoice:

```
Febrero 2026 — Fee: USD 4.160,00 | Valor/día: USD 192,59

Fee:  18 días × USD 192,59 = USD 3.466,67
Rest: 1d [14/02] = USD 192,59
Holiday Worked: 1d [24/02] = USD 192,59

Training (USD 45.23):
• Curso React: ARS 50.000 = USD 45,23 (cotización venta BCRA: $1105 — 28/02/2026 10:14:32)

TOTAL: 19 días = USD 3.897,08
```

Cada sección de la tabla también tiene su propio botón de copia individual (⎘).

---

## Design system

Los estilos globales viven en `src/assets/base.css` e importan desde `main.js`. Usan CSS custom properties como sistema de tokens:

| Token | Valor | Uso |
|---|---|---|
| `--bg` | `#111822` | Fondo principal (navy oscuro) |
| `--bg-card` | `#18202e` | Superficie de cards |
| `--border` | `#383331` | Bordes (charcoal cálido) |
| `--text-primary` | `#f6dcb5` | Texto principal (cream) |
| `--text-secondary` | `#c9a87c` | Texto secundario |
| `--accent` | `#d85944` | Acento coral — CTAs y totales |

Tipografía: `Outfit` (UI) + `JetBrains Mono` (números y código) vía Google Fonts.

---

## Scripts disponibles

```bash
npm run dev      # servidor de desarrollo con HMR
npm run build    # build de producción
npm run preview  # previsualizar el build
```