define([
        'jquery',
        'common/js/util',
        'common/js/model'
    ], function($, util, Base) {
        function Draft() {
            var self = this;

            self.constructor = Draft;

            Base.apply(self);

            var urlBase = function() {
                return '/api/' + self.getInfo().plural + '/' + self.getId() + '/';
            };

            self.getCurrentDrafter = function() {
                return self.ajax({
                    'url': urlBase() + 'current_drafter/',
                    'type': 'GET'
                })
                    .then(function(response) {
                        return response.user;
                    });
            };

            self.addDrafter = function(drafterId) {
                if (drafterId.getId) {
                    drafterId = drafterId.getId();
                }
                return self.ajax({
                    'url': urlBase() + 'add_drafter/',
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

            self.start = function() {
                return self.ajax({
                    'url': urlBase() + 'start/',
                    'type': 'POST',
                    'data': '{}'
                });
            };

            self.getAvailablePlayers = function() {
                return self.ajax({
                    'url': urlBase() + 'available_players/'
                })
                    .then(function(response) {
                        return response.players;
                    });
            };

            self.fetchInfo = function() {
                return self.ajax({
                    'url': urlBase() + 'info/'
                });
            };

            self.draftPlayer = function(player, type) {
                var data = {
                    'player': util.getId(player),
                };
                if (type) {
                    data.type = type;
                }

                return self.ajax({
                    'url': urlBase() + 'draft_player/',
                    'type': 'POST',
                    'data': JSON.stringify(data)
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
                'drafters': 'array',
                'draftees': 'array',
            },
        };

        return Draft;
    }
);
