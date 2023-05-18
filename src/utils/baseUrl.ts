const baseURL ='https://gateway.sit.jrdaimao.com'+"/easyhome-ops-web-application";
const isProduction = process.env.SERVE_ENV === 'production' || process.env.SERVE_ENV === 'gray';
export const SENSOR_URL = isProduction ? 'https://ds.jrdaimao.com/sa?project=production' : 'https://ds.jrdaimao.com/sa?project=default';
export default baseURL;
