<template>
    <div id="selectSymbols">
        <div class="container">
            <h1>Unselect symbols</h1>
            <b-form-input v-model="searchText" placeholder="search"></b-form-input>
            <SymbolsTableHeader/>
            <SymbolsList :symbols=filteredSymbols></SymbolsList>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    import SymbolsList from "@/components/selectSymbols/SymbolsList";
    import SymbolsTableHeader from "@/components/selectSymbols/SymbolsTableHeader";

    export default {
        components: {SymbolsList, SymbolsTableHeader},
        data() {
            return {
                searchText: '',
            }
        },
        name: "SelectSymbols",
        computed: {
            ...mapGetters(['selectedSymbols']),
            filteredSymbols: function () {
                return this.selectedSymbols.filter(symbol => {
                    return symbol.name.match(this.searchText);
                });
            }
        }
    }
</script>

<style scoped>
</style>