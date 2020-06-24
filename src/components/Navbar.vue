<template>
    <div>
  <b-navbar toggleable="lg" type="dark" variant="info">
    <b-navbar-brand>
        <b-button variant="primary" size="md" class="mb-1" v-on:click="setSettings" > <b-icon icon="gear-fill"> </b-icon> Settings </b-button>
    </b-navbar-brand>

    <b-navbar-brand>
        <b-button variant="primary" size="md" class="mb-1" v-on:click="setHome" > <b-icon icon="house"> </b-icon> Home </b-button>
    </b-navbar-brand>


    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>


      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">

        <b-collapse id="nav-collapse" is-nav>
            <b-navbar-nav>
                 <b-nav-item disabled>
                    <span class="quick-stat">This and prev month: <span :class="{ greentextclass: thisMonthProfit > 0, redtextclass: thisMonthProfit < 0 }">
                        <vue-numeric currency="PLN" decimal-separator="." thousand-separator=" " read-only precision="2" v-bind:minus="true" v-model="thisMonthProfit"></vue-numeric>
                    </span>
                    </span>
                    </b-nav-item>
                <b-nav-item disabled><span class="quick-stat"> <b-icon icon="slash"></b-icon></span> </b-nav-item>
                <b-nav-item disabled>
                    <span class="quick-stat">This week: <span :class="{ greentextclass: thisWeekProfit > 0, redtextclass: thisWeekProfit < 0 }">
                        <vue-numeric currency="PLN" decimal-separator="." thousand-separator=" " read-only precision="2" v-bind:minus="true" v-model="thisWeekProfit"></vue-numeric>
                    </span>
                    </span>
                    </b-nav-item>
                <b-nav-item disabled><span class="quick-stat"> <b-icon icon="slash"></b-icon></span> </b-nav-item>
                <b-nav-item disabled>
                    <span class="quick-stat">Yesterday: <span :class="{ greentextclass: yesterdayProfit > 0, redtextclass: yesterdayProfit < 0 }">
                        <vue-numeric currency="PLN" decimal-separator="." thousand-separator=" " read-only precision="2" v-bind:minus="true" v-model="yesterdayProfit"></vue-numeric>
                    </span>
                    </span>
                    </b-nav-item>
                <b-nav-item disabled><span class="quick-stat"> <b-icon icon="slash"></b-icon></span> </b-nav-item>
                <b-nav-item disabled>
                    <span class="quick-stat">Today: <span :class="{ greentextclass: todayProfit > 0, redtextclass: todayProfit < 0 }">
                        <vue-numeric currency="PLN" decimal-separator="." thousand-separator=" " read-only precision="2" v-bind:minus="true" v-model="todayProfit"></vue-numeric>
                    </span>
                    </span>
                    </b-nav-item>
                <b-nav-item disabled><span class="quick-stat"> <b-icon icon="slash"></b-icon></span> </b-nav-item>
                <b-nav-item disabled style="margin-right: 10px">
                    <span class="quick-stat">Account: <span :class="{ greentextclass: accountValue > 0, redtextclass: accountValue < 0 }">
                        <vue-numeric currency="PLN" decimal-separator="." thousand-separator=" " read-only precision="2" v-bind:minus="true" v-model="accountValue"></vue-numeric>
                    </span>
                    </span>
                    </b-nav-item>
            </b-navbar-nav>
        </b-collapse>

        <b-navbar-brand>
            <b-button variant="primary" size="md" class="mb-1" v-on:click="setMyAccount" > <b-icon icon="people-circle"> </b-icon> My account </b-button>
        </b-navbar-brand>

        <b-navbar-brand>
            <b-button variant="primary" size="md" class="mb-1" v-on:click="signOut" > <b-icon icon="box-arrow-right"> </b-icon> Sign out </b-button>
        </b-navbar-brand>

      </b-navbar-nav>
  </b-navbar>
</div>
</template>


<script>
import VueNumeric from 'vue-numeric'
import axios from 'axios';
import moment from 'moment';

export default {
    name: 'Navbar',
    components: {
        VueNumeric
    },
    props: {
      msg: String
    },
    data: function() {
        return {
            doSettings: false,
            doAccount: false,
            todayProfit: -2.00,
            accountValue: 1500.25,
            yesterdayProfit: 0.00,
            thisWeekProfit: 305.6,
            thisMonthProfit: 567.52,
            currency: "",
        }
    },
    mounted() {
        this.getData();
    },
    methods: {
        setSettings: function() {
            this.doSettings = true;
            this.$emit('settings', this.doSettings);
        },
        determineColor: function(value) {
            if(value > 0) return "green"
            if(value < 0) return "red"
            else return "white"
        },
        setMyAccount: function() {
            this.doAccount = true;
            this.$emit('account', this.doAccount);
        },
        signOut: function() {
            localStorage.clear();
            this.$emit('signout', true);
        },
        setHome: function() {
            this.doHome = true;
            this.$emit('home', this.doHome);
        },
        getData: async function() {
            let headers = {
                'Content-Type': 'application/json',
                'Device-info': 'None',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          await axios.get(process.env.VUE_APP_API_ENDPOINT + '/getBalance',
                { 
                    headers: headers 
                })
                .then((response) => {
                    console.log(response);
                    this.currency = response.data.currency;
                    this.accountValue = response.data.balance;

                }, (error) => {
                    console.log(error);
                    this.errorMessage = error;
                });
                //today
            var mmt = moment();
            var mmtMidnight = mmt.startOf('day');
            console.log(process.env.VUE_APP_API_ENDPOINT + '/profitHistory?start=' + mmtMidnight);
            axios.get(process.env.VUE_APP_API_ENDPOINT + '/profitHistory?start=' + mmtMidnight,
                { 
                    headers: headers 
                })
                .then((response) => {
                    let newProfit = 0.0;
                    console.log(response);
                    for(var profit of response.data.profit) {
                        newProfit += profit
                    }
                this.todayProfit = newProfit;
                }, (error) => {
                    console.log(error);
                    this.errorMessage = error;
                });
                //yesterday
                var yesterdayMidnight = mmtMidnight - 60*60*24;
                axios.get(process.env.VUE_APP_API_ENDPOINT + '/profitHistory?start=' + yesterdayMidnight,
                { 
                    headers: headers 
                })
                .then((response) => {
                    let newProfit = 0.0;
                    console.log(response);
                    for(var profit of response.data.profit) {
                        newProfit += profit
                    }
                this.yesterdayProfit = newProfit;
                }, (error) => {
                    console.log(error);
                    this.errorMessage = error;
                });
                //this week
                var thisWeekStartMidnight = mmt.startOf('week');
                axios.get(process.env.VUE_APP_API_ENDPOINT + '/profitHistory?start=' + thisWeekStartMidnight,
                { 
                    headers: headers 
                })
                .then((response) => {
                    let newProfit = 0.0;
                    console.log(response);
                    for(var profit of response.data.profit) {
                        newProfit += profit
                    }
                this.thisWeekProfit = newProfit;
                }, (error) => {
                    console.log(error);
                    this.errorMessage = error;
                });
                //month
                var thisMonthStartMidnight = mmt.startOf('month');
                console.log(thisMonthStartMidnight.unix())
                axios.get(process.env.VUE_APP_API_ENDPOINT + '/profitHistory?start=' + thisMonthStartMidnight,
                { 
                    headers: headers 
                })
                .then((response) => {
                    let newProfit = 0.0;
                    console.log(response);
                    for(var profit of response.data.profit) {
                        newProfit += profit
                    }
                this.thisMonthProfit = newProfit;
                }, (error) => {
                    console.log(error);
                    this.errorMessage = error;
                });
        },
    }
}
</script>

<style scoped>
.greentextclass {
    color: #3FFF00;
}

.redtextclass {
    color: #CE2029;
}
.quick-stat {
    color:white;
}

</style>