var AtlasApp;
(function (AtlasApp) {
    var MenuTools = /** @class */ (function () {
        function MenuTools() {
            this.isAttaching = false;
            this.isAttached = false;
            this.idRegex = /ID: DMS-([0-9]+)/g;
        }
        MenuTools.prototype.run = function () {
            var _this = this;
            $("body").on("DOMSubtreeModified", function () {
                if (!$("sharing").is(":visible")) {
                    _this.isAttaching = false;
                    _this.isAttached = false;
                    return;
                }
                if (!_this.isAttaching) {
                    _this.isAttaching = true;
                }
                else {
                    return;
                }
                var handle = setInterval(function () {
                    if (_this.shouldInjectMenuItem()) {
                        clearInterval(handle);
                        if (!_this.isAttached) {
                            _this.isAttached = true;
                            console.log("Visible!");
                            _this.injectMenuItem();
                        }
                    }
                }, 300);
            });
        };
        MenuTools.prototype.shouldInjectMenuItem = function () {
            var match = this.idRegex.exec($("#observation-modal > md-toolbar > div > h2").text());
            console.log(match);
            return $("sharing").is(":visible") && match != null;
        };
        MenuTools.prototype.injectMenuItem = function () {
            var _this = this;
            var $menuContainer = $("#observation-modal > md-toolbar > div").append('<md-menu md-position-mode="target-right target" class="md-menu ng-scope _md">');
            var $button = $menuContainer.append('<button id="maps-button" style="font-size: 20px;" class="md-icon-button md-button md-ink-ripple">G</button>');
            var idText = $("#observation-modal > md-toolbar > div > h2").text();
            var id = idText.substr(idText.search('-') + 1);
            console.log("id: " + id);
            $.getJSON("https://svampe.databasen.org/api/observations/" + id, function (data) {
                var clipBoardText = _this.getClipboardText(data);
                $("#maps-button").on('click', function () {
                    $("#maps-button-text").select();
                    document.execCommand("copy");
                    _this.loadGoogleMaps(data);
                });
                $("#observation-modal > md-toolbar").append("<input type=\"text\" value=\"" + clipBoardText + "\" id=\"maps-button-text\" style=\"position: absolute; top: 10px; right: 200px; color: #fff; width: 400px; font-size: 14px; background-color: rgba(255,255,255,0); border:0\"/>");
                // new Clipboard("#maps-button", {text: () => {
                //     return clipBoardText;
                // }});
            });
        };
        MenuTools.prototype.loadGoogleMaps = function (data) {
            window.open("https://www.google.com/maps/?q=" + data.decimalLatitude + "," + data.decimalLongitude);
        };
        MenuTools.prototype.getClipboardText = function (observation) {
            var result = observation.PrimaryDetermination.Taxon.acceptedTaxon.Vernacularname_DK.vernacularname_dk;
            result += " (" + observation.createdAt.substr(0, 4) + ")";
            result += " (" + observation.accuracy + "m)";
            return result;
        };
        return MenuTools;
    }());
    AtlasApp.MenuTools = MenuTools;
})(AtlasApp || (AtlasApp = {}));
