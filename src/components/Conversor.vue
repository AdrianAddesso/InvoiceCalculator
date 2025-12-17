<template>
    <section>
    <!-- Ingreso de Kilómetros -->
        <div class="container mt-5">
            <h2 class="text-center mb-4">Conversor de Distancia</h2>
            <div class="row justify-content-center mb-4">
                <div class="col-md-6">
                    <div class="card shadow">
                        <div class="card-header bg-info-subtle text-dark text-center">
                            <h4 class="mb-0">Ingrese Kilómetros</h4>
                        </div>
                        <div class="card-body text-center py-4">
                            <input 
                                type="number" 
                                class="form-control form-control-lg text-center" 
                                @input="convertir"
                            >
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section v-show="!globalStore.isEmpty">
    <!-- Seccion de resultados -->
        <div class="container mt-5">
            <div class="row justify-content-center">
                <div class="col-md-6 col-lg-6 mb-3">
                    <div class="card text-center shadow h-100">
                        <div class="card-header bg-secondary-subtle text-dark">
                            <h5 class="mb-0">Metros</h5>
                        </div>
                        <div class="card-body py-4">
                            <p class="display-6 mb-0 fw-bold" :style="{ color: globalStore.getColor }">
                                {{ globalStore.getMetros.toLocaleString() }}
                            </p>
                            <small class="text-muted">metros</small>
                        </div>
                    </div>
                </div>

                <div class="col-md-6 col-lg-6 mb-3">
                    <div class="card text-center shadow h-100">
                        <div class="card-header bg-dark-subtle text-dark">
                            <h5 class="mb-0"> Millas</h5>
                        </div>
                        <div class="card-body py-4">
                            <p class="display-6 mb-0 fw-bold" :style="{ color: globalStore.getColor }">
                                {{ globalStore.getMillas.toLocaleString() }}
                            </p>
                            <small class="text-muted">millas</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import { useGlobalStore } from '@/stores/global';

export default {
    name: 'conversor',
    data() {
        return {
            globalStore: useGlobalStore()            
        }
    },
    methods: {
        convertir(event) {
            const value = event.target.value;
            
            if (value === "+" || value === "-" || value === "") {
                this.globalStore.setKilometros(null);
                return;
            }
            
            const numero = parseFloat(value) || 0;
            console.log('convertir(kilometros)', numero);
            this.globalStore.setKilometros(numero);
        }
    }
}
</script>

<style scoped>
</style>