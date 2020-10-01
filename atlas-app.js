var atlas;
(function (atlas) {
    var AtlasApp = /** @class */ (function () {
        function AtlasApp() {
        }
        AtlasApp.initialize = function () {
            console.log('test');
            var x = 11;
        };
        return AtlasApp;
    }());
    atlas.AtlasApp = AtlasApp;
})(atlas || (atlas = {}));
