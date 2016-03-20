'use strict';

import gulp           from 'gulp';
import del            from 'del';
import mainBowerFiles from 'main-bower-files';
import gulpFilter     from 'gulp-filter';
import runSequence    from 'run-sequence';
import fs             from 'fs';
import jade           from 'gulp-jade';
import prettify       from 'gulp-prettify';
import posthtml       from 'gulp-posthtml';
import sass           from 'gulp-sass';
import csso           from 'gulp-csso';
import perfectionist  from 'perfectionist';
import postcss        from 'gulp-postcss';
import pxtorem        from 'postcss-pxtorem';
import selector       from 'postcss-custom-selectors';
import mqpacker       from "css-mqpacker";
import autoprefixer   from 'autoprefixer';
import bulkSass       from 'gulp-sass-glob-import';
import babel          from 'gulp-babel';
import uglify         from 'gulp-uglify';
import concat         from 'gulp-concat';
import imagemin       from 'gulp-imagemin';
import browserSync    from 'browser-sync';

let postCSSFocus = function (css) {
    css.walkRules(function (rule) {
        if (rule.selector.indexOf(':hover') !== -1) {
            var focuses = [];
            rule.selectors.forEach(function (selector) {
                if (selector.indexOf(':hover') !== -1) {
                    focuses.push(selector.replace(/:hover/g, ':focus'));
                }
            });
            if (focuses.length) {
                rule.selectors = rule.selectors.concat(focuses);
            }
        }

        if (rule.selector.indexOf(':only-hover') !== -1) {
            var hovered = [];
            rule.selectors.forEach(function (selector) {
                if (selector.indexOf(':only-hover') !== -1) {
                    hovered.push(selector.replace(/:only-hover/g, ':hover'));
                }
            })
            if (hovered.length) {
                rule.selectors = hovered;
            }
        }
    })
}

let PROCESSORS = [
    pxtorem({
        root_value: 14,
        selector_black_list: ['html']
    }),
    autoprefixer({ browsers: ['last 2 versions', '> 1%'] }),
    mqpacker,
    selector,
    postCSSFocus
]

let BOWER_MAIN_FILES_CONFIG = {
    includeDev: true,
    paths:{
        bowerDirectory: './assets/bower',
        bowerJson: './bower.json'
    }
}

let reload = browserSync.reload;

gulp.task('imagemin_clear', () => {
    return del(['app/img/']);
})

gulp.task('imagemin_build', () => {
    return gulp.src('./assets/images/**')
        .pipe(imagemin({progressive: true}))
        .pipe(gulp.dest('app/img/'));
})

gulp.task('imagemin', () => {
    runSequence('imagemin_clear', 'imagemin_build');
})

gulp.task('browserSync', () => {
    browserSync({
        server: {
            baseDir: "./app/"
        },
        open: false
    })
})

gulp.task('jade', () => {
    var data = JSON.parse(fs.readFileSync('./assets/data/data.json', 'utf-8'));

    return gulp.src('./assets/pages/!(_)*.jade')
        .pipe(jade({
            locals: data
        }))
        .pipe(posthtml([
            require('posthtml-bem')({
                elemPrefix: '__',
                modPrefix: '_',
                modDlmtr: '--'
            })
        ]))
        .pipe(prettify({indent_size: 4}))
        .on('error', console.log)
        .pipe(gulp.dest('./app/'))
        .on('end', browserSync.reload)
})

gulp.task('jadeComponents', () => {
    var data = JSON.parse(fs.readFileSync('./assets/data/data.json', 'utf-8'));

    return gulp.src('./assets/components/**/!(_)*.jade')
        .pipe(jade({
            locals: data
        }))
        .pipe(posthtml([
            require('posthtml-bem')({
                elemPrefix: '__',
                modPrefix: '_',
                modDlmtr: '--'
            })
        ]))
        .pipe(prettify({indent_size: 4}))
        .on('error', console.log)
        .pipe(gulp.dest('./app/components'))
        .on('end', browserSync.reload)
})

gulp.task('bootstrap', () => {
    return gulp.src(['./assets/bootstrap/**/*.scss'])

        .pipe(sass({
            includePaths: ['assets/bower/bootstrap-sass/assets/stylesheets/']
        }).on('error', sass.logError))

        .pipe(postcss(PROCESSORS))
        .pipe(csso())
        .pipe(gulp.dest('./app/css'))
        .pipe(reload({stream: true}))
})

gulp.task('scss', () => {
    return gulp.src(['assets/scss/**/style.scss'])
        .pipe(bulkSass())
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss(PROCESSORS))
        .pipe(csso())
        .pipe(postcss([perfectionist({})]))
        .pipe(gulp.dest('./app/css'))
        .pipe(reload({stream: true}))
})

gulp.task('babel', () => {
    return gulp.src(['./assets/script/**/*.js'])
        .pipe(babel({
            comments: false,
            presets: ['es2015']
        }))
        .pipe(concat('main.js'))
        // .pipe(uglify({mangle: false}))
        .pipe(gulp.dest('./app/js/'))
        .on('end', browserSync.reload)
})

gulp.task('copyMiscFiles', () => {
    return gulp.src(['assets/misc/**'])
        .pipe(gulp.dest('app/'))
})

gulp.task('copyLibsFiles', () => {
    return gulp.src(['assets/lib/**'])
        .pipe(uglify())
        .pipe(gulp.dest('app/js'))
})

gulp.task('copyFontFiles', () => {
    return gulp.src(['assets/font/**'])
        .pipe(gulp.dest('app/font'))
})

gulp.task('buildBowerCSS', () => {
    var cssFilter = gulpFilter('**/*.css')
    return gulp.src(mainBowerFiles(BOWER_MAIN_FILES_CONFIG))
        .pipe(cssFilter)
        .pipe(csso())
        .pipe(postcss([perfectionist({})]))
        .pipe(gulp.dest('app/css'))
})

gulp.task('buildBowerJS', () => {
    var jsFilter = gulpFilter('**/*.js')
    return gulp.src(mainBowerFiles(BOWER_MAIN_FILES_CONFIG))
        .pipe(jsFilter)
        .pipe(uglify())
        .pipe(gulp.dest('app/js'))
})

gulp.task('watch', () => {
    gulp.watch('assets/scss/**/*.scss', ['scss']);
    gulp.watch('assets/components/**/*.scss', ['scss']);

    gulp.watch('assets/bootstrap/**/*.scss', ['bootstrap']);

    gulp.watch('assets/script/**/*.js', ['babel']);
    gulp.watch('assets/images/**', ['imagemin']);

    gulp.watch('assets/components/**/*.jade', ['jadeComponents']);

    gulp.watch('assets/pages/**/*.jade', ['jade']);
    gulp.watch('assets/json/**/*.json', ['jade']);

    gulp.watch('assets/misc/**', ['static']);
    gulp.watch('assets/libs/**', ['static']);
    gulp.watch('assets/font/**', ['static']);
})

gulp.task('default', () =>{
    runSequence('browserSync', 'watch');
})
