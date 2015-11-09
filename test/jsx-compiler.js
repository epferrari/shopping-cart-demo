var fs = require('fs');
var ReactTools = require('react-tools');

require.extensions['.jsx'] = function(module, filename){
	var content = fs.readFileSync(filename, 'utf8');
	var compiled = ReactTools.transform(content);

	return module._compile(compiled, filename);
};
