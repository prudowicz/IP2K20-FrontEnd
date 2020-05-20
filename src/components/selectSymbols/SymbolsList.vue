<template>
    <div class="symbols">
        <b-row v-for="symbol in symbols" v-bind:key="symbol.name" >
            <SymbolHeader :symbol="symbol" @isSuccess="checkStatus"/>
        </b-row>
    </div>
</template>

<script>
    import SymbolHeader from "./SymbolHeader.vue"

    export default {
        props: {
            symbols: Array
        },
        data: function() {
            return {
                status: null,
            }
        },
        components: {SymbolHeader},
        name: "SymbolsList",
        methods: {
            checkStatus(status) {
                this.status = status
                console.log(status)
            }
        }
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