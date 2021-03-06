define([
        'common/js/util',
        'common/js/model'
    ], function(
        util,
        Base
    ) {
        function User() {
            var self = this;

            self.constructor = User;

            Base.call(self);

            self.getName = function() {
                return self.getFirstName() + ' ' + self.getLastName();
            };
        }

        User.info = {
            name: 'User',
            fields: {
                'username': 'string',
                'first_name': 'string',
                'last_name': 'string'
            }
        };

        return User;
    }
);
