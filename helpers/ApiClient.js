import superagent     from 'superagent';
import config         from '../config';
const DeviceInfo      = require('react-native-device-info');

//const methods = ['get', 'post', 'put', 'patch', 'del'];

// get endpoint in proper format
function formatUrl(path) {

    let pathBase = '';
    //if (DeviceInfo.isEmulator()) {
       //pathBase = 'http://127.0.0.1:3030';
    //} else {
        pathBase = 'https://assetsbeta.herokuapp.com/api';
    //}
    
    const adjustedPath = path[0] !== '/' ? '/' + path : path;
    
    return pathBase + adjustedPath;

}

export default class ApiClient {

    // constructor(req) {
    //     methods.forEach((method) =>
    //         this[method] = (path, { params, data } = {}) => new Promise((resolve, reject) => {
                
    //             // superagent is a nice HTTP request / AJAX library
    //             // replace with Fetch API down the line?
    //             const request = superagent[method](formatUrl(path));

    //             if (params && Object.keys(params).length > 0) {
    //                 request.query(params);
    //             }

    //             // if (__SERVER__ && req.get('cookie')) {
    //             //     request.set('cookie', req.get('cookie'));
    //             // }

    //             console.info(formatUrl(path), data, params);

    //             if (data) {
    //                 // send technically only attaches data to request
    //                 request.send(data);
    //             }

    //             // end() technically sends the request, w/callback
    //             // Promise API either "rejects" or "resolves" the promise
    //             request.end((err, { body } = {}) => err ? reject(body || err) : resolve(body));
    //         })
    //     );
    // }

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
