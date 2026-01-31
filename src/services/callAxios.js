import axios from 'axios';

async function httpGet(url, params) {
    return await axios.get(url, { params: params });
}

async function httpPost(url, data) {
    return await axios.post(url, data);
}

async function httpDelete(url, data) {
    return await axios.delete(url, data);
}

export {
    httpGet, httpPost, httpDelete
}