module.exports = function(grunt) {
  'use strict';
  require("load-grunt-tasks")(grunt);
  grunt.initConfig({
    "babel": {
      options: {
        sourceMap: true,
        presets: ['es2015']
      },
      dist: {
        files: {
          "static/dist/app.js": "static/src/app.js"
        }
      }
    }
  });

  grunt.registerTask("default", ["babel"]);
};
