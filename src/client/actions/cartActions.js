import Reflux from 'reflux';

var cartActions = Reflux.createActions([
	'addItem',
	'removeItem',
	'setItemQty'
]);

export default cartActions;
