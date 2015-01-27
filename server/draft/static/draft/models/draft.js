define([
        'common/js/util',
        'common/js/model'
    ], function(util, Base) {
        function Draft() {
            var self = this;

            Base.apply(self);

            self.constructor = Draft;

            util.configFields(self, {
                'name': 'string',
                'owner': 'User',
                'type': 'string',
                'state': 'string',
                'drafters': 'array'
            });
        }

        Draft.info = {
            name: 'Draft'
        };

        return Draft;
    }
);
