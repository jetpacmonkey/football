define([
        'jquery',
        'lodash',
        'draft/models/draft',
        'common/models/user',
        'common/models/player'
    ],
    function(
        $,
        _,
        Draft,
        User,
        Player
    ) {
        function SingleDraftView() {
            var self = this,
                splitLocation = window.location.pathname.split('/'),
                draftId = +splitLocation[splitLocation.length - 1];

            self.draft = new Draft();
            self.users = [];
            self.players = [];
            self.currentDrafterId = null;
            self.currentDrafter = new User();

            self.init = function() {
                return $.when(
                    self.fetchDraft(),
                    self.fetchUsers()
                );
            };

            self.fetchDraft = function() {
                return self.draft.fetch(draftId)
                    .done(function() {
                        self.updateDraft();
                    });
            };

            self.fetchUsers = function() {
                return (new User()).getList()
                    .done(function(users) {
                        self.users = users;
                        self.updateUsers();
                    });
            };

            self.fetchPlayers = function() {
                return (new Player()).getList()
                    .done(function(players) {
                        self.players = players;
                        self.updatePlayers();
                    });
            };

            self.updateUsers = function() {
                if (self.currentDrafterId) {
                    self.updateCurrentDrafter();
                }
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
