grunt-jmeter
============

Grunt tasks for execution jmeter tests

## Getting Started
Checkout [Grunt](http://gruntjs.com/) for more information. In order to use this plugin, install and 

	npm install grunt-jmeter --save-dev

Download, Extract, and Install the jmeter distro. The jmeter binary will be symlinked in ./node_modules/.bin/jmeter

	jmeter-manager install

Use inside your Gruntfile:

	grunt.loadNpmTasks('grunt-contrib-coffee');

Simply run jmeter with the symlinked binary:

	./node_modules/.bin/jmeter
