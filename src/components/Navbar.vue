<template>
    <div>
  <b-navbar toggleable="lg" type="dark" variant="info">
    <b-navbar-brand>
        <b-button variant="primary" size="md" class="mb-1" v-on:click="setSettings" > <b-icon icon="gear-fill"> </b-icon> Settings </b-button>
    </b-navbar-brand>

    <b-navbar-brand>
        <b-button variant="primary" size="md" class="mb-1" v-on:click="setSettings" > <b-icon icon="house"> </b-icon> Home </b-button>
    </b-navbar-brand>

    <b-navbar-brand>
        <b-button variant="primary" size="md" class="mb-1" v-on:click="setSettings" > <b-icon icon="bar-chart-fill"> </b-icon> All time stats </b-button>
    </b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>


      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">

        <b-collapse id="nav-collapse" is-nav>
            <b-navbar-nav>
                 <b-nav-item disabled>
                    <span class="quick-stat">This month: <span :class="{ greentextclass: thisMonthProfit > 0, redtextclass: thisMonthProfit < 0 }">
                        <vue-numeric currency="$" decimal-separator="." thousand-separator=" " read-only precision="2" v-bind:minus="true" v-model="thisMonthProfit"></vue-numeric>
                    </span>
                    </span>
                    </b-nav-item>
                <b-nav-item disabled><span class="quick-stat"> <b-icon icon="slash"></b-icon></span> </b-nav-item>
                <b-nav-item disabled>
                    <span class="quick-stat">This week: <span :class="{ greentextclass: thisWeekProfit > 0, redtextclass: thisWeekProfit < 0 }">
                        <vue-numeric currency="$" decimal-separator="." thousand-separator=" " read-only precision="2" v-bind:minus="true" v-model="thisWeekProfit"></vue-numeric>
                    </span>
                    </span>
                    </b-nav-item>
                <b-nav-item disabled><span class="quick-stat"> <b-icon icon="slash"></b-icon></span> </b-nav-item>
                <b-nav-item disabled>
                    <span class="quick-stat">Yesterday: <span :class="{ greentextclass: yesterdayProfit > 0, redtextclass: yesterdayProfit < 0 }">
                        <vue-numeric currency="$" decimal-separator="." thousand-separator=" " read-only precision="2" v-bind:minus="true" v-model="yesterdayProfit"></vue-numeric>
                    </span>
                    </span>
                    </b-nav-item>
                <b-nav-item disabled><span class="quick-stat"> <b-icon icon="slash"></b-icon></span> </b-nav-item>
                <b-nav-item disabled>
                    <span class="quick-stat">Today: <span :class="{ greentextclass: todayProfit > 0, redtextclass: todayProfit < 0 }">
                        <vue-numeric currency="$" decimal-separator="." thousand-separator=" " read-only precision="2" v-bind:minus="true" v-model="todayProfit"></vue-numeric>
                    </span>
                    </span>
                    </b-nav-item>
                <b-nav-item disabled><span class="quick-stat"> <b-icon icon="slash"></b-icon></span> </b-nav-item>
                <b-nav-item disabled style="margin-right: 10px">
                    <span class="quick-stat">Account: <span :class="{ greentextclass: accountValue > 0, redtextclass: accountValue < 0 }">
                        <vue-numeric currency="$" decimal-separator="." thousand-separator=" " read-only precision="2" v-bind:minus="true" v-model="accountValue"></vue-numeric>
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
            thisMonthProfit: 567.52
        }
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
        }
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