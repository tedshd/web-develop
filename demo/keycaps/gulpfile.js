/**
 *
 * @authors Ted Shiu (tedshd@gmail.com)
 * @date    2015-11-16 02:18:01
 * @version $Id$
 */

var gulp = require('gulp');
var cssnext = require("gulp-cssnext");

gulp.task('default', ['css', 'watch']);

gulp.task('watch', function() {
    gulp.watch(['./dev/**'], ['css']);
});

gulp.task("css", function() {
  gulp.src("dev/*.css")
    .pipe(cssnext({
        compress: true
    }))
    .pipe(gulp.dest("./css/"));
});

