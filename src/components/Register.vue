<template>
    <div>
        <div class="alerts">
            <div v-if="failed">
                <div class="alert alert-danger" role="alert">
                    Something went wrong. There is error message like: {{ error }}
                </div>
            </div>
            <div v-if="sucess">
                <div class="alert alert-success" role="alert">
                    201: Created! 
                    <span class="success-button">
                        <button type="button" class="btn btn-success" v-on:click="backToLogin">Back to login</button>
                    </span>
                </div>
            </div>
        </div>
        <div class="register">
        <div class="container-fluid">
        <form>
            <div class="form-group">
                <label for="exampleInputEmail1">Email address</label>
                <input v-model="email" type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp">
            </div>
            <div class="form-group">
                <label for="exampleInputPassword1">Password</label>
                <input v-model="regularPassword" type="password" class="form-control" id="exampleInputPassword1">
            </div>
            <div class="form-group">
                <label for="exampleInputPassword1">xtb login</label>
                <input v-model="xtbLogin" type="login" class="form-control" id="exampleInputPassword1">
            </div>
            <div class="form-group">
                <label for="exampleInputPassword1">xtb password</label>
                <input v-model="xtbPassword" type="password" class="form-control" id="exampleInputPassword1">
            </div>
            <br>
            <button type="button" class="btn btn-primary" v-on:click="doRegister">Submit</button>
            <div class="back-button">
                <button type="button" class="btn btn-primary" v-on:click="backToLogin">Back to login</button>
            </div>
        </form>
        </div>
    </div>
    </div>
</template>

<script>
import axios from 'axios';


export default {
  name: 'Register',
  props: {
    msg: String
  },
  data() {
      return {
        email: '',
        regularPassword: '',
        xtbLogin: '',
        xtbPassword: '',
        registerEndpoint: process.env.VUE_APP_API_ENDPOINT + '/signUp',
        sucess: false,
        failed: false,
        error: ''
      }
    },
    methods: {
      doRegister: function() {
          axios.post(this.registerEndpoint, {
            email: this.email,
            password: this.regularPassword,
            xtbLogin: this.xtbLogin,
            xtbPassword: this.xtbPassword
            })
            .then((response) => {
                this.sucess = true
                this.failed = false
                console.log(response);
            }, (error) => {
                this.failed = true
                this.sucess = false
                this.error = error
                console.log(error);
            });
      },
      backToLogin: function() {
          this.$emit('login', true);
      }
  }
}
</script>

<style scoped>
.alerts {
    width: 70%;
    margin: 0;
    position: absolute;
    top: 5%;
    left: 50%;
    margin-right: -50%;
    transform: translate(-50%, -50%)
}
.register {
    width: 30%;
    margin: 0;
    position: absolute;
    top: 40%;
    left: 50%;
    margin-right: -50%;
    transform: translate(-50%, -50%)
}
.success-button {
    margin-left: 2%;
}
.back-button {
    margin-top: 10%;
}
</style>