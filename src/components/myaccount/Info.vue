<template>
    <div>
        <div class="card" style="width: 18rem;">
         <div class="card-body">
        <form>
          <div class="form-group">
            <label for="email">Actual email</label>
            <input type="email" class="form-control" id="email" :placeholder="email" disabled>
          </div>
          <div class="form-group">
            <label for="xtblogin">Actual XTB Login</label>
            <input type="login" class="form-control" id="xtblogin" :placeholder="xtblogin" disabled>
          </div>
        </form>
        </div>
        </div>
    </div>
</template>


<script>

import axios from 'axios'

export default {
  name: 'Info',
  props: {
    msg: String
  },
   data: function () {
    return {
      email: '',
      xtblogin: '',
      userEndpoint: process.env.VUE_APP_API_ENDPOINT + '/user',
    }
  },
  methods: {
      getData: function() {
          let headers = {
                'Content-Type': 'application/json',
                'Device-info': 'None',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          axios.get(this.userEndpoint, { 
                headers: headers 
            })
            .then((response) => {
                console.log(response.data)
                this.email = response.data.email;
                this.xtblogin = response.data.xtbLogin;
            }, (error) => {
            //     this.failed = true
            //  //   this.sucess = false
            //     this.error = error
                console.log(error);
            });
      }
  },
   beforeMount(){
    this.getData();
 }
}
</script>