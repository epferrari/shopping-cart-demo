/* external deps */
import React
	from "react";

import ReactDOM
	from 'react-dom';

import {Router,Route,Link,History,IndexRoute}
	from 'react-router';

import {Grid}
	from 'react-bootstrap';

import {AppBar,LeftNav,AppCanvas}
	from 'material-ui';

import Shop
	from './views/Shop.jsx';

import Cart
	from './views/Cart.jsx';

import appContext
	from './contexts';

import FontIcon
	from '@epferrari/react-fa-icon';

import cartStore
	from './datastores/cartStore.js';


var menuItems = [
	{route:'/shop',text:'Shop'},
	{route:'/cart',text:'Cart'}
];

var App = React.createClass({
	mixins: [appContext.Mixin,History],
	componentDidMount(){
		this.refs.leftNav.close();
	},
	toggleNav(){
		this.refs.leftNav.toggle();
	},
	navigate(e,i,menuItem){
		this.history.pushState(null,menuItem.route);
	},
	render: function (){
		return (
			<AppCanvas>
				<LeftNav ref="leftNav" menuItems={menuItems} docked={false} onChange={this.navigate}/>
				<AppBar
					title="Fruit Stand"
					showMenuIconButton={true}
					style={{position:"fixed",top:0}}
					onLeftIconButtonTouchTap={this.toggleNav}
					iconElementRight={<Link to="/cart"><FontIcon icon="shopping-cart"/></Link>}>
				</AppBar>
				<div style={{paddingTop:50}}>
					{this.props.children}
				</div>
			</AppCanvas>
		);
	}
});

ReactDOM.render((
		<Router>
			<Route path="/" component={App}>
				<IndexRoute component={Shop}/>
				<Route path="shop" component={Shop}/>
				<Route path="cart" component={Cart}/>
				<Route path="*" component={Shop}/>
			</Route>
		</Router>
	),document.getElementById('app')
);
