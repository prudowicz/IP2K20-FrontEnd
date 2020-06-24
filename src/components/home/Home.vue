<template>
<div>
<b-alert v-if="errorMessage != ''" variant="danger" show>Something went wrong. There is error message like: {{errorMessage.message}}</b-alert>
<b-container fluid>
  <b-row>
    <b-col cols="6">
      <span style="margin-left:-630px">
      Full history
      <a-switch default-checked  @change="onSwitchChangeHistory" />
      Last 1000 transactions
      </span>
<div class="tradesTable">
  <a-table :columns="columns" :data-source="mockData">
  </a-table>
</div>
    </b-col>
    <b-col>
      <span style="margin-left:-700px">
      Full history
      <a-switch default-checked  @change="onSwitchChange" />
      Last 30 days
      </span>
      <apexchart type="line" :options="chartOptions" :series="series"></apexchart>
      <!-- <chartist
    ratio="ct-major-second"
    type="Line"
    :data="chartData"
    :options="chartOptions" >
</chartist> -->
    </b-col>
</b-row>
</b-container>
</div>
</template>



<script>

import axios from 'axios';
import moment from 'moment';
import Vue from 'vue';

import VueApexCharts from 'vue-apexcharts'
Vue.use(VueApexCharts)

Vue.component('apexchart', VueApexCharts)


const columns = [
  {
    dataIndex: 'symbol',
    title: 'Symbol',
    key: 'symbol',
  },
  {
    title: 'openTime',
    dataIndex: 'openTime',
  },
  {
    title: 'closeTime',
    dataIndex: 'closeTime',
  },
  {
    title: 'openPrice',
    dataIndex: 'openPrice',
  },
  {
    title: 'closePrice',
    dataIndex: 'closePrice',
  },
  {
    title: 'profit',
    dataIndex: 'profit',
    sorter: (a, b) => a.profit - b.profit,
  },
];
export default {
  name: 'Home',
  data() {
    return {
      columns,
      mockData: [],
      errorMessage: "",
      series: "",
      chartOptions: "",
      do30DaysOnly: true,
      hides: [],
      doLoadAllHistory: false,
    };
  },
  mounted() {
      this.getData(this.doLoadAllHistory);
      this.getChartsData(this.do30DaysOnly);
  },
  beforeDestroy() {
    for(var hide of this.hides) {
      hide();
    }
  },
  methods: {
       getData: function(doLoadAllHistory) {
         var limit = 1000;
         if(doLoadAllHistory) {
           limit = 0;
         }
        // var getUrl = "";
         const hide = this.$message.loading('Loading table data...', 0);
         this.hides.push(hide);
          const mockData = [];
          let headers = {
                'Content-Type': 'application/json',
                'Device-info': 'None',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          axios.get(process.env.VUE_APP_API_ENDPOINT + '/getTradeHistoryLimit?limit=' + limit,
                { 
                    headers: headers 
                })
                .then((response) => {
                 hide();
                    //console.log(response);
                    for (var item of response.data.xtbHistoryRecordList) {
                        const data = {
                        symbol: item.symbol,
                        openTime: moment(item.openTime).format("DD-MM-YYYY HH:mm:ss"),
                        closeTime: moment(item.closeTime).format("DD-MM-YYYY HH:mm:ss"),
                        openPrice: item.openPrice,
                        closePrice: item.closePrice,
                        profit: item.profit,
                        };
                        mockData.push(data);
                    }
                    this.mockData = mockData;

                }, (error) => {
                    console.log(error);
                    this.errorMessage = error;
                });
      },

      unixToStringDate: function(unixTimestamp) {
        return moment(unixTimestamp).format("DD-MM-YYYY");
      },

       getChartsData: async function(do30DaysOnly) {
          const chartOptions = {
          chart: {
            id: 'profit-balance-chart'
          },
          xaxis: {
            categories: []
          }
        }
        let series = [{
          name: 'balance',
          data: []
        },
        {
          name: 'profit',
          data: []
        }]


      
        var start = 1;

        if(do30DaysOnly) {
          var current = Math.round(+new Date());
          var days30ago = current - (60 * 60 * 24 * 30 * 1000);
          start = days30ago;
        }
        console.log("start")
        console.log(start)
        const hide = this.$message.loading('Loading chart data...', 0);
        this.hides.push(hide);
           let headers = {
                'Content-Type': 'application/json',
                'Device-info': 'None',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          await axios.get(process.env.VUE_APP_API_ENDPOINT + '/profitHistoryWithStep?start=' + start + '&step=86400000',
                { 
                    headers: headers 
                })
                .then((response) => {
                  hide();
                    //console.log(response);
                    for (var i = response.data.time.length - 1; i >= 0; i--) {
                        chartOptions.xaxis.categories.push(this.unixToStringDate(response.data.time[i] + 0));
                        series[0].data.push(response.data.balance[i].toFixed(2));
                        series[1].data.push(response.data.profit[i].toFixed(2));
                    }
                  this.chartOptions = chartOptions;
                  console.log("chart options")
                  console.log(chartOptions)
                  this.series = series;
                }, (error) => {
                    console.log(error);
                    this.errorMessage = error;
                });

   // let months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
    //  let actualMonth = 0 + moment().month();
    //  if(actualMonth == 0) {
    //    actualMonth = months.length - 1;
    //  }
    // var numericPrevMonth = months[actualMonth]
    // console.log("Prev month");
    // console.log(numericPrevMonth);
  },
  onSwitchChange: function(checked) {
    if(checked) {
      this.do30DaysOnly = true;
      this.getChartsData(true);
    }
    else {
      this.do30DaysOnly = false;
      this.getChartsData(false);
    }
  },
  onSwitchChangeHistory: function(checked) {
    if(checked) {
      this.doLoadAllHistory = false;
    }
    else {
      this.doLoadAllHistory = true;
    }
    this.getData(this.doLoadAllHistory);
  },
  }

}
</script>

<style scoped>
.tradesTable {
    margin-top: 5%;
}
.alerts {
    position: absolute;
    top: 12%;
    width: 60%;
    left: 50%;
    margin-right: -50%;
    transform: translate(-50%, -50%)
}
.echarts {
  width: 100%;
  height: 100%;
}
</style>