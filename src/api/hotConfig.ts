const baseUrl = process.env.BASE_HOST || '';
const opsWebUrl = `${process.env.BASE_HOST}/easyhome-ops-web-application`;
// const topicUrl = process.env.SERVE_ENV === 'production' ? 'https://topic.jrdaimao.com' : 'https://topicdev.jrdaimao.com';
const topicUrl = process.env.TOPIC_URL; //'http://127.0.0.1:3301' ;
export const isProduction = process.env.SERVE_ENV === 'production';
export const isGray = process.env.SERVE_ENV === 'gray';
export const env_version = isProduction ? 'release' : 'trial';

const isLocal = process.env.NODE_ENV === 'development';
export const ossUrl = isProduction || isGray ? 'https://ossprod.jrdaimao.com/' : 'https://osstest.jrdaimao.com/';
export { baseUrl, opsWebUrl, topicUrl, isLocal };

export const BUCKET = isProduction || isGray ? 'juranapp-prod' : 'juranapp-test';
export const env = process.env.SERVE_ENV;
