<template>
    <div class="app-root">
        <div class="dot-grid" aria-hidden="true"></div>

        <header class="app-header">
            <div class="header-inner">
                <div class="header-logo">
                    <span class="logo-icon">◈</span>
                    <span class="logo-text">Invoice<span class="logo-accent">Calc</span></span>
                </div>
                <div class="header-meta">
                    <span class="header-tag">Billing Calculator</span>
                </div>
            </div>
        </header>

        <main class="app-main">
            <Calculadora />
            <Resultados />
        </main>

        <footer class="app-footer">
            Feriados via <a href="https://nolaborables.com.ar" target="_blank">nolaborables.com.ar</a>
            · Cotización <a href="https://dolarapi.com" target="_blank">dolarapi.com</a> (BCRA Oficial)
        </footer>
    </div>
</template>

<script>
import Calculadora from "./components/Calculadora.vue";
import Resultados  from "./components/Resultados.vue";
export default {
    name: "App",
    components: { Calculadora, Resultados },
};
</script>