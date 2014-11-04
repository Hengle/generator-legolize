var generators = require('yeoman-generator');

/*
module.exports = generators.Base.extend({
	// The name `constructor` is important here
	constructor: function () {
		// Calling the super constructor is important so our generator is correctly setup
		generators.Base.apply(this, arguments);

		// And next add your custom code
		this.option('coffee'); // This method adds support for a `--coffee` flag
	}
});
*/

module.exports = generators.Base.extend({
	method1: function () {
		console.log('method 1 just ran');
	},
	method2: function () {
		console.log('method 2 just ran');
	}

});