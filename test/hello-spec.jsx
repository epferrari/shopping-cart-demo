/*
var Hello = require('../src/client/components/hello.jsx');
var packageName = require('../package.json').name;

describe('Setup test', function (){

	var node, message;

	// render </Hello > into jsdom
	before('rendering component', function(){
		var component = React.render(
			<Hello packageName={packageName}/>,
			document.body);

		var component = React.test.findRenderedDOMComponentWithTag(component, 'span');
		message = React.findDOMNode(component).textContent;
	});

	it('domino is working', function() {
		expect(document.body).to.be.ok;
		expect(document.nobody).to.not.be.ok;
	});


	it('should include the package name', function(){
		expect(message).to.contain(packageName);
	});
});
*/
