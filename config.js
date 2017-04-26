const environment = {
    development: {
        isProduction: false
    },
    production: {
        isProduction: true
    }
}[process.env.NODE_ENV || 'development'];

module.exports = Object.assign({

    host:       process.env.HOST || 'localhost',
    port:       process.env.PORT,
    apiHost:    process.env.APIHOST || '127.0.0.1',
    apiPort:    process.env.APIPORT,

    app: {
        title: 'Assets',
        description: 'Collaborate internally and with the client\'s team.',
        head: {
            titleTemplate: 'Assets: %s',
            meta: [
                {name: 'description', content: 'Collaborate internally and with the client\'s team.'},
                {charset: 'utf-8'},
                {property: 'og:site_name', content: 'Assets'},
                {property: 'og:image', content: 'https://alexthegoodman.com/logo.jpg'},
                {property: 'og:locale', content: 'en_US'},
                {property: 'og:title', content: 'Assets'},
                {property: 'og:description', content: 'Collaborate internally and with the client\'s team.'},
                {property: 'og:card', content: 'summary'},
                {property: 'og:site', content: '@alexthegoodman'},
                {property: 'og:creator', content: '@alexthegoodman'},
                {property: 'og:image:width', content: '200'},
                {property: 'og:image:height', content: '200'}
            ]
        }
    },

}, environment);