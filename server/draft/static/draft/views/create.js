define([
        'jquery',
        'draft/models/draft'
    ], function(
        $,
        Draft
    ) {
        function CreateDraftView() {
            d = new Draft();

            d.fetch(5);

            console.debug(d);
        }

        return new CreateDraftView();
    }
);
