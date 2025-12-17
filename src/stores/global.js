import { defineStore } from "pinia";
const multiplicadorMetros = 1000;
const multiplicadorMillas = 0.621371;

export const useGlobalStore = defineStore("global", {
    state: () => ({ conversor: null }),

    getters: {
        getMetros: (state) => (state.conversor * multiplicadorMetros).toFixed(2),
        getMillas: (state) => (state.conversor * multiplicadorMillas).toFixed(4),
        getColor: (state) => {
            if (state.conversor <= 0) return "blue"; // Azul
            if (state.conversor < 5) return "magenta"; // Magenta (usando danger como magenta)
            return "red"; // Rojo
            },
        isEmpty: (state) =>
            state.conversor === undefined || state.conversor === null,
    },

    actions: {
        setKilometros(valor) {
           this.conversor = valor;
        },
    },
});
