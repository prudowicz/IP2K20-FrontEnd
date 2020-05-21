<template>
  <div>
    <a-row>
      <a-col :span="12">
        <a-slider v-model="inputValue" :min="0" :max="1" :step="0.01" />
      </a-col>
      <a-col :span="4">
        <a-input-number
          v-model="inputValue"
          :min="0"
          :max="1"
          :step="0.01"
          style="marginLeft: 16px"
        />
      </a-col>
    </a-row>
  </div>
</template>


<script>
import 'ant-design-vue/dist/antd.css';
import Vue from 'vue';
import Antd from 'ant-design-vue';

Vue.use(Antd);

export default {
  name: 'Slider',
  props: {
      name: String,
  },
  data() {
    return {
      inputValue: 0,
      inputValue1: 1,
    };
  },
  methods: {
      mounted() {
        console.log("chuj");
  },
  }
}
</script>