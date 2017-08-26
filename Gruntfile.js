module.exports = function(grunt) {

  grunt.initConfig({
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        background: true,
        browsers: ['Chrome']
      },
      travis: {
        configFile: 'karma.conf.js',
        singleRun: true,
        browsers: ['PhantomJS']
      }
    },
    watch: {
      karma: {
        files: [
          'src/scripts/**/*.js',
          'tests/unit/**/*.js'
        ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-karma');
  grunt.registerTask('test', ['karma:travis']);
  grunt.registerTask('devmode', ['karma:unit', 'watch']);
};
