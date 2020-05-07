<template>
    <div>
      <SymbolsManagment></SymbolsManagment>
    </div>
</template>


<script>

import SymbolsManagment from './selectSymbols/SymbolsManagement.vue'

export default {
  name: 'Settings',
   components: {
       SymbolsManagment
   },
  props: {
    token: String
  }
}
</script>