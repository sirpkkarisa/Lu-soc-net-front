const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const changed = require('gulp-changed');
const autoprefixer = require('gulp-autoprefixer');
const reload = browserSync.reload;
// const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const imagemin = require('gulp-imagemin');
const uglify = require('gulp-uglify');
const lineec = require('gulp-line-ending-corrector');


const scss = 'scss/';
const js = 'src/js/';
const jsdist = 'dist/js/';
const stylewatchFiles = scss+'**/*.scss';

const jsSRC = [
    js+'scripts.js',
    js+'file2.js'
];

const cssSRC = [
    'src/css/test.css',
    'src/css/file2.css'
]

const imgSRC = './src/images/*';
const imgDEST = 'dist/images';

// function css() {
//     return gulp.src([scss+'style.scss'])
//         .pipe(sourcemaps.init({loadMaps:true}))
//         .pipe(sass({
//             outputStyle: 'expanded'
//         }).on('error', sass.logError))
//         .pipe(autoprefixer('last 2 versions'))
//         .pipe(sourcemaps.write())
//         .pipe(lineec())
//         .pipe(gulp.dest('dist/'));
// }
function concatCSS(){
    return gulp.src(cssSRC)
        // .pipe(sourcemaps.init({loadMaps:true, largFile:true}))
        .pipe(concat('style.css'))
        .pipe(cleanCSS())
        .pipe(lineec())
        .pipe(gulp.dest('dist/'))
}

function javascript() {
    return gulp.src(jsSRC)
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(lineec())
        .pipe(gulp.dest(jsdist))
}

function imgmin() {
    return gulp.src(imgSRC)
        .pipe(changed(imgDEST))
        .pipe(imagemin([
            imagemin.gifsicle({interlaced:true}),
            // imagemin.jpegtran({progressive: true}),
            imagemin.optipng({optimizationLevel: 5})
        ]))
        .pipe(gulp.dest(imgDEST))
}

function watch() {
    browserSync.init({
        // open: 'external',
        // proxy:'http://localhost',
        // port: 1212,
        server: {
            baseDir: './'
        }
    });
    gulp.watch(cssSRC,concatCSS);
    gulp.watch(jsSRC, javascript);
    gulp.watch(imgSRC, imgmin);
    gulp.watch(['./*.html','./src/css/*.css','./src/js/*.js']).on('change',browserSync.reload);

}

// exports.css = css;
exports.concatCSS = concatCSS;
exports.javascript = javascript;
exports.watch = watch;
exports.imgmin = imgmin;

const build = gulp.parallel(watch);
gulp.task('default', build)
// gulp.task('default', gulp.series(css,concatCSS, javascript,watch,imgmin))














// function style() {
//     return gulp.src('./scss/**/*.scss')
//     .pipe(sass())
//     .pipe(gulp.dest('./css'))
//     .pipe(browserSync.stream())
// }

// function watch() {
//     browserSync.init({
//         server: {
//             baseDir: './'
//         }
//     });
//     gulp.watch('./scss/**/*.css', style);
//     gulp.watch('./*.html').on('change',browserSync.reload);
//     gulp.watch('./js/**/*.js').on('change',browserSync.reload)
// }
// exports.style = style;
// exports.watch = watch;