define([
        'lodash',
        'jquery',
        'knockout'
    ], function(_, $, ko) {
    var decapitalize = function() {
        return this.charAt(0).toLowerCase() + this.substr(1);
    };

    String.prototype.decapitalize = decapitalize;

    var capitalize = function() {
        return this.charAt(0).toUpperCase() + this.substr(1);
    };

    String.prototype.capitalize = capitalize;

    var toCamel = function(s){
        return s.replace(/([-_][a-z])/g, function($1){return $1.toUpperCase().replace(/[-_]/g,'');});
    };

    var translators = {
        'default': _.identity,
        'string': function(v) {
            return v.toString();
        },
        'number': function(v) {
            return +v;
        },
        'int': function(v) {
            return Math.round(v);
        }
    };
    var configFields = function(C, config) {
        var vals = C._vals = {};
        _.forIn(config, function(type, key) {
            vals[key] = ko.observable();
            C['get' + toCamel(key.capitalize())] = function() {
                return vals[key]();
            };
            C['set' + toCamel(key.capitalize())] = function(v) {
                var translated = (translators[type] || translators.default)(v);
                vals[key](translated);
            };
        });
    };

    var getCookie = function(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = $.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    };

    return {
        decapitalize: function(s) {
            return decapitalize.call(s);
        },
        capitalize: function(s) {
            return capitalize.call(s);
        },
        toCamel: toCamel,
        configFields: configFields,
        getCookie: getCookie
    };
});
