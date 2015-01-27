define(['lodash'], function(_) {
    var decapitalize = function() {
        return this.charAt(0).toLowerCase() + this.substr(1);
    };

    String.prototype.decapitalize = decapitalize;

    var capitalize = function() {
        return this.charAt(0).toUpperCase() + this.substr(1);
    };

    String.prototype.capitalize = capitalize;

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
            C['get' + key.capitalize()] = function() {
                return vals[key];
            }
            C['set' + key.capitalize()] = function(v) {
                var translated = (translators[type] || translators.default)(v);
                vals[key] = translated;
            }
        });
    };

    return {
        decapitalize: function(s) {
            return decapitalize.call(s);
        },
        capitalize: function(s) {
            return capitalize.call(s);
        },
        configFields: configFields
    };
});
