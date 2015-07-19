var gulp =  require('gulp'),
    g =     require('gulp-load-plugins')();

/**
 * Dev tasks
 * */
gulp.task('dev-inject', function () {
  var sources = gulp.src(['src/**/jquery-*.js', 'src/**/vendor/**/*.js', 'src/**/app.js', 
                          'src/**/vendor/**/*.css', 'src/**/app.css'], { base: 'src', read: false });
  
  gulp.src('src/index.inject.html')
      .pipe(g.inject(sources, { relative: true }))
      .pipe(g.rename('index.html'))
      .pipe(gulp.dest('src'));
});

gulp.task('dev', ['dev-inject'], function () {
  console.log('Dev is up to date');
});

/**
 * Build tasks
 * */
// Clean directory
gulp.task('clean', function () {
  return  gulp.src('build', { read: false })
              .pipe(g.clean());
});

// Copy static files
gulp.task('static', ['clean'], function () {
  return  gulp.src(['src/**/*', '!src/js/**/*', '!src/js', '!src/css/**/*', '!src/css', '!src/index*.html'], { base: 'src' })
              .pipe(gulp.dest('build'));
});

// Create style.min.css
gulp.task('css', ['clean'], function () {
  return  gulp.src(['src/css/vendor/*.css', 'src/css/app.css'])
              .pipe(g.plumber())
              //.pipe(g.size({ showFiles: true }))
              .pipe(g.sourcemaps.init())
              .pipe(g.autoprefixer())
              .pipe(g.minifyCss())
              .pipe(g.concat('style.min.css'))
              .pipe(g.sourcemaps.write('.'))
              .pipe(gulp.dest('build/css/'))
              //.pipe(g.size({ showFiles: true }));
});

// Create app.min.js
gulp.task('js', ['clean'], function () {
  return  gulp.src(['src/js/vendor/jquery/*.js', 'src/js/vendor/magnific-popup/*.js', 'src/js/app.js'])
              .pipe(g.plumber())
              //.pipe(g.size({ showFiles: true }))
              .pipe(g.sourcemaps.init())
              .pipe(g.uglify())
              .pipe(g.concat('app.min.js'))
              .pipe(g.sourcemaps.write('.'))
              .pipe(gulp.dest('build/js/'))
              //.pipe(g.size({ showFiles: true }));
});

// Inject js and css files
gulp.task('build-inject', ['clean', 'js', 'css'], function () {
  var sources = gulp.src(['build/**/*.js', 'build/**/*.css'], { base: 'build', read: false });
  
  return  gulp.src('src/index.inject.html')
              .pipe(g.rename('index.html'))
              .pipe(gulp.dest('build'))
              .pipe(g.inject(sources, { relative: true }))
              .pipe(gulp.dest('build'));
});

// Build project
gulp.task('build', ['static', 'build-inject'], function () {
  console.log('Built project');
});

/**
 * Dev and build tasks
 * */
gulp.task('default', ['dev', 'build']);