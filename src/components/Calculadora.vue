<template>
<section style="display:flex; flex-direction:column; gap:16px;">

    <!-- ══ PERÍODO + FEE ══════════════════════════════════════════════════════ -->
    <div class="card">
        <div class="card-header">
            <span><span class="card-header-icon">◫</span> Período &amp; Fee</span>
        </div>
        <div class="card-body">
            <div style="display:grid; grid-template-columns:1fr 1fr 1fr auto; gap:12px; align-items:end;">

                <div style="display:flex; flex-direction:column; gap:5px;">
                    <label style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; letter-spacing:.06em;">Mes</label>
                    <select class="inp" v-model.number="mes" @change="onPeriodoChange">
                        <option v-for="m in MESES" :key="m.value" :value="m.value">{{ m.label }}</option>
                    </select>
                </div>

                <div style="display:flex; flex-direction:column; gap:5px;">
                    <label style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; letter-spacing:.06em;">Año</label>
                    <input type="number" class="inp" v-model.number="anio" min="2020" max="2100" @change="onPeriodoChange" />
                </div>

                <div style="display:flex; flex-direction:column; gap:5px;">
                    <label style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; letter-spacing:.06em;">Fee mensual (USD)</label>
                    <div class="inp-prefix-wrap">
                        <span class="prefix">$</span>
                        <input type="number" class="inp" placeholder="1500" min="0" step="0.01" @input="onFeeChange" />
                    </div>
                </div>
            </div>
            <div style="display: flex; flex-direction: row; align-items: center; gap: 8px; padding-bottom: 1px; margin-top: 8px;">
                <span class="stat-badge">
                    <span style="color: var(--text-muted);">Laborales</span>
                    <strong>{{ store.cantDiasLaborables }}</strong>
                </span>
                <span v-if="store.isReady" class="stat-badge" style="border-color: rgba(245,158,11,0.3);">
                    <span style="color: var(--text-muted);">$ día</span>
                    <strong style="color: var(--accent);">{{ fm(store.valorPorHora) }}</strong>
                </span>
            </div>
        </div>
    </div>

    <!-- ══ FERIADOS ═══════════════════════════════════════════════════════════ -->
    <div class="card">
        <div class="card-header">
            <span><span class="card-header-icon">◷</span> Feriados del mes — ¿cuáles trabajaste?</span>
            <span v-if="store.cantFeriadosTrabajados > 0" class="chip chip-green">
                {{ store.cantFeriadosTrabajados }} seleccionado{{ store.cantFeriadosTrabajados > 1 ? 's' : '' }}
            </span>
        </div>
        <div class="card-body">
            <!-- Loading -->
            <div v-if="store.loadingFeriados" style="display:flex; align-items:center; gap:8px; color:var(--text-muted); font-size:13px;">
                <svg class="spin" width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2.5" stroke-dasharray="28 56" />
                </svg>
                Cargando feriados...
            </div>
            <!-- Error -->
            <div v-else-if="store.errorFeriados"
                style="font-size:12px; color:var(--red); background:var(--red-dim); border:1px solid rgba(244,63,94,.2); border-radius:6px; padding:10px 12px;">
                ⚠ {{ store.errorFeriados }}
            </div>
            <!-- Empty -->
            <p v-else-if="store.feriadosDelMes.length === 0"
                style="font-size:12px; color:var(--text-muted); font-style:italic;">
                Sin feriados nacionales este mes.
            </p>
            <!-- Lista -->
            <div v-else style="display:grid; grid-template-columns:1fr 1fr; gap:6px;">
                <label
                    v-for="f in store.feriadosDelMes"
                    :key="`${f.dia}-${f.mes}`"
                    :style="{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '10px',
                        padding: '9px 12px',
                        borderRadius: '6px',
                        border: store.isFeriadoTrabajado(f)
                            ? '1px solid rgba(16,185,129,.35)'
                            : '1px solid var(--border-soft)',
                        background: store.isFeriadoTrabajado(f)
                            ? 'var(--green-dim)'
                            : 'var(--bg)',
                        cursor: 'pointer',
                        transition: 'all .15s',
                    }"
                >
                    <input
                        type="checkbox"
                        :checked="store.isFeriadoTrabajado(f)"
                        @change="store.toggleFeriadoTrabajado(f)"
                        style="flex-shrink:0; width:14px; height:14px; margin-top:2px; accent-color:var(--green); cursor:pointer;"
                    />
                    <span style="line-height:1.4; user-select:none;">
                        <span style="font-family:var(--font-mono); font-size:11px; color:var(--accent); font-weight:500;">
                            {{ pad(f.dia) }}/{{ pad(f.mes) }}
                        </span>
                        <span style="font-size:12px; color:var(--text-secondary); margin-left:5px;">{{ f.motivo }}</span>
                        <span style="font-size:10px; color:var(--text-muted); margin-left:4px;">({{ f.tipo }})</span>
                    </span>
                </label>
            </div>
        </div>
    </div>

    <!-- ══ VACACIONES + SICK ══════════════════════════════════════════════════ -->
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">

        <!-- Vacaciones -->
        <div class="card">
            <div class="card-header">
                <span><span class="card-header-icon" style="color:var(--green);">⊕</span> Rest Bonus</span>
                <span v-if="store.cantVacacionesRest > 0" class="chip chip-green">
                    {{ store.cantVacacionesRest }}d · {{ fm(store.precioVacacionesRest) }}
                </span>
            </div>
            <div class="card-body" style="display:flex; flex-direction:column; gap:10px;">
                <div style="display:flex; gap:8px;">
                    <input type="date" class="inp" style="flex:1;" v-model="nuevaVacacion"
                        :min="primerDiaMes" :max="ultimoDiaMes" />
                    <button class="btn btn-green" @click="agregarVacacion">+ Add</button>
                </div>
                <p v-if="store.diasVacaciones.length === 0"
                    style="font-size:11px; color:var(--text-muted); font-style:italic;">Sin días registrados.</p>
                <div v-else style="display:flex; flex-wrap:wrap; gap:5px;">
                    <span v-for="d in store.diasVacaciones" :key="d" class="chip chip-green">
                        {{ ff(d) }}
                        <button class="chip-x" @click="store.removeDiaVacaciones(d)">×</button>
                    </span>
                </div>
            </div>
        </div>

        <!-- Sick -->
        <div class="card">
            <div class="card-header">
                <span><span class="card-header-icon" style="color:var(--red);">⊘</span> Sick Days</span>
                <span v-if="store.cantDiasSick > 0" class="chip chip-red">
                    {{ store.cantDiasSick }}d · {{ fm(store.precioDiasSick) }}
                </span>
            </div>
            <div class="card-body" style="display:flex; flex-direction:column; gap:10px;">
                <div style="display:flex; gap:8px;">
                    <input type="date" class="inp" style="flex:1;" v-model="nuevoDiaSick"
                        :min="primerDiaMes" :max="ultimoDiaMes" />
                    <button class="btn btn-red" @click="agregarSick">+ Add</button>
                </div>
                <p v-if="store.diasSick.length === 0"
                    style="font-size:11px; color:var(--text-muted); font-style:italic;">Sin días registrados.</p>
                <div v-else style="display:flex; flex-wrap:wrap; gap:5px;">
                    <span v-for="d in store.diasSick" :key="d" class="chip chip-red">
                        {{ ff(d) }}
                        <button class="chip-x" @click="store.removeDiaSick(d)">×</button>
                    </span>
                </div>
            </div>
        </div>
    </div>

    <!-- ══ TRAINING ═══════════════════════════════════════════════════════════ -->
    <div class="card">
        <div class="card-header">
            <span><span class="card-header-icon" style="color:var(--violet);">◈</span> Training — ARS → USD (BCRA Oficial)</span>
            <span v-if="store.trainingItems.length > 0" class="chip chip-violet">
                Total USD {{ store.totalTrainingUSD.toFixed(2) }}
            </span>
        </div>
        <div class="card-body" style="display:flex; flex-direction:column; gap:12px;">
            <!-- Input row -->
            <div style="display:grid; grid-template-columns:1fr 1fr auto; gap:8px; align-items:end;">
                <div style="display:flex; flex-direction:column; gap:5px;">
                    <label style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; letter-spacing:.06em;">Descripción</label>
                    <input type="text" class="inp" v-model="trainingDesc" placeholder="ej. Curso React" />
                </div>
                <div style="display:flex; flex-direction:column; gap:5px;">
                    <label style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; letter-spacing:.06em;">Monto ARS</label>
                    <div class="inp-prefix-wrap">
                        <span class="prefix">$</span>
                        <input type="number" class="inp" v-model.number="trainingARS" placeholder="0.00" min="0" step="0.01" />
                    </div>
                </div>
                <button class="btn btn-violet"
                    style="align-self:end;"
                    @click="agregarTraining"
                    :disabled="store.loadingTraining || !trainingDesc || !trainingARS">
                    <svg v-if="store.loadingTraining" class="spin" width="12" height="12" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2.5" stroke-dasharray="28 56"/>
                    </svg>
                    {{ store.loadingTraining ? 'Convirtiendo…' : '+ Agregar' }}
                </button>
            </div>

            <!-- Error -->
            <div v-if="store.errorTraining"
                style="font-size:12px; color:var(--red); background:var(--red-dim); border:1px solid rgba(244,63,94,.2); border-radius:6px; padding:10px 12px;">
                ⚠ {{ store.errorTraining }}
            </div>

            <!-- Items list -->
            <div v-if="store.trainingItems.length > 0" style="display:flex; flex-direction:column; gap:6px;">
                <div v-for="item in store.trainingItems" :key="item.id"
                    style="display:flex; align-items:flex-start; justify-content:space-between; gap:12px;
                           background:var(--bg); border:1px solid var(--border-soft); border-radius:6px;
                           padding:10px 12px;">
                    <div style="flex:1; min-width:0;">
                        <p style="font-size:13px; font-weight:600; color:var(--text-primary); margin-bottom:2px;">
                            {{ item.descripcion }}
                        </p>
                        <p style="font-size:11px; color:var(--text-muted); font-family:var(--font-mono);">
                            ARS {{ Number(item.montoARS).toLocaleString('es-AR') }}
                            <span style="color:var(--text-secondary);"> → </span>
                            <span style="color:var(--violet); font-weight:500;">USD {{ Number(item.usd).toFixed(2) }}</span>
                            <span style="color:var(--border); margin:0 4px;">·</span>
                            cotiz. ${{ item.venta }}
                            <span style="color:var(--border); margin:0 4px;">·</span>
                            {{ item.timestamp }}
                        </p>
                    </div>
                    <button
                        style="background:none; border:none; cursor:pointer; color:var(--text-muted); font-size:16px; line-height:1; padding:0 2px; flex-shrink:0;"
                        @click="store.removeTrainingItem(item.id)">×</button>
                </div>
            </div>
            <p v-else style="font-size:11px; color:var(--text-muted); font-style:italic;">
                Sin gastos de training registrados.
            </p>
        </div>
    </div>

</section>
</template>

<script>
import { useGlobalStore } from "@/stores/global";
import { contarDiasLaborables, MESES } from "@/services/diasLaborables";
import { obtenerFeriadosDelMes } from "@/services/feriados";
import { convertirARSaUSD } from "@/services/training";

export default {
    name: "Calculadora",
    data() {
        return {
            store: useGlobalStore(),
            MESES,
            mes:  new Date().getMonth() + 1,
            anio: new Date().getFullYear(),
            nuevaVacacion: "",
            nuevoDiaSick:  "",
            trainingDesc:  "",
            trainingARS:   null,
        };
    },
    computed: {
        primerDiaMes() {
            return `${this.anio}-${String(this.mes).padStart(2,"0")}-01`;
        },
        ultimoDiaMes() {
            const d = new Date(this.anio, this.mes, 0).getDate();
            return `${this.anio}-${String(this.mes).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
        },
    },
    methods: {
        async onPeriodoChange() {
            this.store.setMes(this.mes);
            this.store.setAnio(this.anio);
            this.store.resetDias();
            this.store.setCantDiasLaborables(contarDiasLaborables(this.mes, this.anio));
            await this.cargarFeriados();
        },
        async cargarFeriados() {
            this.store.setLoadingFeriados(true);
            this.store.setErrorFeriados(null);
            try {
                this.store.setFeriadosDelMes(await obtenerFeriadosDelMes(this.anio, this.mes));
            } catch (e) {
                this.store.setErrorFeriados(e.message);
                this.store.setFeriadosDelMes([]);
            } finally {
                this.store.setLoadingFeriados(false);
            }
        },
        onFeeChange(e) { this.store.setFee(e.target.value); },
        agregarVacacion() {
            if (this.nuevaVacacion) { this.store.addDiaVacaciones(this.nuevaVacacion); this.nuevaVacacion = ""; }
        },
        agregarSick() {
            if (this.nuevoDiaSick) { this.store.addDiaSick(this.nuevoDiaSick); this.nuevoDiaSick = ""; }
        },
        async agregarTraining() {
            if (!this.trainingDesc || !this.trainingARS) return;
            this.store.setLoadingTraining(true);
            this.store.setErrorTraining(null);
            try {
                const r = await convertirARSaUSD(this.trainingARS);
                this.store.addTrainingItem({
                    descripcion: this.trainingDesc,
                    montoARS: this.trainingARS,
                    usd: r.usd, venta: r.venta,
                    timestamp: r.timestamp, fechaBCRA: r.fechaBCRA,
                });
                this.trainingDesc = ""; this.trainingARS = null;
            } catch (e) {
                this.store.setErrorTraining("No se pudo obtener la cotización BCRA. Verificá tu conexión.");
            } finally {
                this.store.setLoadingTraining(false);
            }
        },
        pad(n)  { return String(n).padStart(2, "0"); },
        ff(s)   { const [,m,d] = s.split("-"); return `${d}/${m}`; },
        fm(val) {
            return new Intl.NumberFormat("es-AR", {
                style: "currency", currency: "USD", minimumFractionDigits: 2,
            }).format(val || 0);
        },
    },
    mounted() { this.onPeriodoChange(); },
};
</script>