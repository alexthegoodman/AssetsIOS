import superagent     from 'superagent';
import config         from '../config';
const DeviceInfo      = require('react-native-device-info');

//const methods = ['get', 'post', 'put', 'patch', 'del'];

// get endpoint in proper format
function formatUrl(path) {

    let pathBase = '';
    if (DeviceInfo.isEmulator()) {
       pathBase = 'http://127.0.0.1:3030';
    } else {
        pathBase = 'https://assetsbeta.herokuapp.com/api';
    }
    
    const adjustedPath = path[0] !== '/' ? '/' + path : path;
    
    return pathBase + adjustedPath;

}

export default class ApiClient {
    
    constructor() {}

    get(endpoint, params, method = 'GET') {

        let newHeaders = new Headers();
        newHeaders.append('Content-Type', 'application/json');

        let sendParams = '', fetchParams;
        if (method == 'GET') {
            sendParams += '?';
            for (let key in params) {
                sendParams += key + '=' + params[key] + '&';
            }
            fetchParams = { method: method };
        } else if (method == 'POST') {
            fetchParams = { 
                method: method,
                body: JSON.stringify(params),
                headers: newHeaders
            };
        }

        let fullUrl = formatUrl(endpoint) + sendParams;

        console.info('fetch', method, fullUrl);

        return fetch(fullUrl, fetchParams).then((data) => {

            if (!data.ok || data.status == 414) {
                console.error('Fetch error', data.status);
            }

            let jsonData = data.json();
            return jsonData;
        });

    }

}
