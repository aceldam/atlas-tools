//declare var Clipboard: any;

namespace AtlasApp {
  export class MenuTools {
    private isAttaching: boolean = false;
    private isAttached: boolean = false;

    private idRegex: RegExp = /ID: DMS-([0-9]+)/g;

    public run(): void {
      const observer = new MutationObserver(() => {
        if (!$("sharing").is(":visible")) {
          this.isAttaching = false;
          this.isAttached = false;
          return;
        }
        if (!this.isAttaching) {
          this.isAttaching = true;
        } else {
          return;
        }

        const handle = setInterval(() => {
          if (this.shouldInjectMenuItem()) {
            clearInterval(handle);

            if (!this.isAttached) {
              this.isAttached = true;
              console.log("Visible!");
              this.injectMenuItem();
            }
          }
        }, 300);
      });

      // Observe changes in the entire <body> subtree
      observer.observe(document.body, { childList: true, subtree: true });
    }

    shouldInjectMenuItem(): boolean {
      var match = this.idRegex.exec(
        $("#observation-modal > md-toolbar > div > h2").text()
      );
      console.log(match);
      return $("sharing").is(":visible") && match != null;
    }
    injectMenuItem(): void {
      let $menuContainer = $("#observation-modal > md-toolbar > div").append(
        '<md-menu md-position-mode="target-right target" class="md-menu ng-scope _md">'
      );

      let $button = $menuContainer.append(
        '<button id="maps-button" style="font-size: 20px;" class="md-icon-button md-button md-ink-ripple">G</button>'
      );

      let idText = $("#observation-modal > md-toolbar > div > h2").text();

      let id = idText.substr(idText.search("-") + 1);
      console.log("id: " + id);

      $.getJSON(
        "https://svampe.databasen.org/api/observations/" + id,
        (data: Observation) => {
          var clipBoardText = this.getClipboardText(data);

          $("#maps-button").on("click", () => {
            $("#maps-button-text").select();
            document.execCommand("copy");
            this.loadGoogleMaps(data);
          });

          $("#observation-modal > md-toolbar").append(
            `<input type="text" value="${clipBoardText}" id="maps-button-text" style="position: absolute; top: 10px; right: 200px; color: #fff; width: 400px; font-size: 14px; background-color: rgba(255,255,255,0); border:0"/>`
          );

          // new Clipboard("#maps-button", {text: () => {
          //     return clipBoardText;
          // }});
        }
      );
    }
    loadGoogleMaps(data: Observation): void {
      window.open(
        `https://www.google.com/maps/?q=${data.decimalLatitude},${data.decimalLongitude}`
      );
    }
    getClipboardText(observation: Observation): string {
      let result =
        observation.PrimaryDetermination.Taxon.acceptedTaxon.Vernacularname_DK
          .vernacularname_dk;

      result += " (" + observation.createdAt.substr(0, 4) + ")";

      result += " (" + observation.accuracy + "m)";

      return result;
    }
  }
}
