var generators = require('yeoman-generator');
var mkdirp = require('mkdirp');
var chalk = require('chalk');

module.exports = generators.Base.extend({
  constructor: function () {
     generators.Base.apply(this, arguments);

     this.argument('type', {
       desc: 'Set the challenge type',
       type: String,
       optional: true,
       defaults: 'challenge_1'
     });
  },
  writingApp: function(){
    this.fs.copy(
      this.templatePath('base'),
      this.destinationPath()
    );
  },
  creatingDirStructure(){
    var dirStructure = [];
    var log = this.log;
    var destinationPath = this.destinationPath();

    switch (this.type.toLowerCase()) {
      // Add here all the posible challenge cases and define the dir structure
      default:
        dirStructure = [
          'app/scripts/controllers',
          'app/scripts/directives',
          'app/scripts/factories',
          'app/scripts/filters',
          'app/scripts/modules',
          'app/fonts',
          'app/vendor',
          'app/styles',
          'data',
          'tests',
        ];
        break;
    }

    dirStructure.forEach(function(element, index, array){
      mkdirp(destinationPath + '/' + element, function (err) {
        if (err) {
          return this.log(err);
        }
        log('   ' + chalk.green('create') + ' ' + element);
      });
    });
  },
  configuring(){
    this.fs.write(this.destinationPath('.bowerrc'), JSON.stringify({
      directory: "app/vendor"
    }));
  },
  installingNpm: function() {
    this.npmInstall( [
        'express',
        'sass',
        'node-base64-image',
        'progress',
        'request'
    ]);
  },
  installingBower: function() {
    this.bowerInstall([
      'bootstrap',
      'bootstrap-sass',
      'angular#~1.5.8'
    ]);
  },
  // install: function(){
  //   this.spawnCommand('sass', ['app/sass/main.scss','app/styles/app.css']);
  //   this.spawnCommand('node', 'src/pokeapi.local.js');
  // }
});
