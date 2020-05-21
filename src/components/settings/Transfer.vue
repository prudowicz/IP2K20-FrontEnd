<template>
  <div class="transfer">
      <span class="alerts">
    <b-alert v-if="successAdded > 0" variant="success" show>{{ successAdded }} companies has been sucessful added. </b-alert>
    <b-alert v-if="successDeleted > 0" variant="success" show>{{ successDeleted }} companies has been sucessful deleted. </b-alert>
    <b-alert v-if="errorMessage != ''" variant="danger" show>Something went wrong. There is error message like: {{errorMessage.message}}</b-alert>
      </span>
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
        <span slot="percents" v-bind="percent">
          <a-row>
      <a-col :span="12">
        <a-slider  v-model="percent" :min="0" :max="1" :step="0.01" />
      </a-col>
      <a-col :span="4">
        <a-input-number
          v-model="percent"
          :min="0"
          :max="1"
          :step="0.01"
          style="marginLeft: 16px"
        /> 
       </a-col>
       </a-row> 
      </span>
        </a-table>
      </template>
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
    dataIndex: 'percent',
    key: 'percents',
    title: 'Percent',
    scopedSlots: { customRender: 'percent' },
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
      inputValues: []
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
      onChange(nextTargetKeys) {
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
            axios.post(process.env.VUE_APP_API_ENDPOINT + '/user/saveCompany', data,
                { 
                    headers: headers 
                })
                .then((response) => {
                    console.log(response);
                    this.successDeleted = 0;
                    this.successAdded += 1;
                    this.errorMessage = '';
                }, (error) => {
                    console.log(error);
                    this.errorMessage = error;
                });
          }
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
            axios.post(process.env.VUE_APP_API_ENDPOINT + '/user/deleteCompany', data,
                { 
                    headers: headers 
                })
                .then((response) => {
                    console.log(response);
                    this.successDeleted += 1;
                    this.successAdded = 0;
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
                   
                }, (error) => {
                    console.log(error);
                    this.errorMessage = error;
                });
      },
  },
  computed: {
    dynamicComponent() {
        return {
        template: '<div><b>Hello</b></div>'
      }
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
.transfer {
    margin-right: 1%;
    margin-left: 1%;
}
</style>