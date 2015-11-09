import React from 'react';
import {Grid,Row,Col} from 'react-bootstrap';
import actions from '../actions/cartActions.js';
import products from '../datastores/products.json';
import Reflux from 'reflux';
import cartStore from '../datastores/cartStore.js';
import {reduce,find,map} from 'lodash';
import {Paper,TextField,RaisedButton} from 'material-ui';


var CartItem = React.createClass({

	updateQty(){
		var q = this.refs.input.getValue();
		actions.setItemQty(q,this.props.id);
	},

	render(){
		return (
			<Row>
				<Paper style={{width:"100%",height:100}}>
					<Row>
						<Col xs={6}>
							<h3>{this.props.title}</h3>
						</Col>
						<Col xs={4} style={{paddingTop:20}}>
							<TextField
								ref="input"
								placeholder="qty"
								defaultValue={this.props.qty}/> x {this.props.price.toFixed(2)}
						</Col>
						<Col xs={2} style={{paddingTop:20}}>
							<RaisedButton onClick={this.updateQty}>Update Cart</RaisedButton>
						</Col>
					</Row>
				</Paper>
			</Row>
		);
	}
});

var Cart = React.createClass({
	mixins: [Reflux.ListenerMixin],
	getInitialState(){
		return cartStore.getCart();
	},
	componentDidMount(){
		this.listenTo(cartStore,this.updateCart);
	},

	updateCart(){
		this.setState(cartStore.getCart());
	},

	renderItems(){
		console.log(this.state.items);
		return map(this.state.items,(qty,id) => {
			var product = cartStore.findProductById(id);
			console.log(product);
			return <CartItem {...product} qty={qty} key={id}/>;
		});
	},

	render: function(){
		return (
			<Grid style={{zIndex:0,marginTop:15}}>
				<Row>
					<h1>Cart</h1>
				</Row>
				<Row>
					{this.renderItems()}
				</Row>
				<Row>
					<Col xs={4} xsOffset={8}>
						<h2>{"Total: $" + (this.state.total).toFixed(2)}</h2>
					</Col>
				</Row>
			</Grid>
		);
	}
});


export default Cart;
