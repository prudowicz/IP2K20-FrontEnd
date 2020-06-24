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
      Set maximum range
    </a-button>
    </b-col>
  </b-row>
  </b-container>
    <div>
    <a-transfer
      :data-source="mockData"
      :target-keys="targetKeys"
      :disabled="disabled"
      :show-search="showSearch"
      :filter-option="(inputValue, item) => (item.title.indexOf(inputValue.toUpperCase()) !== -1)"
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
          :leftFilter="handeLeftFilter"
        >
    
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
      Update max invests
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


Vue.use(Antd);

import difference from 'lodash/difference';

function getCategoriesList() {
    if(localStorage.getItem('categories')) {
      let list = []
      let temp = JSON.parse(localStorage.getItem('categories'))
      console.log(temp)
      for(let e of temp) {
        let obj = {"text": e, "value": e}
        list.push(obj)
      }
      console.log(list)
      return list;
    }
}


function getCurrenciesList() {
    if(localStorage.getItem('currencies')) {
      let list = []
      let temp = JSON.parse(localStorage.getItem('currencies'))
      console.log(temp)
      for(let e of temp) {
        let obj = {"text": e, "value": e}
        list.push(obj)
      }
      console.log(list)
      return list;
    }
}



const leftTableColumns = [
  {
    dataIndex: 'title',
    title: 'Name',
    
  },
  {
    dataIndex: 'description',
    title: 'Category',
    key: 'description',
    filters: getCategoriesList(),
    onFilter: (value, record) => record.description.indexOf(value) === 0,
  },
  {
    dataIndex: 'currency',
    title: 'Currency',
    key: 'currency',
    filters: getCurrenciesList(),
    onFilter: (value, record) => record.currency.indexOf(value) === 0,
   
  },
];
const rightTableColumns = [
  {
    dataIndex: 'title',
    title: 'Name',
    key: 'title',
  },
  {
    dataIndex: 'currency',
    title: 'Currency',
    key: 'currency',
    filters: getCurrenciesList(),
    onFilter: (value, record) => record.currency.indexOf(value) === 0,
  },
  {
    dataIndex: 'title',
    key: 'percent_key',
    title: 'Max invest',
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
      companyMaxInvest: {},
      copyMaxInvest: {},
      maxMaxInvest: 0,
      sliderMinRange: 0,
      successUpdated: 0,
      newMaxInvest: 0,
      firstLeft: "",
      firstRight: "",
      notSelectedKeys: [],
      categories: [],
      currencies: [],
      hides: [],
    };
  },
  mounted() {
    this.getData();
    this.getMaxInvest();
  },
  beforeDestroy() {
    for(var hide of this.hides) {
      hide();
    }
  },
  methods: {
    handleLeftCurrencyChange(value) {
      console.log(`Selected: ${value}`);
      console.log(`Selected: ${this.filteredItems}`);
      
    },
      ifLeftTable(key) {
        if(this.targetKeys.includes(key)) {
          return false
        }
        return true;
      },
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
                let index = this.notSelectedKeys.indexOf(item)
           this.notSelectedKeys.splice(index, 1);
          this.getMaxInvest();
          }
          this.firstLeft = this.notSelectedKeys[0]
           console.log(this.firstLeft)
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
              await axios.delete(process.env.VUE_APP_API_ENDPOINT + '/deleteCompany',
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
                for(let data of this.mockData) {
                  if(data.chosen == false) {
                    console.log(data);
                    this.firstLeft = data.key
                    break;
                  }
                }
                
          }
      }
      //this.firstLeft = notSelectedKeys[0]
      this.firstRight = nextTargetKeys[0]
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
    async getData() {
          const targetKeys = [];
          const mockData = [];
          const hide = this.$message.loading('Loading data...', 0);
         this.hides.push(hide);
          let headers = {
                'Content-Type': 'application/json',
                'Device-info': 'None',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
            await axios.get(process.env.VUE_APP_API_ENDPOINT + '/companies/selectInfo',
                { 
                    headers: headers 
                })
                .then((response) => {
                  hide();
                    for (var item of response.data) {
                        const data = {
                        key: item.name,
                        title: item.name,
                        description: item.categoryName,
                        currency: item.currency,
                        chosen: item.selected,
                        show: false,
                        };
                        if(!this.categories.includes(data.description)) {
                          let tempObj = {"text": data.description, "value": data.description}
                          this.categories.push(tempObj)
                        }
                        if(!this.currencies.includes(data.currency)) {
                          this.currencies.push(data.currency)
                        }
                        if (data.chosen) {
                            targetKeys.push(data.key);
                       }
                       else {
                         this.notSelectedKeys.push(data.key)
                       }
                       mockData.push(data);
                    }
                    this.mockData = mockData;
                    this.targetKeys = targetKeys;
                    this.firstLeft = this.notSelectedKeys[0]
                    //console.log("First Right == ")
                    this.firstRight = targetKeys[0]
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