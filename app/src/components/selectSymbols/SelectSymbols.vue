<template>
    <div id="selectSymbols">
        <div class="container">
            <h1>Select symbols</h1>
            <b-form-input v-model="searchText" placeholder="search"></b-form-input>
            <SymbolsTableHeader/>
            <SymbolsList :symbols=filteredSymbols></SymbolsList>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    import SymbolsTableHeader from "@/components/selectSymbols/SymbolsTableHeader";
    import SymbolsList from "@/components/selectSymbols/SymbolsList";

    export default {
        components: {
            SymbolsList, SymbolsTableHeader
        },
        name: "SelectSymbols",
        computed: {
            ...mapGetters(['unselectedSymbols']),
            filteredSymbols: function () {
                return this.unselectedSymbols.filter(symbol => {
                    return symbol.name.match(this.searchText);
                });
            }
        },
        data() {
            return {
                searchText: '',
            }
        }
    }
</script>

<style scoped>
</style>