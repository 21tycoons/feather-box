module.exports = function(grunt) {

  // Project configuration
  var banner = '/**\n * Feather-Box - super thin jQuery lightbox\n * Version <%= pkg.version %> - <%= pkg.homepage %>\n *\n * Copyright <%= grunt.template.today("yyyy") %>, <%= pkg.author.name %> (<%= pkg.author.url %>)\n * MIT License.\n**/';
  var gallery = '/**\n * Feather-Box Gallery – an extension for the ultra slim jQuery lightbox\n * Version <%= pkg.version %> - <%= pkg.homepage %>\n *\n * Copyright <%= grunt.template.today("yyyy") %>, <%= pkg.author.name %> (<%= pkg.author.url %>)\n * MIT Licensed.\n**/';

  const uglifyConfig = {
    featherbox: {
      options: {
        banner: banner+'\n'
      },
      src: './src/feather-box.js',
      dest: './release/feather-box.min.js'
    },
    gallery: {
      options: {
        banner: gallery
      },
      src: './src/feather-box.gallery.js',
      dest: './release/feather-box.gallery.min.js'
    }
  }

  const jshintConfig = {
    options: {
      laxbreak: true,
      curly: true,
      eqeqeq: true,
      eqnull: true,
      browser: true,
      reporterOutput: "",
      globals: {
        jQuery: true,
        Hammer: true,
        el: true
      },
    },
    uses_defaults: ['src/*.js']
  }

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: uglifyConfig,
    jshint: jshintConfig,
cssmin: {
options: {
keepSpecialComments: 1
},
featherlight: {
options: {
banner: banner
},
src: 'src/feather-box.css',
dest: 'release/feather-box.min.css'
},
gallery: {
options: {
banner: gallery
},
src: 'src/<%= pkg.name %>.gallery.css',
dest: 'release/<%= pkg.name %>.gallery.min.css'
}
},
jquerymanifest: {
options: {
source: grunt.file.readJSON('package.json'),
overrides: {
"name": "feather-box",
"version": "<%= pkg.version %>",
"title": "<%= pkg.title %>",
"description": "<%= pkg.description %>",
"dependencies": {
"jquery": ">=1.7"
},
"devDependencies": null,
"main": null
}
}
},
replace: {
src: {
src: ['./README.md','./src/*.*'],
overwrite: true,
replacements: [
{
from: /Copyright\s[0-9]{4}/g,
to: 'Copyright <%= grunt.template.today("yyyy") %>'
},
{
from: /\*\sVersion\s[0-9]+[.]{1}[0-9]+[.]{1}[0-9]+/g,
to: '* Version <%= pkg.version %>'
},
{
from: /Current\sRelease\s[0-9]+[.]{1}[0-9]+[.]{1}[0-9]+/g,
to: 'Current Release <%= pkg.version %>'
},
{
from: /archive\/[0-9]+[.]{1}[0-9]+[.]{1}[0-9]+/g,
to: 'archive/<%= pkg.version %>'
},
{
from: /21tycoons\/featherbox\/[0-9]+[.]{1}[0-9]+[.]{1}[0-9]+/g,
to: '21tycoons/featherbox/<%= pkg.version %>'
},
{
from: /"version": "[0-9]+[.]{1}[0-9]+[.]{1}[0-9]+"/g,
to: '"version": "<%= pkg.version %>"'
},
{
from: /\([0-9]+[.]{1}[0-9]+[.]{1}[0-9]+\)/g,
to: '(<%= pkg.version %>)'
}
]
},
min: {
src: ['src/index.html', 'src/gallery.html'],
dest: './',
replacements: [
{
from: '="featherlight.gallery.',
to: '="release/featherbox.gallery.min.'
},
{
from: '="featherbox.js',
to: '="release/featherbox.min.js'
},
{
from: '="featherbox.css',
to: '="release/featherbox.min.css'
},
{
from: '="../assets',
to: '="assets'
},
{
from: 'main.zip',
to: '<%= pkg.version %>.zip'
}
]
},
changelog: {
src: ['./CHANGELOG.md'],
overwrite: true,
replacements: [
{
from: 'Main\n-----------------------------------',
to: 'Main\n-----------------------------------\n\n\n<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n-----------------------------------'
}
]
},
},
bump: {
options: {
files: [
'package.json'
],
updateConfigs: ['pkg'],
commit: true,
commitMessage: 'Release Version %VERSION%',
commitFiles: ['-a'], // '-a' for all files
createTag: true,
tagName: '%VERSION%',
tagMessage: 'Released Version %VERSION%',
push: false
/*pushTo: 'upstream',*/
/*gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d' // options to use with '$ git describe'*/
},
},
mocha: {
test: {
src: ['test/featherbox*.html'],
},
options: {
run: true,
},
},
});

  // Load the plugin that provides the "uglify" task.
  // grunt.loadNpmTasks('grunt-contrib-jshint')
  grunt.loadNpmTasks('grunt-text-replace')
  grunt.loadNpmTasks('grunt-contrib-uglify')
  grunt.loadNpmTasks('grunt-contrib-cssmin')
  grunt.loadNpmTasks('grunt-jquerymanifest')
  grunt.loadNpmTasks('grunt-mocha')
  grunt.loadNpmTasks('grunt-bump')

  // Default task(s).
  grunt.registerTask('default', ['replace:src', 'replace:min', 'uglify', 'cssmin', 'jquerymanifest'])
  grunt.registerTask('test-release', ['bump-only:patch', 'replace', 'uglify', 'cssmin', 'jquerymanifest'])

  grunt.registerTask('patch',   ['bump-only:patch', 'replace:src', 'replace:min', 'uglify', 'cssmin', 'jquerymanifest', 'bump-commit', 'replace:changelog',])
  grunt.registerTask('minor',   ['bump-only:minor', 'replace:src', 'replace:min', 'uglify', 'cssmin', 'jquerymanifest', 'bump-commit', 'replace:changelog',])
  grunt.registerTask('major',   ['bump-only:major', 'replace:src', 'replace:min', 'uglify', 'cssmin', 'jquerymanifest', 'bump-commit', 'replace:changelog',])

  grunt.registerTask('test',    ['mocha'])
}
