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
            self.info = ko.observable({currentDrafter: null, draftees: []});
            self.selectedPlayerId = ko.observable(null);

            self.currentDrafterId = ko.computed(function() {
                return self.info().currentDrafter;
            });

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
                var playerIndex = self.indexes.players();
                return _.map(self.info().draftees, function(drafteeData) {
                    return {
                        player: playerIndex[drafteeData[0]],
                        type: drafteeData[1]
                    };
                });
            });

            self.availablePlayers = ko.computed(function() {
                var type = self.draft.getType();
                if (type === '2' || type == '1') {
                    return _.difference(self.players(), _.map(self.draftedPlayers(), 'player'));
                } else if (type === 'C') {
                    var counts = _.countBy(self.draftedPlayers(), function(data) {return data.player.getId()}),
                        takenBothWaysIds = _.keys(_.pick(counts, function(v) {return v == 2;}));
                    return _.difference(self.players(),
                        _.map(takenBothWaysIds, function(pid) {return self.indexes.players()[pid]}));
                }
            });

            self.selectedPlayer = ko.computed({
                read: function() {
                    return self.indexes.players()[self.selectedPlayerId()];
                },
                write: function(val) {
                    if (val instanceof Player) {
                        self.selectedPlayerId(val.getId());
                    } else {
                        self.selectedPlayerId(val);
                    }
                }
            });

            self.availableDraftTypes = ko.computed(function() {
                var selectedPlayer = self.selectedPlayer(),
                    draftType = self.draft.getType(),
                    info = {};

                if (draftType === '1') {
                    info.O = info.D = !_.includes(_.pluck(self.draftedPlayers(), 'player'), selectedPlayer);
                } else if (draftType === '2') {
                    info.B = !_.includes(_.pluck(self.draftedPlayers(), 'player'), selectedPlayer);
                } else {
                    info.O = !_.includes(
                        _.pluck(_.where(self.draftedPlayers(), {type: 'O'}), 'player'),
                        selectedPlayer);
                    info.D = !_.includes(
                        _.pluck(_.where(self.draftedPlayers(), {type: 'D'}), 'player'),
                        selectedPlayer);
                }
                return info;
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
                return self.draft.fetch(draftId)
                    .done(function() {
                        self.pollDraftInfo();
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

            self.fetchDraftInfo = function() {
                if (self.draft && self.draft.getId()) {
                    return self.draft.fetchInfo()
                        .done(function(info) {
                            self.info(info);
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

                self.fetchDraftInfo()
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

            self.clickPlayer = function(player) {
                self.selectedPlayer(player);
            };

            self.draftPlayerHandler = function(type) {
                return function() {
                    self.draft.draftPlayer(self.selectedPlayer(), type)
                        .done(function() {
                            self.pollDraftInfo();
                        });
                };
            };

            $(function() {
                self.init();
            });
        }

        return window.sdv = new SingleDraftView();
    }
);
