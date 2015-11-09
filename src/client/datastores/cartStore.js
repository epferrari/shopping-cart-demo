import Reflux from 'reflux';
import cartActions from '../actions/cartActions.js';
import {merge} from 'lodash';
import Promise from 'bluebird';
import {reduce,find} from 'lodash';

var data = require('./products.json');


var storeState = {};


function getState(){
	return merge({},storeState);
}



var cartStore = Reflux.createStore({
	listenables: [cartActions],

	setState(newState){
		storeState = merge({},storeState,newState);
		this.trigger(storeState);
	},

	init(){
		var initialState = data.reduce((accum,product) => {
			accum[product.id] = 0;
			return accum;
		},{});

		this.setState(initialState);
	},

	onAddItem(id){
		var newState = {};
		var prevCount = getState()[id];
		newState[id] = prevCount ? prevCount + 1 : 1;

		this.setState(newState);
	},

	onRemoveItem(id){
		var newState = {};
		var prevCount = getState()[id];
		newState[id] = prevCount ? prevCount - 1 : 0;

		this.setState(newState);
	},

	onSetItemQty(qty,id){
		if(Number.isInteger(parseInt(qty)) && qty > -1){
			console.log(qty);
			let newState = {};
			newState[id] = qty;
			this.setState(newState);
		}
	},

	getCart(){
		return reduce(storeState,(accum,qty,id) => {
			if(id && qty > 0){
				accum.items[id] = qty;
				var product = this.findProductById(id);
				if(product) accum.total += product.price * qty;
			}
			return accum;
		},{items:{},total:0});
	},

	findProductById(id){
		return find(data,p => (p.id == id));
	}

});


module.exports = cartStore;
