import { defineStore } from "pinia";

export const useGlobalStore = defineStore("global", {
  state: () => ({
    mesFacturar: new Date().getMonth() + 1,
    anioFacturar: new Date().getFullYear(),
    feeMensual: null,
    cantDiasLaborables: 0,
    feriadosDelMes: [],
    feriadosTrabajados: [],
    loadingFeriados: false,
    errorFeriados: null,
    diasSick: [],
    diasVacaciones: [],
    trainingItems: [],
    loadingTraining: false,
    errorTraining: null,
  }),

  getters: {
    cantFeriadosTrabajados: (s) => s.feriadosTrabajados.length,
    cantDiasSick: (s) => s.diasSick.length,
    cantVacacionesRest: (s) => s.diasVacaciones.length,

    valorPorHora: (s) => {
      if (!s.feeMensual || !s.cantDiasLaborables) return 0;
      return s.feeMensual / s.cantDiasLaborables;
    },

    precioVacacionesRest(s) {
      return this.valorPorHora * s.diasVacaciones.length;
    },
    precioDiasSick(s) {
      return this.valorPorHora * s.diasSick.length;
    },
    precioFeriadosTrabajados(s) {
      return this.valorPorHora * s.feriadosTrabajados.length;
    },

    totDiasFee(s) {
      return s.cantDiasLaborables - s.diasVacaciones.length - s.diasSick.length;
    },
    totPrecioFee() {
      return this.totDiasFee * this.valorPorHora;
    },

    grandTotalDias() {
      return this.totDiasFee + this.cantFeriadosTrabajados;
    },
    grandTotalPrecio() {
      return (
        this.totPrecioFee +
        this.precioVacacionesRest +
        this.precioDiasSick +
        this.precioFeriadosTrabajados +
        this.totalTrainingUSD
      );
    },

    totalTrainingUSD: (s) =>
      s.trainingItems.reduce((acc, i) => acc + (i.usd ?? 0), 0),

    notaTraining: (s) => {
      if (!s.trainingItems.length) return "";
      const lineas = s.trainingItems.map(
        (i) =>
          `• ${i.descripcion}: ARS ${Number(i.montoARS).toLocaleString("es-AR")} ` +
          `= USD ${Number(i.usd).toFixed(2)} ` +
          `(cotización venta BCRA: $${i.venta} — ${i.timestamp})`,
      );
      return lineas.join("\n");
    },

    isReady: (s) => s.feeMensual > 0 && s.cantDiasLaborables > 0,
  },

  actions: {
    setMes(val) {
      this.mesFacturar = parseInt(val);
    },
    setAnio(val) {
      this.anioFacturar = parseInt(val);
    },
    setFee(val) {
      this.feeMensual = parseFloat(val) || null;
    },
    setCantDiasLaborables(val) {
      this.cantDiasLaborables = val;
    },

    setFeriadosDelMes(arr) {
      this.feriadosDelMes = arr;
      const keys = arr.map((f) => `${f.dia}-${f.mes}`);
      this.feriadosTrabajados = this.feriadosTrabajados.filter((f) =>
        keys.includes(`${f.dia}-${f.mes}`),
      );
    },
    setLoadingFeriados(val) {
      this.loadingFeriados = val;
    },
    setErrorFeriados(val) {
      this.errorFeriados = val;
    },

    toggleFeriadoTrabajado(feriado) {
      const idx = this.feriadosTrabajados.findIndex(
        (f) => f.dia === feriado.dia && f.mes === feriado.mes,
      );
      if (idx >= 0) this.feriadosTrabajados.splice(idx, 1);
      else this.feriadosTrabajados.push(feriado);
    },
    isFeriadoTrabajado(feriado) {
      return this.feriadosTrabajados.some(
        (f) => f.dia === feriado.dia && f.mes === feriado.mes,
      );
    },

    addDiaSick(fecha) {
      if (fecha && !this.diasSick.includes(fecha)) {
        this.diasSick.push(fecha);
        this.diasSick.sort();
      }
    },
    removeDiaSick(fecha) {
      this.diasSick = this.diasSick.filter((d) => d !== fecha);
    },

    addDiaVacaciones(fecha) {
      if (fecha && !this.diasVacaciones.includes(fecha)) {
        this.diasVacaciones.push(fecha);
        this.diasVacaciones.sort();
      }
    },
    removeDiaVacaciones(fecha) {
      this.diasVacaciones = this.diasVacaciones.filter((d) => d !== fecha);
    },

    resetDias() {
      this.diasSick = [];
      this.diasVacaciones = [];
      this.feriadosTrabajados = [];
    },

    addTrainingItem(item) {
      this.trainingItems.push({ id: Date.now(), ...item });
    },
    removeTrainingItem(id) {
      this.trainingItems = this.trainingItems.filter((i) => i.id !== id);
    },
    setLoadingTraining(val) {
      this.loadingTraining = val;
    },
    setErrorTraining(val) {
      this.errorTraining = val;
    },
  },
});
