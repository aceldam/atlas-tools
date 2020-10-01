// Less configuration
var gulp = require('gulp');
var less = require('gulp-less');
var ts = require('gulp-typescript');

gulp.task('less', function() {
    gulp.src('app/**/*.less')
        .pipe(less())
        .pipe(gulp.dest(function(f) {
            return f.base;
        }))
});

gulp.task('ts', function() {
    var tsProject = ts.createProject("tsconfig.json");

    var buildError = false;

    return gulp.src(["app/**/*.ts"])
        .pipe(tsProject())
        .on('error', function () { buildError = true; })
        .on('finish', function () { if (buildError) process.exit(1); })
        .js.pipe(gulp.dest(function(f) {
            return f.base;
        }));

});

gulp.task('default', ['less', 'ts'], function() {
    gulp.watch('app/**/*.less', ['less']);
    gulp.watch('app/**/*.ts', ['ts']);
})