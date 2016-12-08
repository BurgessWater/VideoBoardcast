import gulp from 'gulp';
import sassLint from 'gulp-sass-lint';
// import sourcemaps from 'gulp-sourcemaps';
// import sass from 'gulp-sass';
// import notify from 'gulp-notify';
// import autoprefixer from 'gulp-autoprefixer';
// import cleanCSS from 'gulp-clean-css';
// import zip from 'gulp-zip';
// import fs from 'fs';
// import del from 'del';

// scss文件路径
// const scssPath = 'src/css/scss/*.scss';
//
// function formatDate() {
//   let d = new Date();
//   return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
// }
//
// // 清除 dist 目录
// export const clean = () => del(['dist']);
//
// // 编译scss文件
// export function sassCompile() {
//   return gulp.src(scssPath)
//     .pipe(sourcemaps.init())
//     .pipe(sass({ outputStyle: 'expanded' }).on('error', notify.onError({
//       message: 'Error: <%= error.message %>',
//       title: 'Sass Error'
//     })))
//     .pipe(autoprefixer({
//       browsers: ['last 2 versions', 'IE >= 8'],
//       cascade: false
//     }))
//     .pipe(sourcemaps.write({ includeContent: false, sourceRoot: null }))
//     .pipe(gulp.dest('./src/css/'));
// }
//
// // 发布功能类
// class Dist {
//   // 压缩 dist 目录至 zip 文件
//   static zip() {
//     const p = JSON.parse(fs.readFileSync('./package.json'));
//     const name = `${p.cname || p.name}_${formatDate()}_v${p.version}.zip`;
//     return gulp.src('./dist/**/*')
//       .pipe(zip(name))
//       .pipe(gulp.dest('./package/'));
//   }
//
//   // 复制 html 文件
//   static html() {
//     return gulp.src('*.html')
//       .pipe(gulp.dest('./dist/'));
//   }
//
//   // 复制图片文件
//   static images() {
//     return gulp.src('./src/images/*.*')
//       .pipe(gulp.dest('./dist/images/'));
//   }
//
//   // 编译 scss 文件
//   static sass() {
//     return gulp.src(scssPath)
//       .pipe(sass())
//       .pipe(autoprefixer({
//         browsers: ['last 2 versions', 'IE >= 8'],
//         cascade: false
//       }))
//       .pipe(cleanCSS({ compatibility: 'ie8' }))
//       .pipe(gulp.dest('./dist/css/'));
//   }
// }
const path = 'src/**/*.scss';
export function sasslint() {
  return gulp.src(path)
    .pipe(sassLint())
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError());
}

// 监视 scss 目录下所有scss文件，一旦变化则编译
export function watch() {
  gulp.watch(path, gulp.parallel([sassLint]));
}
//
// // 打包，先清除dist目录->编译scss->复制html->复制图片->压缩dist目录
// export const dist = gulp.series(clean, [
//   gulp.parallel([Dist.sass, Dist.html, Dist.images]), Dist.zip,
// ]);

