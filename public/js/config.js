require.config({
    baseUrl: '/js',

    paths: {
        jquery: ['http://apps.bdimg.com/libs/jquery/1.11.3/jquery.min','jquery-1.11.3.min'],
        zepto: ['zepto.min'],
        underscore: ['http://apps.bdimg.com/libs/underscore.js/1.7.0/underscore-min','underscore.min']
    },

    shim: {
        "zepto": {
            exports: "$"
        },
        "underscore": {
            exports: "_"
        }
    }
});
