define([
        'jquery',
        'lodash',
        'knockout',
        'common/js/util',
        'draft/models/draft',
        'common/models/user'
    ], function(
        $,
        _,
        ko,
        util,
        Draft,
        User
    ) {
        var DRAFT_POLL_PERIOD = 20000; //20 seconds

        function PredraftView() {
            var self = this,
                splitLocation = window.location.pathname.split('/'),
                draftId = +splitLocation[splitLocation.length - 1];

            self.session = ko.observable({});
            self.draft = new Draft();
            self.users = ko.observableArray();

            self.isOwner = ko.computed(function() {
                return self.session().user === self.draft.getOwner();
            });

            self.addingDrafter = ko.observable(false);
            self.drafterToAdd = ko.observable(null);

            self.indexes = {
                users: ko.computed(function() {
                    return _.indexBy(self.users(), function(u) {
                        return u.getId();
                    });
                })
            };

            self.drafterUsers = ko.computed(function() {
                var index = self.indexes.users();
                return _.map(self.draft.getDrafters(), function(uid) {
                    return index[uid] || uid;
                });
            });

            self.unusedUsers = ko.computed(function() {
                var index = self.indexes.users();
                return _.map(
                    _.difference(
                        _.map(self.users(), function(u) {
                            return u.getId();
                        }),
                        self.draft.getDrafters()
                    ),
                    function(uid) {
                        return index[uid] || uid;
                    }
                );
            });

            self.draftInfoTimeout = null;

            self.init = function() {
                return $.when(
                    self.fetchSession(),
                    self.fetchDraft(),
                    self.fetchUsers()
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
                        //self.pollDraftInfo();
                    });
            };

            self.fetchUsers = function() {
                return (new User()).getList()
                    .done(function(users) {
                        self.users(users);
                    });
            };

            //event handlers
            self.openAddDrafter = function() {
                self.addingDrafter(true);
            };

            self.cancelAddDrafter = function() {
                self.addingDrafter(false);
                self.drafterToAdd(null);
            };

            self.confirmAddDrafter = function() {
                if (!self.drafterToAdd()) {
                    return;
                }

                self.draft.addDrafter(self.drafterToAdd())
                    .done(function() {
                        self.cancelAddDrafter();
                    });
            };

            self.startDraft = function() {
                self.draft.start()
                    .done(function() {
                        window.location.reload();
                    });
            };

            $(function() {
                self.init();
            });
        }

        return window.pdv = new PredraftView();
    }
);
