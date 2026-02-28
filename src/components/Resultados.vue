<template>

    <!-- ══ SIN DATOS ═════════════════════════════════════════════════════════ -->
    <div v-if="!store.isReady"
        style="text-align:center; font-size:12px; color:var(--text-muted); font-style:italic;
               padding:24px; border:1px dashed var(--border); border-radius:var(--radius);">
        Completá el período y el fee mensual para ver el resumen ↑
    </div>

    <!-- ══ RESUMEN ════════════════════════════════════════════════════════════ -->
    <div v-else class="card">

        <!-- Header con totales destacados -->
        <div style="padding:20px 20px 16px; border-bottom:1px solid var(--border-soft);
                    display:flex; align-items:flex-end; justify-content:space-between; gap:16px;
                    background: linear-gradient(135deg, rgba(216,89,68,0.07) 0%, transparent 60%);">
            <div>
                <p style="font-size:11px; font-weight:600; letter-spacing:.08em; text-transform:uppercase; color:var(--text-muted); margin-bottom:4px;">
                    Resumen — {{ nombreMes(store.mesFacturar) }} {{ store.anioFacturar }}
                </p>
                <div style="display:flex; align-items:baseline; gap:8px;">
                    <span style="font-size:32px; font-weight:700; font-family:var(--font-mono); color:var(--accent); letter-spacing:-1px;">
                        {{ fm(store.grandTotalPrecio) }}
                    </span>
                    <span style="font-size:13px; color:var(--text-secondary);">
                        {{ store.grandTotalDias }} días facturables
                    </span>
                </div>
            </div>
            <div style="display:flex; flex-direction:column; gap:5px; align-items:flex-end; flex-shrink:0;">
                <span class="stat-badge">
                    <span style="color:var(--text-muted);">fee</span>
                    <strong>{{ fm(store.feeMensual) }}</strong>
                </span>
                <span class="stat-badge">
                    <span style="color:var(--text-muted);">/día</span>
                    <strong style="color:var(--accent);">{{ fm(store.valorPorHora) }}</strong>
                </span>
            </div>
        </div>

        <!-- Tabla -->
        <div style="overflow-x:auto;">
            <table style="width:100%; border-collapse:collapse;">
                <thead>
                    <tr style="border-bottom:1px solid var(--border-soft);">
                        <th style="padding:9px 16px; text-align:left; font-size:10px; font-weight:600;
                                   letter-spacing:.08em; text-transform:uppercase; color:var(--text-muted);">Concepto</th>
                        <th style="padding:9px 12px; text-align:center; font-size:10px; font-weight:600;
                                   letter-spacing:.08em; text-transform:uppercase; color:var(--text-muted); width:60px;">Días</th>
                        <th style="padding:9px 16px; text-align:right; font-size:10px; font-weight:600;
                                   letter-spacing:.08em; text-transform:uppercase; color:var(--text-muted); width:130px;">Monto</th>
                        <th style="padding:9px 16px; text-align:left; font-size:10px; font-weight:600;
                                   letter-spacing:.08em; text-transform:uppercase; color:var(--text-muted);">Detalle</th>
                    </tr>
                </thead>
                <tbody>

                    <!-- Fee principal -->
                    <tr style="border-bottom:1px solid var(--border-soft);">
                        <td style="padding:12px 16px; vertical-align:top;">
                            <p style="font-size:13px; font-weight:600; color:var(--text-primary);">Fee del mes</p>
                            <p style="font-size:11px; color:var(--text-muted); margin-top:2px; font-family:var(--font-mono);">
                                {{ store.cantDiasLaborables }} lab.
                                <template v-if="store.cantVacacionesRest"> − {{ store.cantVacacionesRest }} rest</template>
                                <template v-if="store.cantDiasSick"> − {{ store.cantDiasSick }} sick</template>
                            </p>
                        </td>
                        <td style="padding:12px; vertical-align:top; text-align:center;">
                            <span style="font-size:20px; font-weight:700; font-family:var(--font-mono); color:var(--text-primary);">
                                {{ store.totDiasFee }}
                            </span>
                        </td>
                        <td style="padding:12px 16px; vertical-align:top; text-align:right;">
                            <span style="font-size:15px; font-weight:700; font-family:var(--font-mono); color:var(--blue);">
                                {{ fm(store.totPrecioFee) }}
                            </span>
                        </td>
                        <td style="padding:12px 16px; vertical-align:top;">
                            <div v-if="notaFechasFee" style="display:flex; align-items:flex-start; gap:8px;">
                                <pre style="font-size:11px; color:var(--text-muted); white-space:pre-wrap; flex:1; font-family:var(--font-mono); line-height:1.6;">{{ notaFechasFee }}</pre>
                                <button class="btn btn-ghost" style="padding:3px 8px; font-size:11px; flex-shrink:0;"
                                    @click="copiar(notaFechasFee, 'copiado')">
                                    {{ flags.copiado ? '✓' : '⎘' }}
                                </button>
                            </div>
                            <span v-else style="font-size:11px; color:var(--text-muted); font-style:italic;">—</span>
                        </td>
                    </tr>

                    <!-- Vacaciones -->
                    <tr v-if="store.cantVacacionesRest > 0" style="border-bottom:1px solid var(--border-soft); background:rgba(16,185,129,0.03);">
                        <td style="padding:10px 16px; vertical-align:top;">
                            <span style="font-size:12px; font-weight:500; color:var(--green);">⊕ Rest Bonus</span>
                        </td>
                        <td style="padding:10px 12px; text-align:center; vertical-align:top;">
                            <span style="font-size:16px; font-weight:700; font-family:var(--font-mono); color:var(--green);">{{ store.cantVacacionesRest }}</span>
                        </td>
                        <td style="padding:10px 16px; text-align:right; vertical-align:top;">
                            <span style="font-size:13px; font-weight:600; font-family:var(--font-mono); color:var(--green);">{{ fm(store.precioVacacionesRest) }}</span>
                        </td>
                        <td style="padding:10px 16px; vertical-align:top;">
                            <div style="display:flex; flex-wrap:wrap; gap:4px;">
                                <span v-for="d in store.diasVacaciones" :key="d" class="chip chip-green">{{ ff(d) }}</span>
                            </div>
                        </td>
                    </tr>

                    <!-- Sick -->
                    <tr v-if="store.cantDiasSick > 0" style="border-bottom:1px solid var(--border-soft); background:rgba(244,63,94,0.03);">
                        <td style="padding:10px 16px; vertical-align:top;">
                            <span style="font-size:12px; font-weight:500; color:var(--red);">⊘ Sick Days</span>
                        </td>
                        <td style="padding:10px 12px; text-align:center; vertical-align:top;">
                            <span style="font-size:16px; font-weight:700; font-family:var(--font-mono); color:var(--red);">{{ store.cantDiasSick }}</span>
                        </td>
                        <td style="padding:10px 16px; text-align:right; vertical-align:top;">
                            <span style="font-size:13px; font-weight:600; font-family:var(--font-mono); color:var(--red);">{{ fm(store.precioDiasSick) }}</span>
                        </td>
                        <td style="padding:10px 16px; vertical-align:top;">
                            <div style="display:flex; flex-wrap:wrap; gap:4px;">
                                <span v-for="d in store.diasSick" :key="d" class="chip chip-red">{{ ff(d) }}</span>
                            </div>
                        </td>
                    </tr>

                    <!-- Feriados trabajados -->
                    <tr v-if="store.cantFeriadosTrabajados > 0" style="border-bottom:1px solid var(--border-soft); background:rgba(245,158,11,0.03);">
                        <td style="padding:10px 16px; vertical-align:top;">
                            <span style="font-size:12px; font-weight:500; color:var(--accent);">◷ Holiday Worked</span>
                        </td>
                        <td style="padding:10px 12px; text-align:center; vertical-align:top;">
                            <span style="font-size:16px; font-weight:700; font-family:var(--font-mono); color:var(--accent);">{{ store.cantFeriadosTrabajados }}</span>
                        </td>
                        <td style="padding:10px 16px; text-align:right; vertical-align:top;">
                            <span style="font-size:13px; font-weight:600; font-family:var(--font-mono); color:var(--accent);">{{ fm(store.precioFeriadosTrabajados) }}</span>
                        </td>
                        <td style="padding:10px 16px; vertical-align:top;">
                            <div style="display:flex; flex-wrap:wrap; gap:4px;">
                                <span v-for="f in store.feriadosTrabajados" :key="`${f.dia}-${f.mes}`"
                                    class="chip chip-amber" :title="f.motivo">
                                    {{ pad(f.dia) }}/{{ pad(f.mes) }}
                                </span>
                            </div>
                        </td>
                    </tr>

                    <!-- Training -->
                    <tr v-if="store.trainingItems.length > 0" style="border-bottom:1px solid var(--border-soft); background:rgba(167,139,250,0.03);">
                        <td style="padding:10px 16px; vertical-align:top;">
                            <span style="font-size:12px; font-weight:500; color:var(--violet);">◈ Training</span>
                        </td>
                        <td style="padding:10px 12px; text-align:center; vertical-align:top;">
                            <span style="font-size:16px; font-weight:700; font-family:var(--font-mono); color:var(--violet);">—</span>
                        </td>
                        <td style="padding:10px 16px; text-align:right; vertical-align:top;">
                            <span style="font-size:13px; font-weight:600; font-family:var(--font-mono); color:var(--violet);">
                                USD {{ store.totalTrainingUSD.toFixed(2) }}
                            </span>
                        </td>
                        <td style="padding:10px 16px; vertical-align:top;">
                            <div style="display:flex; align-items:flex-start; gap:8px;">
                                <pre style="font-size:11px; color:var(--text-muted); white-space:pre-wrap; flex:1; font-family:var(--font-mono); line-height:1.6;">{{ store.notaTraining }}</pre>
                                <button class="btn btn-ghost" style="padding:3px 8px; font-size:11px; flex-shrink:0;"
                                    @click="copiar(store.notaTraining, 'copiadoTraining')">
                                    {{ flags.copiadoTraining ? '✓' : '⎘' }}
                                </button>
                            </div>
                        </td>
                    </tr>

                </tbody>

                <!-- Grand Total -->
                <tfoot>
                    <tr style="background:rgba(216,89,68,0.08); border-top:1px solid rgba(216,89,68,0.25);">
                        <td style="padding:14px 16px; font-size:11px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:var(--accent);">
                            Total a facturar
                        </td>
                        <td style="padding:14px 12px; text-align:center;">
                            <span style="font-size:22px; font-weight:800; font-family:var(--font-mono); color:var(--accent);">
                                {{ store.grandTotalDias }}
                            </span>
                        </td>
                        <td style="padding:14px 16px; text-align:right;">
                            <span style="font-size:18px; font-weight:800; font-family:var(--font-mono); color:var(--accent);">
                                {{ fm(store.grandTotalPrecio) }}
                            </span>
                        </td>
                        <td style="padding:14px 16px;"></td>
                    </tr>
                </tfoot>
            </table>
        </div>

        <!-- Invoice copy block -->
        <div style="margin:0 16px 16px; border:1px solid var(--border-soft); border-radius:var(--radius-sm); overflow:hidden;">
            <div style="display:flex; align-items:center; justify-content:space-between;
                        padding:8px 12px; background:var(--bg); border-bottom:1px solid var(--border-soft);">
                <span style="font-size:10px; font-weight:600; letter-spacing:.08em; text-transform:uppercase; color:var(--text-muted);">
                    ⎘ Nota para invoice
                </span>
                <button class="btn btn-ghost" style="padding:3px 10px; font-size:11px;"
                    @click="copiar(notaInvoice, 'copiadoNota')">
                    {{ flags.copiadoNota ? '✓ Copiado' : 'Copiar' }}
                </button>
            </div>
            <pre style="margin:0; padding:12px; font-size:11px; line-height:1.7;
                        color:var(--text-secondary); background:var(--bg);
                        white-space:pre-wrap; font-family:var(--font-mono);">{{ notaInvoice }}</pre>
        </div>

    </div>
</template>

<script>
import { useGlobalStore } from "@/stores/global";
import { MESES } from "@/services/diasLaborables";

export default {
    name: "Resultados",
    data() {
        return {
            store: useGlobalStore(),
            flags: { copiado: false, copiadoNota: false, copiadoTraining: false },
        };
    },
    computed: {
        notaFechasFee() {
            return [
                ...this.store.diasVacaciones.map((d) => `${this.ff(d)} (rest)`),
                ...this.store.diasSick.map((d) => `${this.ff(d)} (sick)`),
            ].join("\n");
        },
        notaInvoice() {
            const s = this.store;
            const m = this.nombreMes(s.mesFacturar);
            const L = [];
            L.push(`${m} ${s.anioFacturar} — Fee: ${this.fm(s.feeMensual)} | Valor/día: ${this.fm(s.valorPorHora)}`);
            L.push("");
            L.push(`Fee:  ${s.totDiasFee} días × ${this.fm(s.valorPorHora)} = ${this.fm(s.totPrecioFee)}`);
            if (s.cantVacacionesRest > 0)
                L.push(`Rest: ${s.cantVacacionesRest}d [${s.diasVacaciones.map(this.ff).join(", ")}] = ${this.fm(s.precioVacacionesRest)}`);
            if (s.cantDiasSick > 0)
                L.push(`Sick: ${s.cantDiasSick}d [${s.diasSick.map(this.ff).join(", ")}] = ${this.fm(s.precioDiasSick)}`);
            if (s.cantFeriadosTrabajados > 0) {
                const ff = s.feriadosTrabajados.map(f => `${this.pad(f.dia)}/${this.pad(f.mes)}`).join(", ");
                L.push(`Holiday Worked: ${s.cantFeriadosTrabajados}d [${ff}] = ${this.fm(s.precioFeriadosTrabajados)}`);
            }
            if (s.trainingItems.length > 0) {
                L.push("");
                L.push(`Training (USD ${s.totalTrainingUSD.toFixed(2)}):`);
                L.push(s.notaTraining);
            }
            L.push("");
            L.push(`TOTAL: ${s.grandTotalDias} días = ${this.fm(s.grandTotalPrecio)}`);
            return L.join("\n");
        },
    },
    methods: {
        fm(val) {
            return new Intl.NumberFormat("es-AR", {
                style: "currency", currency: "USD", minimumFractionDigits: 2,
            }).format(val || 0);
        },
        ff(s)  { const [,m,d] = s.split("-"); return `${d}/${m}`; },
        pad(n) { return String(n).padStart(2, "0"); },
        nombreMes(num) { return MESES.find((m) => m.value === num)?.label ?? ""; },
        async copiar(texto, flag) {
            await navigator.clipboard.writeText(texto);
            this.flags[flag] = true;
            setTimeout(() => (this.flags[flag] = false), 2000);
        },
    },
};
</script>