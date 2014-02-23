module.exports = (grunt) ->

  grunt.initConfig
    sass:
      compile:
        files:
          "contents/assets/main.css": "assets/main.scss"
        options:
          includePaths: [ './source/assets' ]
    coffee:
      compile:
        files:
          "contents/assets/articles.js": "assets/articles.coffee"
    grunticon:
      compile:
        files: [{
          expand: true
          cwd: 'assets/icons'
          src: ['*.svg', '*.png']
          dest: 'contents/assets/icon'
        }]
    wintersmith:
      build: {}
      preview:
        options: { action: 'preview' }

    watch:
      sass:
        files: ['assets/**/*.scss']
        tasks: ['sass:compile']
      coffee:
        files: ['assets/**/*.coffee']
        tasks: ['coffee:compile']
      icons:
        files: ['assets/**/*.svg']
        tasks: ['grunticon:compile']

  grunt.loadNpmTasks('grunt-sass')
  grunt.loadNpmTasks('grunt-grunticon')
  grunt.loadNpmTasks('grunt-contrib-coffee')
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-wintersmith')
