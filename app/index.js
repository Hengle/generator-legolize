var generators = require('yeoman-generator');
var yosay = require('yosay');
var rimraf = require('rimraf');

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
	initializing: function () {
		this.pkg = require('../package.json');

		// Install npm and bower dependencies
		this.installDependencies();
	},
	prompting: function () {
		var done = this.async();

		this.log(yosay('Legolize it!'));

		var prompts = [
			{
				type: 'input',
				name: 'destination',
				message: 'Where would you like to install Legolize?',
				default: "assets" // Default to current folder name
			},
			{
				type: 'checkbox',
				name: 'features',
				message: 'What Legolize components would you like to install?',
				choices: [{
					name: 'Legolize Core ( The reference library installed via bower )',
					value: 'includeLegolize',
					checked: true
				}, {
					name: 'Legolize Base ( Boilerplate project for Legolize )',
					value: 'includeLegolizeBase',
					checked: true
				}, {
					name: 'Legolize Legos ( Implementation of all Legos )',
					value: 'includeLegolizeLegos',
					checked: true
				}]
			}
		];

		this.prompt(prompts, function ( answers ) {
			var features = answers.features;

			this.destinationRoot(answers.destination);

			var hasFeature = function ( feat ) {
				return features.indexOf(feat) !== - 1;
			};

			// manually deal with the response, get back and store the results.
			// we change a bit this way of doing to automatically do this in the self.prompt() method.
			this.includeLegolize = hasFeature('includeLegolize');
			this.includeLegolizeBase = hasFeature('includeLegolizeBase');
			this.includeLegolizeLegos = hasFeature('includeLegolizeLegos');

			done();
		}.bind(this));
	},
	writing: {
		bower: function () {
			var bower = {
				name: this._.slugify(this.appname),
				private: true,
				dependencies: {}
			};

			if ( this.includeLegolize ) {
				bower.dependencies.legolize = 'latest';
			}

			this.copy('bowerrc', '.bowerrc');
			this.write('bower.json', JSON.stringify(bower, null, 2));
		},
		git: function () {
			this.copy('gitignore', '.gitignore');
			this.copy('gitattributes', '.gitattributes');
		}
	},
	legolizeBase: function () {
		var done = this.async();
		this.extract('https://github.com/frontend-mafia/legolize-base/archive/master.zip', '.', function () {
			done();
		}.bind(this));
	},
	legolizeLegos: function () {
		var done = this.async();
		this.extract('https://github.com/frontend-mafia/legolize-legos/archive/master.zip', '.', function () {
			done();
		}.bind(this));
	},
	cleanup: function () {
		var self = this;
		var dest = this.destinationRoot();

		// Copy to correct folder and then remove the git folder
		self.directory(dest + '/legolize-base-master', dest + '/less').on('end', function () {
			rimraf(dest + '/legolize-base-master', function () {

			});
		}).directory(dest + '/legolize-legos-master', dest + '/less/legos').on('end', function () {
			rimraf(dest + '/legolize-legos-master', function () {
				console.log("Done!");
			});
		});
	}
});