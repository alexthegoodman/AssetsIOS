var gulp = require('gulp');
var sass = require('gulp-sass');
var reactNativeStylesheetCss = require('gulp-react-native-stylesheet-css');

gulp.task('styles', function() {
    gulp.src('app/sass/style.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(reactNativeStylesheetCss())
        .pipe(gulp.dest('./app/css/'))
});

//Watch task
gulp.task('default',function() {
    gulp.watch('app/sass/**/*.scss',['styles']);
});