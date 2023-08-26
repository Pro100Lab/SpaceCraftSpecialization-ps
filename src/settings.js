
export const is_debug = process.env.NODE_ENV === 'development';
export const debug_endpoint = '25.52.44.61:8000';
export const endpoint = 'galaxy-hotels.ru';
export const schema = 'https';
export const debug_schema = 'http';
export const endpoint_version = 'v1';

export function getURL(urn) {
    if(urn[0] === '/') {
        urn = urn.substring(1);
    }
    return `${is_debug ? debug_schema : schema}://${is_debug ? debug_endpoint : endpoint}/${is_debug ? '' : 'api/'}${urn}`
}


export function normalizePrice(price) {
    if (!price)
        return;
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}
