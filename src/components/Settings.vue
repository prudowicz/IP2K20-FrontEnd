<template>
    <div>
       <!-- <SymbolsManagment></SymbolsManagment> -->
      <transfer></transfer>
      <!-- <slider></slider> -->
    </div>
</template>


<script>

// import SymbolsManagment from './selectSymbols/SymbolsManagement.vue'
 import Transfer from './settings/Transfer.vue'

export default {
  name: 'Settings',
   components: {
      //  SymbolsManagment
      Transfer,
   },
  props: {
    token: String
  },
}
</script>