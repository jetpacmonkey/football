define([
        'common/js/util',
        'common/js/model'
    ], function(util, Base) {
        function Draft() {
            var self = this;

            self.constructor = Draft;

            Base.apply(self);

            self.checkCurrentDrafter = function() {

            };
        }

        Draft.info = {
            name: 'Draft',
            fields: {
                'name': 'string',
                'owner': 'User',
                'type': 'string',
                'state': 'string',
                'drafters': 'array'
            }
        };

        return Draft;
    }
);
