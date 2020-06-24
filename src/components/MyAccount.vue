<template>
    <div class="myaccount">
        <span class="alerts">
    <b-alert v-if="xtbPasswordSucess == true" variant="success" show>XTB details has been sucessful changed. Please refresh to apply changes.
        <span class="success-button">
                        <button type="button" class="btn btn-success" v-on:click="refresh">Refresh</button>
                    </span> 
    </b-alert>
    <b-alert v-if="errorMessage != ''" variant="danger" show>Something went wrong. There is error message like: {{errorMessage}}</b-alert>
    <b-alert v-if="accPasswordSucess == true" variant="success" show>Account password has been changed. Click here to refresh. 
        <span class="success-button">
                        <button type="button" class="btn btn-success" v-on:click="refresh">Refresh</button>
                    </span> 
                    </b-alert>
      </span>
        <div class="container">
            <div class="row">
                <div class="col-3">
                    <PasswordChange @errorMessage="setError" @passwordSuccess="accPasswordValue"></PasswordChange>
                </div>
                <div class="col-1"></div>
                <div class="col-3">
                    <XTBChange @errorMessage="setError" @passwordSuccess="xtbPasswordValue"></XTBChange>
                </div>
                <div class="col-1"></div>
                <div class="col-3">
                    <Info></Info>
                </div>
            </div>
        </div>
    </div>
</template>


<script>

import PasswordChange from './myaccount/PasswordChange.vue'
import XTBChange from './myaccount/XTBChange.vue'
import Info from './myaccount/Info.vue'


export default {
    name: 'MyAccount',
    components: {
        PasswordChange,
        XTBChange,
        Info
    },
    data: function() {
      return {
          errorMessage: '',
          xtbPasswordSucess: false,
          accPasswordSucess: false,
      }
  },
  methods: {
      setError(value) {
          this.errorMessage = value;
          this.xtbPasswordSucess = false;
          this.accPasswordSucess = false;
      },
      accPasswordValue(value) {
          this.errorMessage = '';
          this.xtbPasswordSucess = false;
          this.accPasswordSucess = value;
      },
      refresh() {
           window.location.href = ".";
      },
      xtbPasswordValue(value) {
          this.errorMessage = '';
          this.xtbPasswordSucess = value;
          this.accPasswordSucess = false;
      }
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
.success-button {
    margin-left: 2%;
}
</style>