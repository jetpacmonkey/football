define([
        'jquery',

        'common/models/user',
        'draft/models/draft',
    ], function(
        $,
        User,
        Draft
    ) {
        function CreateDraftView() {
            var self = this;

            self.areas = {

            };

            self.users = [];
            self.draft = new Draft();

            self.promises = {};

            self.loadUsers = function() {
                self.promises.users = (new User()).getList()
                    .done(function(response) {
                        self.users = response;
                        self.updateUsers();
                    });
            };

            self.updateUsers = function() {

            };

            self.init = function() {
                return $.when(
                    self.loadUsers()
                );
            };

            self.init();
        }

        return new CreateDraftView();
    }
);
