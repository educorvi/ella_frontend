import Vue from 'vue'
import Vuex from 'vuex'
import {normURLS} from "/src/utilities/globals.mjs";
import {API_ROOT_URL, INSTANCE_ID} from "../../config";
import axios from "axios";

Vue.use(Vuex)

/**
 * @module store
 * @description The VUEX store
 */
export default new Vuex.Store({
    state: {
        /**
         * The Data from the backend
         * @type {Object}
         */
        mainData: null,

        /**
         * Is the sidebar currently shown
         * @type {boolean}
         */
        sidebar: false,

        /**
         * Is the page loading?
         * @type {boolean}
         */
        load: false,

        /**
         * If HTML is returned from a request and should be rendered it's saved here and the html route is opened
         * @type {string}
         */
        customHTML: ""
    },
    mutations: {
        /**
         * Queries the data from the backend and sets it in mainData
         */
        getMainData(state) {
            axios.get(normURLS(API_ROOT_URL) + '/' + INSTANCE_ID).then(res => {
                state.mainData = res.data;
            }).catch(error => state.mainData = {error});
        },
        /**
         * Sets the sidebar status
         * @param state state
         * @param status the status
         */
        sidebar(state, status) {
            state.sidebar = status;
        },
        /**
         * Sets loading
         * @param state
         * @param data
         */
        load(state, data) {
            state.load = data;
        },

        /**
         * Sets customHTML
         * @param state
         * @param data
         */
        customHTML(state, data) {
            state.customHTML = data;
        }
    },
    actions: {},
    modules: {},
    getters: {
        mainData: state => state.mainData,
        sidebar: state => state.sidebar,
        load: state => state.load,
        customHTML: state => state.customHTML
    }
})
