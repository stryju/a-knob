/*global module*/
module.exports = function ( grunt ) {
  'use strict';

  grunt.initConfig({

    pkg : grunt.file.readJSON( 'package.json' ),

    compass : {
      /* https://npmjs.org/package/grunt-contrib-compass */

      options : {
        httpPath  : '/',

        sassDir   : 'assets/styles/compass',
        cssDir    : 'public/styles'
      },

      clean : {
        options : {
          clean : true
        }
      },

      dev : {
        options : {
          outputStyle : 'expanded',
          raw         : 'sass_options = { :debug_info => true }\n'
        }
      },

      dist : {
        options : {
          force       : true,
          outputStyle : 'compressed',
          raw         : 'asset_cache_buster :none\n'
        }
      }
    },

    jshint : {
      /* https://npmjs.org/package/grunt-contrib-jshint */

      options: {
        // strict
        'bitwise'   : false,
        'camelcase' : true,
        'curly'     : true,
        'eqeqeq'    : true,
        'forin'     : true,
        'immed'     : true,
        'indent'    : 2,
        'latedef'   : true,
        'newcap'    : true,
        'noarg'     : true,
        'quotmark'  : 'single',
        'strict'    : true,
        'trailing'  : true,
        'undef'     : true,
        'unused'    : true,

        // relaxed
        'eqnull'    : true,
        'smarttabs' : true
      },

      dev : {
        options : {
          'undef'  : false,
          'unused' : false,
          'debug'  : true
        },
        files : {
          src : [
            'assets/scripts/**/*.js'
          ]
        }
      },

      dist : {
        files : {
          src : [
            'Gruntfile.js',
            'assets/scripts/**/*.js'
          ]
        }
      }
    },

    uglify : {
      main : {
        files : {
          'public/scripts/a-knob.js' : 'assets/scripts/a-knob.js'
        }
      }
    },

    watch : {
      /* https://npmjs.org/package/grunt-contrib-watch */

      options: {
        interrupt: true
      },

      styles : {
        files : 'assets/styles/**/*.scss',
        tasks : 'compass:dev'
      },

      scripts: {
        files : 'assets/scripts/**/*.js',
        tasks : 'jshint:dev'
      }
    }
  });

  grunt.loadNpmTasks( 'grunt-contrib-watch' );
  grunt.loadNpmTasks( 'grunt-contrib-compass' );
  grunt.loadNpmTasks( 'grunt-contrib-jshint' );
  grunt.loadNpmTasks( 'grunt-contrib-uglify' );

  grunt.registerTask( 'dist', [
    'compass:clean',
    'compass:dist',

    'jshint:dist',
    'uglify'
  ]);

  // grunt for development
  grunt.registerTask( 'dev', [
    'compass:clean',
    'compass:dev',

    'jshint:dev',
    'uglify'
  ]);

  // grunt [default]
  grunt.registerTask( 'default', [
    'dist'
  ]);
};
