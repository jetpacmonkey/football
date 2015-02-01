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

            self.areas.userSelect = self.areas.form.find('[name="drafters"]');
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
                var newDraft = new Draft(),
                    drafterIds = _.map(self.areas.userSelect.val(), Number);
                newDraft.fromJSON({
                    'name': self.areas.form[0].name.value,
                    'type': self.areas.form.find('[name="type"]:checked').val(),
                    'drafters': drafterIds,
                });
                return newDraft.create()
                    .then(function(draft) {
                        if (draft.getDrafters().length) {
                            //API added drafters, I must've gotten better at Python or something
                            return draft;
                        } else {
                            //Drafters need to be added one-at-a-time
                            var promises = _.map(drafterIds, function(id) {
                                return draft.addDrafter(id);
                            });
                            return $.when.apply($, promises);
                        }
                    })
                    .done(function(draft) {
                        //redirect
                        //window.location = '/draft/' + draft.getId();
                    });
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
