define([
        'jquery',
        'common/js/util',
        'common/js/model'
    ], function($, util, Base) {
        function Draft() {
            var self = this;

            self.constructor = Draft;

            Base.apply(self);

            self.checkCurrentDrafter = function() {

            };

            self.addDrafter = function(drafterId) {
                return self.ajax({
                    'url': '/api/' + self.getInfo().plural + '/' + self.getId() + '/add_drafter/',
                    'type': 'POST',
                    'data': JSON.stringify({
                        'user': drafterId
                    })
                })
                    .then(function(response) {
                        self.fromJSON(response);
                        return self;
                    });
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
            },
        };

        return Draft;
    }
);
