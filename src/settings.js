
export const is_debug = true;
export const endpoint = '85.193.83.131:8000';
export const schema = 'http';
export const endpoint_version = 'v1';

export function getURL(urn) {
    return `${schema}://${endpoint}/${urn}`
}

export function normalizePrice(price) {
    if (!price)
        return;
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}
