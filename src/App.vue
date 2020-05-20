<template>
  <div id="app">
    <div v-if="doRegister"><register @login="backToLogin"></register></div>
    <div v-else>
      <div v-if="isLogged"><Dashboard v-bind:token="token" @signout="signOut"></Dashboard></div>
      <div v-else><Login @logging="loginStatus" @register="registerStatus" @token="retriveToken"></Login></div>
    </div>
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
import Login from './components/Login.vue'
import Dashboard from './components/Dashboard.vue'
import Vue from 'vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import Register from './components/Register.vue'

// Install BootstrapVue
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

export default {
  name: 'App',
  components: {
    Login,
    Dashboard,
    Register
  },
  data: function() {
    return {
      isLogged: false,
      doRegister: false,
      token: ''
    }
  },
  methods: {
      loginStatus(value) {
        this.isLogged = value;
      },
      registerStatus(value) {
        this.doRegister = value;
      },
      backToLogin(value) {
        this.doRegister = !value;
      },
      retriveToken(value) {
        this.token = value
      },
      signOut(value) {
        if(value) {
          this.token = '';
          this.isLogged = false;
        }
      },
      checkToken() {
        let token = localStorage.getItem('token');
        if(token) {
          this.token = token;
          this.isLogged = true;
        }
      }
  },
  beforeMount(){
    this.checkToken();
 },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
