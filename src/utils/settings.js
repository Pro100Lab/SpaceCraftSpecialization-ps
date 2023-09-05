
export const is_debug = process.env.NODE_ENV === 'development';
export const debug_endpoint = '192.168.1.103:8000';
export const endpoint = 'spacecraft-it.ru';
export const schema = 'https';
export const debug_schema = 'http';
export const endpoint_version = 'v1';

export function getURL(urn) {
    return `${is_debug ? debug_schema : schema}://${is_debug ? debug_endpoint : endpoint}/${is_debug ? '' : 'api/'}${urn}`
}

export function normalizePrice(price) {
    if (!price)
        return;
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export const jasettings = {
    apiKey: 'df31916a-c19c-450e-a6b0-bb2e80832a27',
    lang: 'ru_RU',
    coordorder: 'latlong',
    enterprise: false,
    version: '2.1'
}
