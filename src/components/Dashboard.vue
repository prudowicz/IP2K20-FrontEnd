<template>
   <div class="dashboard">
       <Navbar @settings="settingsStatus" @account="accountStatus" @signout="signOut"></Navbar>
        <div class="content">
            <div v-if="doSettings"><Settings></Settings></div>
            <div v-if="doAccount"><my-account></my-account></div>
        </div>
   </div>
</template>


<script>
import Navbar from './Navbar.vue'
import MyAccount from './MyAccount.vue'
import Settings from './Settings'

export default {
    name: 'Dashboard',
    components: {
        Navbar,
        Settings,
        MyAccount
    },
    props: {
      msg: String,
      token: String
  },
  data: function() {
      return {
          doSettings: false,
          doAccount: false
      }
  },
  methods: {
      settingsStatus(value) {
          this.doSettings = value;
          this.doAccount = false;
      },
      accountStatus(value) {
          this.doAccount = value;
          this.doSettings = false;
      },
      signOut(value) {
          this.$emit('signout', value);
          localStorage.delete('token');
          window.location.href = ".";
      }
  }
}
</script>


<style scoped>
.content {
    margin-top: 5%;
}

</style>