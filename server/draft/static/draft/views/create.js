define([
        'jquery',
        'lodash',
        'common/models/user',
        'draft/models/draft',
    ], function(
        $,
        _,
        User,
        Draft
    ) {
        function CreateDraftView() {
            var self = this;

            self.areas = {};
            self.areas.form = $('.create-draft');
            self.areas.userSelect = self.areas.form.find('[name="draftees"]');

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
                self.areas.userSelect.empty();
                _.forEach(self.users, function(u) {
                    var opt = $('<option>');
                    opt.val(u.id);
                    opt.text(u.getFirstName() + ' ' + u.getLastName());
                    self.areas.userSelect.append(opt);
                });
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
