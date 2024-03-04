
export const is_debug = process.env.NODE_ENV === 'development';
export const debug_endpoint = 'localhost:8000';

export const spacecraft = 'spacecraft-it.ru';
export const flagman = 'flagman-climate.ru';
export const gorenerga = 'gorenerga.ru';
export const galaxyHotels = 'galaxy-hotels.ru'
export const schema = 'https';
export const debug_schema = 'http';
export const endpoint_version = 'v1';
export const wss_schema = 'wss';
export const ws_schema = 'ws';

const endpoint = flagman;

export function getURL(urn) {
    return `${is_debug ? debug_schema : schema}://${is_debug ? debug_endpoint : endpoint}/${is_debug ? '' : 'api/'}${urn}`
}

export function getWSSUrl(urn) {
    return `${is_debug ? ws_schema : wss_schema }://${is_debug ? debug_endpoint : endpoint}/${is_debug ? '' : 'ws/'}${urn}`
}

export function getStatic(src) {
    if(!src)
        return ''

    if(src.indexOf('http') !== -1 )
        return src;

    return getURL(`static/${src}`)
}

export function normalizePrice(price) {
    if (!price)
        return;

    if(typeof(price) === 'string')
        price.replace(',', '.');

    price = Math.round(price)
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export const jasettings = {
    apiKey: 'df31916a-c19c-450e-a6b0-bb2e80832a27',
    lang: 'ru_RU',
    coordorder: 'latlong',
    enterprise: false,
    version: '2.1'
}
