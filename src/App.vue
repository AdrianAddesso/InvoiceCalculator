<template>
    <div class= "container-fluid">
        <div>
            <header>
                <h2 class="text-center">PNT2 - Final Dic 17 - Addesso Adrian</h2> 
            </header>
            <main>
                    <hr>
                    <Conversor />
                    <hr>
                    <Respuestas />
            </main>
        </div>
    </div>
</template>

<script>
    import Conversor from './components/Conversor.vue';
    import Respuestas from './components/Respuestas.vue';

    export default {
            name: 'app',
            components: {
                Conversor,
                Respuestas
            }
        }
</script>


<style scoped>

</style>
