define([
        'jquery',
        'lodash',
        'common/js/util'
    ], function(
        $,
        _,
        util
    ) {
        var API_ROOT = '/api/';

        function BaseModel() {
            var self = this;

            self.constructor = self.constructor || BaseModel;

            util.configFields(self, _.assign({}, self.constructor.info.fields, {
                'id': 'int'
            }));

            self.getInfo = function() {
                var info = $.extend({}, self.constructor.info);
                info.plural = info.plural || (info.name.decapitalize() + 's');
                return info;
            };

            self.fromJSON = function(json) {
                _.forIn(json, function(val, key) {
                    if (_.isFunction(self['set' + util.toCamel(key.capitalize())])) {
                        self['set' + util.toCamel(key.capitalize())](val);
                    } else if (_.isFunction(self['get' + key.capitalize()])) {
                        console.warn('No setter found for field', key);
                    } else {
                        console.warn('Not using getter/setter for field', key);
                        if (key !== 'info') {
                            self[key] = val;
                        }
                    }
                });
            };

            self.toJSON = function() {
                return self._vals;
            }

            self.fetch = function fetch(id, config) {
                config = $.extend({
                    url: API_ROOT + self.getInfo().plural + '/' + id + '/'
                }, config);

                return $.getJSON(config.url, function(response) {
                    self.fromJSON(response);
                });
            };

            self.getList = function(config) {
                config = $.extend({
                    url: API_ROOT + self.getInfo().plural + '/'
                }, config);

                return $.getJSON(config.url)
                    .then(function(response) {
                        return _.map(response, function(item) {
                            obj = new self.constructor();
                            obj.fromJSON(item);
                            return obj;
                        });
                    });
            };
        }

        return BaseModel;
    }
);
