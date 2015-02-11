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
        var DRAFT_POLL_PERIOD = 20000; //20 seconds

        function SingleDraftView() {
            var self = this,
                splitLocation = window.location.pathname.split('/'),
                draftId = +splitLocation[splitLocation.length - 1];

            self.draft = new Draft();
            self.users = [];
            self.players = [];
            self.currentDrafterId = null;
            self.currentDrafter = new User();

            self.indexes = {};

            self.draftInfoTimeout = null;

            self.init = function() {
                return $.when(
                    self.fetchDraft(),
                    self.fetchUsers(),
                    self.fetchPlayers()
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

            self.fetchCurrentDrafter = function() {
                if (self.draft && self.draft.getId()) {
                    return self.draft.getCurrentDrafter()
                        .done(function(userId) {
                            self.currentDrafterId = userId;
                            self.updateCurrentDrafter();
                        });
                } else {
                    return $.Deferred().reject('No draft');
                }
            };

            self.updateUsers = function() {
                if (self.currentDrafterId) {
                    self.updateCurrentDrafter();
                }
                self.indexes.users = _.indexBy(self.users, function(u) {
                    return u.getId();
                });
            };

            self.updateDraft = function() {
                if (!self.draftInfoTimeout) {
                    //kick off the polling if it's the first time
                    self.pollDraftInfo();
                }
            };

            self.updateCurrentDrafter = function() {
                var cur = _.find(self.users, function(u) {
                    return u.getId() == self.currentDrafterId;
                });
                if (cur) {
                    self.currentDrafter = cur;
                }
            };

            self.updatePlayers = function() {
                self.indexes.players = _.indexBy(self.players, function(p) {
                    return p.getId();
                });
            };

            self.pollDraftInfo = function() {
                if (self.draftInfoTimeout) {
                    window.clearTimeout(self.draftInfoTimeout);
                    draftInfoTimeout = null;
                }

                $.when(
                    self.fetchCurrentDrafter(),
                    self.fetchDraft()
                )
                    .done(function() {
                        self.draftInfoTimeout = window.setTimeout(function() {
                            self.draftInfoTimeout = null;
                            self.pollDraftInfo();
                        }, DRAFT_POLL_PERIOD);
                    });
            };

            $(function() {
                self.init();
            });
        }

        return new SingleDraftView();
    }
);
