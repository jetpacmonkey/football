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
            self.areas.submit = self.areas.form.find('input[type="submit"]');

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
                    opt.val(u.getId());
                    opt.text(u.getFirstName() + ' ' + u.getLastName());
                    self.areas.userSelect.append(opt);
                });
            };

            self.createDraft = function() {
                var newDraft = new Draft();
                newDraft.fromJSON({
                    'name': self.areas.form[0].name.value,
                    'type': self.areas.form.find('[name="type"]:checked').val(),
                    'drafters': _.map(self.areas.userSelect.val(), Number),
                });
                console.debug(newDraft);
            };

            self.setHandlers = function() {
                self.areas.form.on('submit', function(event) {
                    var obj = {}

                    event.preventDefault();

                    self.createDraft();
                });
            };

            self.init = function() {
                return $.when(
                        self.loadUsers()
                    )
                    .always(function() {
                        self.setHandlers();
                        self.areas.submit.prop('disabled', false);
                    });
            };

            self.init();
        }

        return new CreateDraftView();
    }
);
