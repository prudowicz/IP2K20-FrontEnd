<template>
    <b-container class="header">
        <b-row class="text-center">
            <b-col cols="3">{{symbol.name}}</b-col>
            <b-col cols="3">{{symbol.currency}}</b-col>
            <b-col cols="3">{{symbol.categoryName}}</b-col>
            <b-col cols="3" v-if="symbol.selected">
                <b-button variant="danger" v-on:click="unselect(symbol)">Remove</b-button>
            </b-col>
            <b-col v-else>
                <b-button variant="success" v-on:click="select(symbol)">Add</b-button>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
import axios from 'axios';
    export default {
        name: "SymbolHeader",
        props: {
            symbol: Object
        },
        methods: {
            select(symbol) {
                this.$store.commit('select', symbol.name);
               // console.log(symbol.name);
                 let headers = {
                'Content-Type': 'application/json',
                'Device-info': 'None',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
            const data = {
                companyName: symbol.name
            };
            axios.post(process.env.VUE_APP_API_ENDPOINT + '/user/saveCompany', data,
                { 
                    headers: headers 
                })
                .then((response) => {
                    console.log(response);
                    this.$parent.$emit('isSuccess', true)
                }, (error) => {
                    console.log(error);
                });
            },
            unselect(symbol) {
                this.$store.commit('unselect', symbol.name);
                   let headers = {
                'Content-Type': 'application/json',
                'Device-info': 'None',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
            const data = {
                companyName: symbol.name
            };
            axios.post(process.env.VUE_APP_API_ENDPOINT + '/user/deleteCompany', data,
                { 
                    headers: headers 
                })
                .then((response) => {
                    console.log(response);
                }, (error) => {
                    console.log(error);
                });
            },
        }
    }
</script>

<style scoped>
    .header {
        background-color: chartreuse;
        margin-bottom: 5px;
    }
</style>