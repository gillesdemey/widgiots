var gulp = require('gulp'),
  connect = require('gulp-connect');

gulp.task('connect', function () {
  connect.server({ livereload: true, port: 9000 });
});

gulp.task('html', function () {
  gulp.src('./*.html')
    .pipe(connect.reload());
});

gulp.task('watch', function () {
  gulp.watch(['./app/*.html'], ['html']);
});

gulp.task('default', ['connect', 'watch']);