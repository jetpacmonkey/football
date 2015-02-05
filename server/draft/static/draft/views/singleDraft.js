define([
        'jquery',
        'lodash',
        'draft/models/draft',
        'common/models/user'
    ],
    function(
        $,
        _,
        Draft,
        User
    ) {
        function SingleDraftView() {
            var self = this,
                splitLocation = window.location.pathname.split('/'),
                draftId = +splitLocation[splitLocation.length - 1];

            self.draft = new Draft();
            self.users = [];
            self.currentDrafterId = null;
            self.currentDrafter = new User();

            self.init = function() {
                return $.when(
                    self.fetchDraft(),
                    self.fetchUsers()
                );
            };

            self.fetchDraft = function() {
                self.draft.fetch(draftId)
                    .done(function() {
                        self.updateDraft();
                    });
            };

            self.fetchUsers = function() {
                (new User()).getList()
                    .done(function(users) {
                        self.users = users;
                        self.updateUsers();
                    });
            };

            self.updateUsers = function() {

            };

            self.updateDraft = function() {
                console.debug(self.draft);
            };

            self.updateCurrentDrafter = function() {
                var cur = _.find(self.users, function(u) {
                    return u.getId() == self.currentDrafterId;
                });
                if (cur) {
                    self.currentDrafter = cur;
                }
            };

            $(function() {
                self.init();
            });
        }

        return new SingleDraftView();
    }
);
