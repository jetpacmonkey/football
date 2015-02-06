define([
        'common/js/util',
        'common/js/model'
    ], function(
        util,
        Base
    ) {
        function Player() {
            var self = this;

            self.constructor = Player;

            Base.call(self);
        }

        Player.info = {
            name: 'Player',
            fields: {
                //generic
                'first_name': 'string',
                'last_name': 'string',

                //offensive
                'passing': 'number',
                'hands': 'number',
                'rushing': 'number',
                'receive_short': 'number',
                'receive_mid': 'number',
                'receive_deep': 'number',
                'blocking': 'number',
                'kicking': 'number',

                'offensive_special': 'array',

                //defensive
                'pass_man': 'number',
                'pass_zone': 'number',
                'run_defense': 'number',
                'blitzing': 'number',

                'defensive_special': 'array',
            }
        };

        return Player;
    }
);
