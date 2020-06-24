<template>
   <div class="dashboard">
       <Navbar @settings="settingsStatus" @account="accountStatus" @signout="signOut" @home="setHome"></Navbar>
        <div class="content">
            <div v-if="doSettings"><Settings></Settings></div>
            <div v-if="doAccount"><my-account></my-account></div>
            <div v-if="doHome"><home></home></div>
        </div>
   </div>
</template>


<script>
import Navbar from './Navbar.vue'
import MyAccount from './MyAccount.vue'
import Settings from './Settings'
import Home from './home/Home.vue'

export default {
    name: 'Dashboard',
    components: {
        Navbar,
        Settings,
        MyAccount,
        Home
    },
    props: {
      msg: String,
      token: String
  },
  data: function() {
      return {
          doSettings: false,
          doAccount: false,
          doHome: true,
      }
  },
  methods: {
      settingsStatus(value) {
          this.doSettings = value;
          this.doAccount = false;
          this.doHome = false;
      },
      accountStatus(value) {
          this.doAccount = value;
          this.doSettings = false;
          this.doHome = false;
      },
      signOut(value) {
          this.$emit('signout', value);
          localStorage.delete('token');
          window.location.href = ".";
      },
      setHome(value) {
        this.doHome = value;
        this.doSettings = false;
        this.doAccount = false;
      }
  }
}
</script>


<style scoped>
.content {
    margin-top: 5%;
}

</style>