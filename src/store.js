import Vue from 'vue';
import Vuex from 'vuex'
import axios from "axios";
import baseUrl from './config.js';

Vue.use(Vuex);

const ALL_SYMBOLS = "/companies/selectInfo";
const SELECT_SYMBOL = "/user/saveCompany";
const UNSELECT_SYMBOL = "/user/deleteCompany";
export const store = new Vuex.Store({
    state: {
        symbols: []
    },
    getters: {
        selectedSymbols(state) {
            return state.symbols.filter(symbol => {
                return symbol.selected === true;
            });
        },
        unselectedSymbols(state) {
            return state.symbols.filter(symbol => {
                return symbol.selected === false;
            });
        }
    },
    mutations: {
        select(state, name) {
            const symbol = state.symbols.find(symbol => {
                return symbol.name ===  name.toUpperCase();
            });
            symbol.selected = true;
        },
        unselect(state, name) {
            const symbol = state.symbols.find(symbol => {
                return symbol.name === name.toUpperCase();
            });
            symbol.selected = false;
        },
    },
    actions: {
        select(context, name) {
            console.log(name)
            let headers = {
                'Content-Type': 'application/json',
                'Device-info': 'None',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
            const data = {
                companyName: name
            };
            // axios.post(baseUrl.root + SELECT_SYMBOL, data, { headers: headers} ).then(() => {
            //     context.commit('select', name);
            // }).catch( response => {
            //     console.log(response)
            // }
            axios.post(baseUrl.root + SELECT_SYMBOL, data,
                { 
                    headers: headers 
                })
                .then((response) => {
                    context.commit('select', name);
                    console.log(response);
                }, (error) => {
                    console.log(error);
                });
        },
        unselect(context, name) {
            let headers = {
                'Content-Type': 'application/json',
                'Device-info': 'None',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
            const data = {
                companyName: name
            };
            axios.post(baseUrl.root + UNSELECT_SYMBOL, data, { headers: headers} ).then(() => {
                context.commit('select', name);
            }).catch( response => {
                    console.log(response)
                }
            )
        },
       // context.state.symbols = response.data
        loadSymbols(context) {
            let headers = {
                'Content-Type': 'application/json',
                'Device-info': 'None',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
            axios.get(baseUrl.root + ALL_SYMBOLS,
                { 
                    headers: headers 
                })
                .then((response) => {
                    context.state.symbols = response.data
                    console.log(response);
                }, (error) => {
                    console.log(error);
                });
        }
    }
});