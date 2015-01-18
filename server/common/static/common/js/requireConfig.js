(function() {
    var STATIC_ROOT = window.STATIC_ROOT || '/static/',
        VENDOR_ROOT = STATIC_ROOT + 'vendor/';
    window.require = {
        'map': {
            'jquery': VENDOR_ROOT + 'jquery/jquery'
        }
    };
})();
