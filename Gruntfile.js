module.exports = function(grunt) {
  'use strict';
  require('time-grunt')(grunt);
  require('jit-grunt')(grunt);
  var config = {
    app: 'app',
    dev: '_site',
    dist: 'dist',
    public: 'public'
  };
  grunt.initConfig({
    config: config,
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*!\n' + '* <%= pkg.name %> v<%= pkg.version %> by Ade25\n' + '* Copyright <%= pkg.author %>\n' + '* Licensed under <%= pkg.licenses %>.\n' + '*\n' + '* Designed and built by ade25\n' + '*/\n',
    jqueryCheck: 'if (typeof jQuery === "undefined") { throw new Error("We require jQuery") }\n\n',
    jshint: {
      options: {jshintrc: 'js/.jshintrc'},
      grunt: {src: 'Gruntfile.js'},
      src: {src: ['js/*.js']}
    },
    jscs: {
      options: {config: 'js/.jscsrc'},
      grunt: {src: '<%= jshint.grunt.src %>'},
      src: {src: '<%= jshint.src.src %>'}
    },
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: false
      },
      dist: {
        src: [
            'bower_components/jquery/dist/jquery.js',
            'bower_components/modernizr/modernizr.js',
            'bower_components/bootstrap/dist/js/bootstrap.js',
            'bower_components/blazy/blazy.js',
            'js/main.js'
        ],
        dest: '<%= config.dist %>/js/<%= pkg.name %>.js'
      },
      theme: {
        src: [
            'bower_components/bootstrap/dist/js/bootstrap.js',
            'bower_components/blazy/blazy.js',
            'js/main.js'
        ],
        dest: '<%= config.dist %>/js/main.js'
      }
    },
    uglify: {
      options: {banner: '<%= banner %>'},
      dist: {
        src: ['<%= concat.dist.dest %>'],
        dest: '<%= config.dist %>/scripts/<%= pkg.name %>.min.js'
      }
    },
    less: {
      compileTheme: {
        options: {
          strictMath: false,
          sourceMap: true,
          outputSourceFiles: true,
          sourceMapURL: '<%= pkg.name %>.css.map',
          sourceMapFilename: '<%= config.dist %>/css/<%= pkg.name %>.css.map'
        },
        files: {'<%= config.dist %>/styles/<%= pkg.name %>.css': 'less/styles.less'}
      }
    },
    autoprefixer: {
      options: {
        browsers: [
            'Android 2.3',
            'Android >= 4',
            'Chrome >= 20',
            'Firefox >= 24',
            'Explorer >= 8',
            'iOS >= 6',
            'Opera >= 12',
            'Safari >= 6'
        ]
      },
      core: {
        options: {map: true},
        src: '<%= config.dist %>/styles/<%= pkg.name %>.css'
      }
    },
    csslint: {
      options: {csslintrc: 'less/.csslintrc'},
      src: '<%= config.dist %>/css/<%= pkg.name %>.css'
    },
    cssmin: {
        options: {
            compatibility: 'ie8',
            keepSpecialComments: '*',
            advanced: false
        },
        core: { files: { '<%= config.dist %>/styles/<%= pkg.name %>.min.css': '<%= config.dist %>/styles/<%= pkg.name %>.css' } }
    },
    csscomb: {
      sort: {
        options: {config: 'less/.csscomb.json'},
        files: {'<%= config.dist %>/css/<%= pkg.name %>.css': ['dist/css/<%= pkg.name %>.css']}
      }
    },
    criticalcss: {
      frontpage: {
        options: {
          url: 'http://rms.kreativkombinat.de',
          width: 1200,
          height: 900,
          outputfile: '<%= config.dist %>/css/critical.css',
          filename: '<%= pkg.name %>.min.css'
        }
      }
    },
    copy: {
      fontawesome: {
        expand: true,
        flatten: true,
        cwd: 'bower_components/',
        src: ['font-awesome/fonts/*'],
        dest: '<%= config.dist %>/assets/fonts/'
      },
      ico: {
        expand: true,
        flatten: true,
        cwd: 'bower_components/',
        src: ['bootstrap/assets/ico/*'],
        dest: '<%= config.dist %>/assets/ico/'
      },
      favicon: {
        expand: true,
        flatten: true,
        src: ['assets/ico/*'],
        dest: '<%= config.dist %>/assets/ico/'
      },
      distjs: {
        expand: true,
        flatten: true,
        src: ['<%= config.dist %>/js/*'],
        dest: 'assets/scripts/'
      },
      distcss: {
        expand: true,
        flatten: true,
        src: ['<%= config.dist %>/css/*'],
        dest: 'assets/styles/'
      }
    },
    imagemin: {
      png: {
        options: {optimizationLevel: 7},
        files: [{
          expand: true,
          cwd: 'assets/img',
          src: ['**/*.png'],
          dest: '<%= config.dist %>/assets/img/',
          ext: '.png'
        }]
      },
      jpg: {
        options: {progressive: true},
        files: [{
          expand: true,
          cwd: 'assets/img/',
          src: ['**/*.jpg'],
          dest: '<%= config.dist %>/assets/img/',
          ext: '.jpg'
        }]
      }
    },
    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: 'assets/img/',
          src: '{,*/}*.svg',
          dest: '<%= config.dist %>/assets/img/'
        }]
      }
    },
    filerev: {
      options: {
        encoding: 'utf8',
        algorithm: 'md5',
        length: 12
      },
      assets: {
        src: [
            '<%= config.dist %>/js/<%= pkg.name %>.min.js',
            '<%= config.dist %>/css/<%= pkg.name %>.min.css'
        ]
      },
      assetsgh: {
        src: [
            '<%= config.public %>/js/<%= pkg.name %>.min.js',
            '<%= config.public %>/css/<%= pkg.name %>.min.css'
        ]
      },
      files: {
        src: [
            '<%= config.dist %>/assets/img/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
            '<%= config.dist %>/assets/fonts/*'
        ]
      }
    },
    usemin: {
        html: ['<%= config.dist %>/{,*/}*.html'],
        htmlcustom: ['<%= config.dist %>/{,*/}*.html'],
        css: ['<%= config.dist %>/styles/*.css'],
        options: {
            assetsDirs: [
                '<%= config.dist %>',
                '<%= config.dist %>/styles',
                '<%= config.dist %>/assets'
            ],
            patterns: {
                htmlcustom: [
                    [
                        /(?:src=|url\(\s*)['"]?([^'"\)(\?|#)]+)['"]?\s*\)?/gm,
                        'Replacing src references in inline javascript'
                    ],
                    [
                        /(?:loadCSS\(|url\(\s*)['"]?([^'"\)(\?|#)]+)['"]?\s*\)?/gm,
                        'Update the load css source with the new img filenames'
                    ],
                    [
                        /(?:data-src=|url\(\s*)['"]?([^'"\)(\?|#)]+)['"]?\s*\)?/gm,
                        'Update the img data-src attributes with the new img filenames'
                    ]
                ]
            }
        }
    },
    qunit: {
      options: {inject: 'js/tests/unit/phantom.js'},
      files: ['js/tests/*.html']
    },
    jekyll: {
      theme: {options: {config: '_config.yml'}},
      server: {
        options: {
          serve: true,
          server_port: 8000,
          auto: true
        }
      }
    },
    htmlmin: {
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true,
          conservativeCollapse: true,
          removeEmptyAttributes: true,
          removeOptionalTags: true,
          removeRedundantAttributes: true,
          useShortDoctype: true
        },
        files: [{
          expand: true,
          cwd: '<%= config.dev %>',
          src: [
              '*.html',
              '{,*/}*.html'
          ],
          dest: '<%= config.dist %>'
        }]
      }
    },
    replace: {
      dist: {
        options: {
            patterns: [
                    {
                        match: '../assets/',
                        replacement: 'assets/'
                    },
                    {
                        match: '../../assets/',
                        replacement: '../assets/'
                    },
                    {
                        match: '../../<%= config.dist %>/styles/<%= pkg.name %>.min.css',
                        replacement: '../styles/<%= pkg.name %>.min.css'
                    },
                    {
                        match: '../<%= config.dist %>/styles/<%= pkg.name %>.min.css',
                        replacement: 'styles/<%= pkg.name %>.min.css'
                    },
                    {
                        match: '../../<%= config.dist %>/scripts/<%= pkg.name %>.min.js',
                        replacement: '../scripts/<%= pkg.name %>.min.js'
                    },
                    {
                        match: '../<%= config.dist %>/scripts/<%= pkg.name %>.min.js',
                        replacement: 'scripts/<%= pkg.name %>.min.js'
                    }
                ],
                usePrefix: false,
                preserveOrder: true
        },
        files: [{
          expand: true,
          cwd: '<%= config.dev %>',
          src: [
              '*.html',
              '{,*/}*.html'
          ],
          dest: '<%= config.dev %>'
        }]
      }
    },
    clean: {
      dist: {
        files: [{
          dot: true,
          src: ['<%= config.dist %>']
        }]
      },
      revved: {
        files: [{
          dot: true,
          src: [
              '<%= config.dist %>/js/*.min.*.js',
              '<%= config.dist %>/css/*.min.*.css'
          ]
        }]
      },
      assets: {
        files: [{
          dot: true,
          src: ['<%= config.dist %>/assets/*']
        }]
      },
      server: {
        files: [{
          dot: true,
          src: [
              '<%= config.dist %>/*',
              '!<%= config.dist %>/assets'
          ]
        }]
      }
    },
    validation: {
      options: {
        charset: 'utf-8',
        doctype: 'HTML5',
        failHard: true,
        reset: true,
        relaxerror: [
            'Bad value X-UA-Compatible for attribute http-equiv on element meta.',
            'Element img is missing required attribute src.'
        ]
      },
      files: {src: ['<%= config.dev %>/**/*.html']}
    },
    watch: {
      js: {
        files: ['js/{,*/}*.js'],
        tasks: ['newer:jshint:all'],
        options: {livereload: true}
      },
      styles: {
        files: ['<%= config.dev %>/css/{,*/}*.css'],
        tasks: [
            'newer:copy:styles',
            'autoprefixer'
        ]
      },
      less: {
        files: 'less/*.less',
        tasks: ['less'],
        options: {spawn: false}
      },
      gruntfile: {files: ['Gruntfile.js']},
      livereload: {
        options: {livereload: '<%= connect.options.livereload %>'},
        files: [
            '<%= config.dev %>/{,*/}*.html',
            '<%= config.dev %>/{,*/}*.css',
            '<%= config.dev %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },
    connect: {
      options: {
        port: 9000,
        hostname: 'localhost',
        livereload: 35729,
        base: '<%= config.dev %>'
      },
      livereload: {
        options: {
          open: true,
          base: [
              '.tmp',
              '<%= config.dist %>'
          ]
        }
      },
      dist: {options: {base: '<%= config.dist %>'}}
    },
    concurrent: {
      cj: [
          'less',
          'copy',
          'concat',
          'uglify',
      ],
      dev: [
          'less-compile',
          'autoprefixer',
          'csscomb',
          'cssmin',
          'concat',
          'uglify'
      ],
      dist: [
          'jekyll:theme',
          'uglify',
          'csscomb'
      ]
    }
  });
  grunt.registerTask('dist-init', '', function() {
    grunt.file.mkdir('<%= config.dist %>/assets/');
    grunt.file.mkdir('public/');
  });
  grunt.registerTask('serve', function(target) {
    if (target === 'dist') {
      return grunt.task.run([
          'build',
          'connect:dist:keepalive'
      ]);
    }
    grunt.task.run([
        'html',
        'js',
        'css',
        'connect:livereload',
        'watch'
    ]);
  });
  grunt.registerTask('validate-html', [
      'jekyll',
      'validation'
  ]);
  grunt.registerTask('test', [
      'css',
      'jshint',
      'validate-html'
  ]);
  grunt.registerTask('js', [
      'concat',
      'uglify'
  ]);
  grunt.registerTask('less-compile', ['less:compileTheme']);
  grunt.registerTask('css', [
      'less-compile',
      'autoprefixer',
      'csscomb',
      'cssmin'
  ]);
  grunt.registerTask('assets', [
      'newer:copy',
      'newer:imagemin'
  ]);
  grunt.registerTask('cb', [
      'clean:revved',
      'filerev:assets',
      'usemin'
  ]);
  grunt.registerTask('templates', ['jekyll:theme']);
  grunt.registerTask('html', [
      'templates',
      'replace',
      'htmlmin'
  ]);
  grunt.registerTask('html-base', [
      'templates',
      'replace',
  ]);
  grunt.registerTask('dist-cc', [
      'test',
      'concurrent:cj'
  ]);
  grunt.registerTask('dev', [
      'html',
      'css'
  ]);
  grunt.registerTask('dist', [
      'clean:server',
      'css',
      'js',
      'html',
      'cb'
  ]);
  grunt.registerTask('build', [
      'clean:server',
      'css',
      'js',
      'html-base',
      'copy:distjs',
      'copy:distcss'
      // 'cb'
  ]);
  grunt.registerTask('compile-theme', ['dist']);
  grunt.registerTask('default', ['dev']);
};
