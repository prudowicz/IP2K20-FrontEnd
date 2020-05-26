<template>
  <div class="transfer">
      <span class="alerts">
    <b-alert v-if="successAdded > 0" variant="success" show>{{ successAdded }} companies has been sucessful added. </b-alert>
    <b-alert v-if="successDeleted > 0" variant="success" show>{{ successDeleted }} companies has been sucessful deleted. </b-alert>
    <b-alert v-if="errorMessage != ''" variant="danger" show>Something went wrong. There is error message like: {{errorMessage.message}}</b-alert>
    <b-alert v-if="successUpdated > 0" variant="success" show>{{ successUpdated }} max invests has been updated. </b-alert>
      </span>
    <b-container style="margin-bottom:5px;" fluid>
  <b-row>
    <b-col cols=2>
      <h7> Set maximum range: </h7>
    </b-col>
    <b-col cols=4>
      <a-slider v-model="newMaxInvest" :min="sliderMinRange" :max="100" step="0.2" />
    </b-col>
    <b-col cols=1>
      <a-input-number v-model="newMaxInvest" :min="sliderMinRange" :max="100" step="0.2" style="marginLeft: 16px" />
    </b-col>
    <b-col cols=1>
      <a-button type="primary"
      size="medium"
      @click="setNewMax"
    >
      Set
    </a-button>
    </b-col>
  </b-row>
  </b-container>
      <!-- <a-row style="margin-bottom: 5px">
        <a-col>
          Chuj
        </a-col>
      <a-col :span="16" style="margin-left:10%">
        <a-slider v-model="newMaxInvest" :min="maxMaxInvest" :max="20" />
      </a-col>
      <a-col :span="4">
        <a-input-number v-model="newMaxInvest" :min="maxMaxInvest" :max="20" style="marginLeft: 16px" />
      </a-col>
    </a-row> -->
    
    <div>
    <a-transfer
      :data-source="mockData"
      :target-keys="targetKeys"
      :disabled="disabled"
      :show-search="showSearch"
      :filter-option="(inputValue, item) => item.title.indexOf(inputValue) !== -1"
      :show-select-all="false"
      @change="onChange"
    >
      <template
        slot="children"
        slot-scope="{
          props: { direction, filteredItems, selectedKeys, disabled: listDisabled },
          on: { itemSelectAll, itemSelect },
        }"
      >
        <a-table
          :row-selection="
            getRowSelection({ disabled: listDisabled, selectedKeys, itemSelectAll, itemSelect })
          "
          :columns="direction === 'left' ? leftColumns : rightColumns"
          :data-source="filteredItems"
          size="small"
          :style="{ pointerEvents: listDisabled ? 'none' : null }"
        >
        <template slot="header">
      Header
        </template>
        <span slot="percents_col" slot-scope="title">
          <a-row>
      <a-col :span="16">
        <a-slider v-model="companyMaxInvest[title]" :min="0" :max="maxMaxInvest" :step="0.1" />
      </a-col>
      <a-col :span="4">
        <a-input-number
          v-model="companyMaxInvest[title]"
          :min="0"
          :max="maxMaxInvest"
          :step="0.1"
          style="marginLeft: 16px"
        />
      </a-col>
    </a-row>
        </span>
        </a-table>
      </template>
    <a-button type="primary"
      size="medium"
      slot="footer"
      style="float:left;margin-left: 30px; margin-bottom: 5px; margin-top: 10px"
      @click="updateMaxInvest"
    >
      Update
    </a-button>
    </a-transfer>
    </div>
  </div>
</template>


<script>
import 'ant-design-vue/dist/antd.css';
import Vue from 'vue';
import Antd from 'ant-design-vue';
import axios from 'axios'
// import Slider from './Slider.vue'

Vue.use(Antd);

import difference from 'lodash/difference';



const leftTableColumns = [
  {
    dataIndex: 'title',
    title: 'Name',
    
  },
  {
    dataIndex: 'description',
    title: 'Category',
  },
  {
    dataIndex: 'currency',
    title: 'Currency',
  },
];
const rightTableColumns = [
  {
    dataIndex: 'title',
    title: 'Name',
  },
  {
    dataIndex: 'currency',
    title: 'Currency',
  },
  {
    dataIndex: 'title',
    key: 'percent_key',
    title: 'Percent',
    scopedSlots: { customRender: 'percents_col' },
  },
];

export default {
  name: 'Transfer',
  components: {
  //  Slider,
  },
  data() {
    return {
      successAdded: 0,
      successDeleted: 0,
      errorMessage: '',
      mockData: [],
      targetKeys: [],
      disabled: false,
      showSearch: true,
      leftColumns: leftTableColumns,
      rightColumns: rightTableColumns,
      inputValues: [],
      companyMaxInvest: {},
      copyMaxInvest: {},
      maxMaxInvest: 0,
      sliderMinRange: 0,
      successUpdated: 0,
      newMaxInvest: 0,
    };
  },
  mounted() {
    this.getData();
    this.getMaxInvest();
  },
  methods: {
      setNewMax() {
        for (var item of Object.keys(this.companyMaxInvest)){
          if(this.companyMaxInvest[item] > this.newMaxInvest) return;
        }
        this.maxMaxInvest = this.newMaxInvest;
      },
      async onChange(nextTargetKeys) {
      var oldKeys = [...this.targetKeys];
      this.targetKeys = nextTargetKeys;
      for(let item of nextTargetKeys) {
          if(!oldKeys.includes(item)) {
              let headers = {
                'Content-Type': 'application/json',
                'Device-info': 'None',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            };
              const data = {
                  companyName: item
              }
            await axios.post(process.env.VUE_APP_API_ENDPOINT + '/saveCompany', data,
                { 
                    headers: headers 
                })
                .then((response) => {
                    console.log(response);
                    this.successDeleted = 0;
                    this.successUpdated = 0;
                    this.successAdded += 1;
                    this.errorMessage = '';
                }, (error) => {
                    console.log(error);
                    this.errorMessage = error;
                });
          }
          this.getMaxInvest();
      }
      for(let item of oldKeys) {
          if(!nextTargetKeys.includes(item)) {
              let headers = {
                'Content-Type': 'application/json',
                'Device-info': 'None',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            };
              const data = {
                  companyName: item
              }
              console.log(data)
            axios.delete(process.env.VUE_APP_API_ENDPOINT + '/deleteCompany',
                { 
                    headers: headers,
                    data: data
                })
                .then((response) => {
                    console.log(response);
                    this.successDeleted += 1;
                    this.successAdded = 0;
                    this.successUpdated = 0;
                    this.errorMessage = '';
                }, (error) => {
                    console.log(error);
                    this.errorMessage = error;
                });
          }
      }
    },
    getRowSelection({ disabled, selectedKeys, itemSelectAll, itemSelect }) {
      return {
        getCheckboxProps: item => ({ props: { disabled: disabled || item.disabled } }),
        onSelectAll(selected, selectedRows) {
          const treeSelectedKeys = selectedRows
            .filter(item => !item.disabled)
            .map(({ key }) => key);
          const diffKeys = selected
            ? difference(treeSelectedKeys, selectedKeys)
            : difference(selectedKeys, treeSelectedKeys);
          itemSelectAll(diffKeys, selected);
        },
        onSelect({ key }, selected) {
          itemSelect(key, selected);
        },
        selectedRowKeys: selectedKeys,
      };
    },
    getData() {
          const targetKeys = [];
          const mockData = [];
          let headers = {
                'Content-Type': 'application/json',
                'Device-info': 'None',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
            axios.get(process.env.VUE_APP_API_ENDPOINT + '/companies/selectInfo',
                { 
                    headers: headers 
                })
                .then((response) => {
                    for (var item of response.data) {
                        const data = {
                        key: item.name,
                        title: item.name,
                        description: item.categoryName,
                        currency: item.currency,
                        chosen: item.selected,
                        percent: 0.3,
                        };
                        
                        if (data.chosen) {
                            targetKeys.push(data.key);
                       }
                       mockData.push(data);
                    }
                    this.mockData = mockData;
                    this.targetKeys = targetKeys;
                   // this.initCompany()
                   
                }, (error) => {
                    console.log(error);
                    this.errorMessage = error;
                });
      },
      getMaxInvest() {
         const companyMaxInvest = {};
         let maxMaxInvest = 0.0
         let headers = {
                'Content-Type': 'application/json',
                'Device-info': 'None',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            };
         axios.get(process.env.VUE_APP_API_ENDPOINT + '/companiesForUser',
                { 
                    headers: headers 
                })
                .then((response) => {
                    for (var item of response.data) {
                        companyMaxInvest[item.company.name] = item.maxInvest;
                        if(item.maxInvest > maxMaxInvest) {
                          maxMaxInvest = item.maxInvest;
                        }
                    }
                   this.companyMaxInvest = companyMaxInvest;
                   this.maxMaxInvest = maxMaxInvest;
                   this.sliderMinRange = maxMaxInvest;
                   this.copyMaxInvest = JSON.parse(JSON.stringify(companyMaxInvest))
                   //console.log(companyMaxInvest);
                }, (error) => {
                    console.log(error);
                    this.errorMessage = error;
                });
      },
      updateMaxInvest() {
        for (var item of Object.keys(this.companyMaxInvest)) {
          if(this.companyMaxInvest[item] != this.copyMaxInvest[item]) {
            let headers = {
                'Content-Type': 'application/json',
                'Device-info': 'None',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            };
              const data = {
                  companyName: item,
                  maxInvest: this.companyMaxInvest[item]
              }
            axios.put(process.env.VUE_APP_API_ENDPOINT + '/changeMaxInvest', data,
                { 
                    headers: headers 
                })
                .then((response) => {
                    console.log(response);
                    this.successDeleted = 0;
                    this.successAdded = 0;
                    this.successUpdated += 1;
                    this.errorMessage = '';
                }, (error) => {
                    console.log(error);
                    this.errorMessage = error;
                });
          }
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
.transfer {
    margin-right: 1%;
    margin-left: 1%;
    margin-top: -1%;
}
</style>