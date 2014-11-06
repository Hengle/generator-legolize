var generators = require('yeoman-generator');
var yosay = require('yosay');
var rimraf = require('rimraf');

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
				name: 'name',
				message: 'What is the name of your app?',
				default: this._.slugify(this.appname) // Default to current folder name
			},
			{
				type: 'input',
				name: 'assetsDestination',
				message: 'Where would you like to install Legolize assets?',
				default: "assets"
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

			var appFolder = "/app/"; // tmp, same as legolize-app

			this.destinationRoot(answers.name); // TODO: Do I need slugify here?
			this.assetsDestination = appFolder + answers.assetsDestination;

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
		},
		packageJson: function () {
			//this.template('_package.json', 'package.json');
		}
	},
	legolizeApp: function () {
		var done = this.async();
		this.extract('https://github.com/frontend-mafia/legolize-app/archive/master.zip', '.', function () {
			done();
		}.bind(this));
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
		self.directory(dest + '/legolize-app-master', './').on('end', function () {
			rimraf(dest + '/legolize-app-master', function () {

			});
		}).directory(dest + '/legolize-base-master', self.assetsDestination + '/less').on('end', function () {
			rimraf(dest + '/legolize-base-master', function () {

			});
		}).directory(dest + '/legolize-legos-master', self.assetsDestination + '/less/legos').on('end', function () {
			rimraf(dest + '/legolize-legos-master', function () {
				console.log("Done!");
			});
		});
	}
});