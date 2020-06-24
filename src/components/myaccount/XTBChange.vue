<template>
    <div class="passwordchange">
    
        <div class="card" style="width: 18rem;">
         <div class="card-body">
        <form>
          <div class="form-group">
            <label for="accountpassword">New XTB Login</label>
            <input v-model="login" type="login" class="form-control" id="accountpassword" placeholder="Enter login">
        </div>
          <div class="form-group">
            <label for="password">New XTB Password</label>
            <input v-model="xtbpassword" type="password" class="form-control" id="password" placeholder="Password">
          </div>
          <div class="form-group">
            <label for="repeatpassword">Repeat new XTB Password</label>
            <input v-model="repeatpassword" type="password" class="form-control" id="repeatpassword" placeholder="Password">
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
  name: 'XTBChange',
  props: {
    msg: String
  },
  data: function() {
      return {
          login: '',
          xtbpassword: '',
          repeatpassword: '',
          errorMessage: '',
          passwordSucess:  false,
      }
  },
  methods : {
    changePassword() {
      if(this.xtbpassword !== this.repeatpassword) {
        this.$emit("errorMessage", "Your new XTB password doesn't match repeated password.")
      }
      else {
        let headers = {
                'Content-Type': 'application/json',
                'Device-info': 'None',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
           };
              const data = {
                  newLogin: this.login,
                  newPassword: this.xtbpassword
              }
            axios.put(process.env.VUE_APP_API_ENDPOINT + '/changeXtbDetails', data,
                { 
                    headers: headers 
                })
                .then((response) => {
                    console.log(response);
                    this.passwordSucess = true;
                    this.errorMessage = '';
                    this.$emit("passwordSuccess", true);
                }, (error) => {
                    this.$emit("errorMessage", error.message);
                    this.errorMessage = error;
                });
      }
    }
  },
}
</script>

<style scoped>

</style>