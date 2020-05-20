<template>
    <b-container>
        <b-row>
            <b-col>
                <SymbolSymbol/>
            </b-col>
            <b-col>
                <UnselectSymbols/>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
    import SymbolSymbol from './SelectSymbols.vue'
    import UnselectSymbols from "./UnselectSymbols";


    export default {
        name: 'SymbolsManagment',
        components: {
            SymbolSymbol,
            UnselectSymbols
        },
        // beforeMount() {
            created() {
                this.$store.dispatch('loadSymbols');
            }
        // }
    }
</script>

<style>
</style>
