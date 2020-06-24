<template>
    <div>
      
      <div class="card" style="width: 18rem;">
         <div class="card-body">
        <form>
          <div class="form-group">
            <label for="pasword1">Actual password</label>
            <input v-model="password1" type="password" class="form-control" id="pasword1" placeholder="Password">
          </div>
          <div class="form-group">
            <label for="password2">New password</label>
            <input  v-model="password2" type="password" class="form-control" id="password2" placeholder="Password">
          </div>
          <div class="form-group">
            <label for="password3">Repeat new password</label>
            <input  v-model="password3" type="password" class="form-control" id="password3" placeholder="Password">
          </div>
          <button type="button" class="btn btn-primary" v-on:click="changePassword">Submit</button>
        </form>
         </div>
      </div>
    </div>
</template>


<script>

import axios from 'axios';

export default {
  name: 'PasswordChange',
  props: {
    msg: String
  },
  data: function() {
      return {
          password1: '',
          password2: '',
          password3: '',
          errorMessage: '',
          passwordSucess:  false,
      }
  },
  methods: {
    changePassword: function() {
      if(this.password2 !== this.password3) {
        this.$emit("errorMessage", "Your new password doesn't match repeated password.");
      }
      else {
         let headers = {
                'Content-Type': 'application/json',
                'Device-info': 'None',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
           };
              const data = {
                  newPassword: this.password2,
                  oldPassword: this.password1
              }
            axios.put(process.env.VUE_APP_API_ENDPOINT + '/changePassword', data,
                { 
                    headers: headers 
                })
                .then((response) => {
                    console.log(response);
                    this.passwordSucess = true;
                    this.errorMessage = '';
                    this.$emit("passwordSuccess", true);
                    localStorage.setItem('token', response.data.jwtToken);

                }, (error) => {
                    console.log(error);
                     this.$emit("errorMessage", error.message);
                    this.errorMessage = error;
                });
      }
    },
  }
}
</script>

<style scoped>
.alerts {
    position: absolute;
    top: 12%;
    width: 60%;
    left: 50%;
    margin-right: -50%;
    transform: translate(-50%, -50%)
}

</style>