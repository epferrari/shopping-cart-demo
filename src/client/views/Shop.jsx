import React from 'react';
import {Grid,Row,Col} from 'react-bootstrap';
import actions from '../actions/cartActions.js';
import products from '../datastores/products.json';
import {Paper,GridList,GridTile,FloatingActionButton,Snackbar,DropDownMenu,TextField} from 'material-ui';
import FontIcon from 'react-fa-icon';
import Promise from 'bluebird';
import axios from 'axios';
import {chain,find} from 'lodash';

function fetchImage(title){
	return axios.get('http://api.pixplorer.co.uk/image?word=fruit' + title);
}

var ShopItem = React.createClass({
	componentDidMount(){
		fetchImage(this.props.title)
		.then(res => {
			this.setState({img: res.data.images[0].imageurl});
		});
	},

	getInitialState(){
		return {
			img:"",
			hovered:false
		};
	},

	applyHoverState(){
		this.setState({hovered:true});
	},
	removeHoverState(){
		this.setState({hovered:false});
	},

	addToCart(){
		this.props.addToCart(this.props.id);
	},

	getStyles(){
		return {
			image: {
				opacity: this.state.hovered ? 1.0 : 0.85,
				cursor: 'pointer'
			}
		};
	},

	render(){
		let styles = this.getStyles();
		return (
			<GridTile
				title={this.props.title}
				subtitle={'$' + (1).toFixed.call(this.props.price,2)}
				onMouseOver={this.applyHoverState}
				onMouseOut={this.removeHoverState}
				actionIcon={
					<FloatingActionButton onClick={this.addToCart} backgroundColor="rgb(53, 219, 179)">
						<FontIcon  icon="plus"/>
					</FloatingActionButton>
				}><img style={styles.image} src={this.state.img}/>
			</GridTile>
		);
	}
});



var Shop = React.createClass({

	getDefaultProps(){
		return {products: products};
	},

	getInitialState(){
		return {
			sort:0,
			filter: ""
		};
	},

	setSort(e,payload){
		this.setState({sort:payload});
	},

	setFilter(e){
		this.setState({filter: this.refs.search.getValue()});
	},

	addToCart(id){
		actions.addItem(id);
		this.setState({ lastAdded: id });
		this.refs.snackbar.show();
	},

	undoAddToCart(){
		actions.removeItem(this.state.lastAdded);
		this.refs.snackbar.dismiss();
	},


	getProductTitleById(id){
		var product = find(this.props.products,(p) => {
			return p.id == id;
		});
		return product ? product.title : '';
	},

	getMenuItems(){
		return [
			{payload: 1, text: 'Price (Low to High)'},
			{payload: 2, text: 'Price (High to Low)'},
			{payload: 3, text: 'A-Z'},
			{payload: 4, text: 'Z-A'}
		];
	},

	renderSort(){
		return (
			<DropDownMenu
				style={this.getStyles().sort}
				menuItems={this.getMenuItems()}
				onChange={this.setSort}/>
		);
	},

	sorter(product){
		switch(this.state.sort){
			case 0:
				return product.price;
			case 1:
				return product.price;
			case 2:
				return product.title;
			case 3:
				return product.title;
			default:
				return product.price;
		}
	},

	renderProducts(){
		var sorted = chain(this.props.products)
		.filter((p) => {
			let {filter} = this.state;
			if(filter && this.state.filter.length){
				return new RegExp(filter,"i").test(p.title);
			}else{
				return true;
			}
		})
		.sortBy(this.sorter)
		.map((p,i) => {
			return <ShopItem {...p} key={i} addToCart={this.addToCart}/>;
		})
		.value();

		if(this.state.sort === 1 || this.state.sort === 3)
		sorted = chain(sorted).reverse().value();
		return sorted;
	},

	render: function(){
		let snackbarMessage = this.getProductTitleById(this.state.lastAdded);
		return (
			<Grid style={{zIndex:0,marginTop:15}}>
					<Row>
						<Col md={4}>
							<h1 style={this.getStyles().title}>Shop</h1>
						</Col>
						<Col md={4} style={{paddingTop:20}}>
							<TextField
								ref="search"
								placeholder="Search"
								onChange={this.setFilter}
								fullWidth={true}/>
						</Col>
						<Col md={4} style={{paddingTop:20}}>
							{this.renderSort()}
						</Col>
					</Row>
					<Row>
						<GridList cellHeight={200} cols={4}>{this.renderProducts()}</GridList>
					</Row>
					<Snackbar
						ref="snackbar"
						action="Undo"
						onActionTouchTap={this.undoAddToCart}
						message={"Added " + snackbarMessage + " to cart"}/>
			</Grid>
		);
	},

	getStyles(){
		return {
			cartRoot: {
				marginLeft:"auto",
				marginRight:"auto"
			},
			title:{
				minHeight: 75,
				display:'inline-block'
			},
			sort: {
				float: 'right'
			}
		};
	}
});


export default Shop;
