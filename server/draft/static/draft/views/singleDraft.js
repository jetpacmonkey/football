define([
        'jquery',
        'lodash',
        'knockout',
        'common/js/util',
        'draft/models/draft',
        'common/models/user',
        'common/models/player'
    ],
    function(
        $,
        _,
        ko,
        util,
        Draft,
        User,
        Player
    ) {
        var DRAFT_POLL_PERIOD = 20000; //20 seconds

        function SingleDraftView() {
            var self = this,
                splitLocation = window.location.pathname.split('/'),
                draftId = +splitLocation[splitLocation.length - 1];

            self.session = ko.observable({});
            self.draft = new Draft();
            self.users = ko.observableArray();
            self.players = ko.observableArray();
            self.currentDrafterId = ko.observable(null);

            self.indexes = {
                users: ko.computed(function() {
                    return _.indexBy(self.users(), function(u) {
                        return u.getId();
                    });
                }),
                players: ko.computed(function() {
                    return _.indexBy(self.players(), function(p) {
                        return p.getId();
                    });
                })
            };

            self.drafterUsers = ko.computed(function() {
                var index = self.indexes.users();
                self.drafterUsers = _.map(self.draft.getDrafters(), function(uid) {
                    return index[uid] || uid;
                });
            });

            self.currentDrafter = ko.computed(function() {
                var u = self.indexes.users()[self.currentDrafterId()];
                if (u) {
                    return u;
                } else {
                    return new User();
                }
            });

            self.draftedPlayers = ko.computed(function() {
                var userIndex = self.indexes.users();
                return _.map(self.draft.getDraftees(), function(pid) {
                    return userIndex[pid];
                });
            });

            self.availablePlayers = ko.computed(function() {
                return _.difference(self.players(), self.draftedPlayers());
            });

            self.draftInfoTimeout = null;

            self.init = function() {
                return $.when(
                    self.fetchSession(),
                    self.fetchDraft(),
                    self.fetchUsers(),
                    self.fetchPlayers()
                )
                    .done(function() {
                        ko.applyBindings(self);
                    });
            };

            self.fetchSession = function() {
                return util.fetchSession()
                    .done(function(session) {
                        self.session(session);
                    });
            };

            self.fetchDraft = function() {
                var isFirstRun = (self.draft.getId() == null);
                return self.draft.fetch(draftId)
                    .done(function() {
                        if (isFirstRun) {
                            self.pollDraftInfo();
                        }
                    });
            };

            self.fetchUsers = function() {
                return (new User()).getList()
                    .done(function(users) {
                        self.users(users);
                    });
            };

            self.fetchPlayers = function() {
                return (new Player()).getList()
                    .done(function(players) {
                        self.players(players);
                    });
            };

            self.fetchCurrentDrafter = function() {
                if (self.draft && self.draft.getId()) {
                    return self.draft.getCurrentDrafter()
                        .done(function(userId) {
                            self.currentDrafterId(userId);
                        });
                } else {
                    return $.Deferred().reject(new Error('No draft'));
                }
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
                    })
                    .fail(function() {
                        console.error('Error updating draft info', arguments);
                    });
            };

            $(function() {
                self.init();
            });
        }

        return window.sdv = new SingleDraftView();
    }
);
