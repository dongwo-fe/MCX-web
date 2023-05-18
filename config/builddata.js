/**
 * 打包编译环境下的参数
 */
const dayjs = require('dayjs');
const moment = require('moment');

const { SERVE_ENV = '' } = process.env;
// 是否开发环境
const isDev = !SERVE_ENV;
// 是否生成环境
const isProduction = SERVE_ENV === 'production' || SERVE_ENV === 'gray';
// 是否测试环境
const isTest = !isDev && !isProduction;

//打包的版本号--时间日期
const build_version = moment().format('YYYYMMDDHHmm');
//打包的项目名称，CDN使用
let project_name = 'topic_web';
if (isTest) {
    project_name += '-' + SERVE_ENV;
}
//打包输出的文件相对路径
let outPath = 'dist';
if (!isDev) {
    outPath = `dist/${project_name}/${build_version}`;
}

//CDN前缀
let publicPath = '/';

if (isProduction) {
    publicPath = `https://static.jrdaimao.com/${project_name}/${build_version}/`;
}
if (isTest) {
    publicPath = `https://staticsit.jrdaimao.com/${project_name}/${build_version}/`;
}

console.log('项目名称', project_name);
console.log('版本号', build_version);

module.exports = {
    build_version,
    project_name,
    isDev,
    isTest,
    isProduction,
    outPath,
    publicPath,
};
