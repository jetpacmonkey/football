var require = (function() {
    var STATIC_ROOT = window.STATIC_ROOT || '/static/',
        VENDOR_ROOT = STATIC_ROOT + 'vendor/';
    return {
        'paths': {
            'jquery': VENDOR_ROOT + 'jquery/jquery',
            'lodash': VENDOR_ROOT + 'lodash/lodash',
            'knockout': VENDOR_ROOT + 'knockout/knockout',

            'common': STATIC_ROOT + 'common',
            'draft': STATIC_ROOT + 'draft'
        }
    };
})();
