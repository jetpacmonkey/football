define([
        'jquery',
        'lodash',
        'knockout',
        'common/js/util'
    ], function(
        $,
        _,
        ko,
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
                var info = _.assign({}, self.constructor.info);
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
                return _.mapValues(self._vals, ko.unwrap);
            };

            self.ajax = function(opts) {
                return $.ajax(_.assign({}, {
                    'type': 'GET',
                    'contentType': 'application/json',
                    'dataType': 'json',
                    'headers': {
                        'X-CSRFToken': util.getCookie('csrftoken')
                    }
                }, opts));
            };

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

            self.create = function(config) {
                var self = this;

                config = $.extend({
                    'url': API_ROOT + self.getInfo().plural + '/'
                }, config);

                return self.ajax({
                    'url': config.url,
                    'type': 'POST',
                    'data': JSON.stringify(self.toJSON()),
                })
                    .then(function(response) {
                        self.fromJSON(response);
                        return self;
                    });
            };
        }

        return BaseModel;
    }
);
