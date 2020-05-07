<template>
    <div class="symbols">
        <b-row v-for="symbol in symbols" v-bind:key="symbol.name">
            <SymbolHeader :symbol="symbol"/>
        </b-row>
    </div>
</template>

<script>
    import SymbolHeader from "./SymbolHeader.vue"

    export default {
        props: {
            symbols: Array
        },
        components: {SymbolHeader},
        name: "SymbolsList"
    }
</script>

<style scoped>
    .symbols {
        width: 500px;
        height: 600px;
        overflow-y: auto;
        overflow-x: hidden;
    }
</style>