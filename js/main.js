'use strict';
(function ($) {
    $(document).ready(function () {
        if ($('body').hasClass('lt-ie7')) {
            return;
        }
        var bLazy = new Blazy({ selector: '.app-img' });
    });
}(jQuery));