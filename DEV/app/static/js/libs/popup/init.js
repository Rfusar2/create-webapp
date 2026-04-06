"use strict";
var ConfigPopupStatus;
(function (ConfigPopupStatus) {
    ConfigPopupStatus[ConfigPopupStatus["OK"] = 0] = "OK";
    ConfigPopupStatus[ConfigPopupStatus["KO"] = 1] = "KO";
})(ConfigPopupStatus || (ConfigPopupStatus = {}));
class ConfigPopup {
    constructor({ type, text, status }) {
        this.type = type;
        this.text = text;
        this.status = status;
    }
}
class Popup {
    constructor(settings) {
        this.container = new TAG_HTML("div").id("sfondo-popup").obj;
        this.settings = new ConfigPopup(settings);
        const popup = new TAG_HTML("main")
            .id("popup-" + this.settings.type)
            .class(["popup"]).obj;
        const span = new TAG_HTML("span").obj;
        switch (this.settings.status) {
            case ConfigPopupStatus.OK:
                span.id = "popup-message-ok";
                break;
            case ConfigPopupStatus.KO:
                span.id = "popup-message-ko";
                break;
        }
        span.textContent = this.settings.text;
        popup.append(span);
        this.container.prepend(popup);
        document.body.prepend(this.container);
        setTimeout(() => { this.container.remove(); }, 4000);
    }
}
