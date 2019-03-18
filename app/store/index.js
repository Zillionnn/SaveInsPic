import Vue from 'nativescript-vue'
import Vuex from 'vuex'
import img from './module/image'
Vue.use(Vuex)

export default new Vuex.Store({
	modules: {
		img
	}
	// state: {
	// 	count: 0
	// },
	// mutations: {
	// 	increment: state => state.count++,
	// 	decrement: state => state.count--
	// }
})
