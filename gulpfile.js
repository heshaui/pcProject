//引入gulp
const gulp = require('gulp');
//自动加载插件,能自动加载package.json里的插件，省去繁琐的定义
const plugins = require('gulp-load-plugins')();
//定义pug、sass、es6及导出的路径
const pugPath = './moulds/pug/';
const sassPath = './moulds/sass/';
const es6Path = './moulds/es6/';
const destPath = './pages/';

/*-----------------解析文件--------------------*/
/**
 * 将pug解析成html文件
 */
gulp.task('pug',()=>{
    return gulp.src(pugPath+'**/*.pug')
        .pipe(plugins.pug({pretty : true,verbose:true}))
        .pipe(gulp.dest(destPath));
});

/**
 * 将sass解析成css文件
 */
gulp.task('sass',()=>{
    return gulp.src(sassPath+'**/*.scss')
        .pipe(plugins.sass().on('error', plugins.sass.logError))
        .pipe(gulp.dest(destPath));
});

/**
 * 将ES6解析成ES5文件
 */
gulp.task('es6',()=>{
    return gulp.src(es6Path+'**/*.js')
        .pipe(plugins.babel())
        .pipe(gulp.dest(destPath));
});

/*-----------------压缩--------------------*/
/**
 * 压缩html
 */
gulp.task('minHtml',()=>{
	let options = {
        removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        collapseBooleanAttributes: false,//省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: false,//删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
    };
	return gulp.src(destPath+'**/*.html')
		.pipe(plugins.minifyHtml())
		.pipe(gulp.dest(destPath));
});

/**
 * 压缩css
 */
gulp.task('minifyCSS',()=>{
    return gulp.src(destPath+'**/*.css')
        .pipe(plugins.cleanCss())
        .pipe(gulp.dest(destPath));
});

/**
 * 压缩js
 */
gulp.task('uglifyJs',()=>{
    return gulp.src(destPath+'**/*.js')
        .pipe(plugins.uglify())
        .pipe(gulp.dest(destPath));
});
//压缩入口
gulp.task('compress',gulp.parallel('minHtml','minifyCSS','uglifyJs'));
/*-----------------监听--------------------*/
/**
 * 监听pug
 */
gulp.task('watchPug',()=>{
    return gulp.src(pugPath+'**/*.pug')
        .pipe(plugins.watch(pugPath+'**/*.pug'))
        .pipe(plugins.pug({pretty : true}))
        .pipe(gulp.dest(destPath));
});

/**
 * 监听sass
 */
gulp.task('watchSass',()=>{
    return gulp.src(sassPath+'**/*.scss')
        .pipe(plugins.watch(sassPath+'**/*.scss'))
        .pipe(plugins.sass().on('error', plugins.sass.logError))
        .pipe(gulp.dest(destPath));
});

/**
 * 监听es6
 */
gulp.task('watchEs6',()=>{
    return gulp.src(es6Path+'**/*.js')
        .pipe(plugins.watch(es6Path+'**/*.js'))
        .pipe(plugins.babel())
        .pipe(gulp.dest(destPath));
});
//监听入口
gulp.task('watch',gulp.parallel('watchPug','watchSass','watchEs6'));

//总入口
gulp.task('default',gulp.parallel('pug','sass','es6','watch'));