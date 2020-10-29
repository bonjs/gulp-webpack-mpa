import Vue from 'vue'
import App from './a.vue'

new Vue({
    el: '#app',
    render: function (createElement) {
        return createElement(App);
    }
})