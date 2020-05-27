<template>
    <div>
    <div class="alerts">
        <div v-if="failed">
                <div class="alert alert-danger" role="alert">
                    Something went wrong. There is error message like: {{ error }}
                </div>
            </div>
    </div>
    <div class="login">
        <div class="container-fluid">
            
        <form>
            <div class="form-group">
                <label for="exampleInputEmail1">Email address</label>
                <input v-model="email" type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp">
                <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
            </div>
            <div class="form-group">
                <label for="exampleInputPassword1">Password</label>
                <input v-model="password" type="password" class="form-control" id="exampleInputPassword1">
            </div>
            <br>
            <button type="button" class="btn btn-primary" v-on:click="checkLogin">Submit</button>
        </form>
        <div class=register>
            <button type="button" class="btn btn-primary" v-on:click="doRegister">Register</button>
        </div>
        </div>
    </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Login',
  props: {
    msg: String,
  },
   data: function () {
    return {
      email: '',
      password: '',
      loginEndpoint: process.env.VUE_APP_API_ENDPOINT + '/logIn',
      isLogged: false,
      register: false,
      failed: false,
      error: ''
    }
  },
  methods: {
     checkLogin: async function() {
          const headers = {
                'Content-Type': 'application/json',
                'Device-info': 'None'
            }
          await axios.post(this.loginEndpoint, {
            email: this.email,
            password: this.password,
            },
            { 
                headers: headers 
            })
            .then((response) => {
                this.$emit('token',  response.data["jwtToken"]);
                this.$emit('logging', true);
                localStorage.setItem('token', response.data["jwtToken"])
                if(!sessionStorage.getItem('categories')) {
  let headers = {
                'Content-Type': 'application/json',
                'Device-info': 'None',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            };
          axios.get(process.env.VUE_APP_API_ENDPOINT + '/getDistinctCategory',
                { 
                    headers: headers 
                }).then(function(response) {
                  console.log(response)
                  console.log(JSON.stringify(response.data))
                sessionStorage.setItem('categories',JSON.stringify(response.data));
          });
          axios.get(process.env.VUE_APP_API_ENDPOINT + '/getDistinctCurrency',
                { 
                    headers: headers 
                }).then(function(response) {
                  console.log(response)
                  console.log(JSON.stringify(response.data))
                sessionStorage.setItem('currencies',JSON.stringify(response.data));
                window.location.href = ".";
          });
  }
                console.log(response);
            }, (error) => {
                this.failed = true
             //   this.sucess = false
                this.error = error
                console.log(error);
            });
      },
      doRegister: function() {
          self.register = true;
          this.$emit('register', self.register);
      }
  }
}
</script>

<style scoped>
.login {
    width: 30%;
    margin: 0;
    position: absolute;
    top: 40%;
    left: 50%;
    margin-right: -50%;
    transform: translate(-50%, -50%)
}
.register {
    margin-top:10%;
}
.alerts {
    position: absolute;
    top: 5%;
    width: 60%;
    left: 50%;
    margin-right: -50%;
    transform: translate(-50%, -50%)
}
</style>