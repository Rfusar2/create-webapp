"use strict";
class Card {
    constructor({ parent, title }) {
        this.obj = new TAG_HTML("div").class(["card", "card-details"]).attr({ colorschema: "dark" }).obj;
        this.header = new TAG_HTML("header").obj;
        this.main = new TAG_HTML("main").obj;
        this.footer = new TAG_HTML("footer").obj;
        parent.append(this.obj);
        this.title = title;
        this.form = form;
        this.obj.append(this.header, this.main, this.footer);
        this.title = new TAG_HTML("span").class(["card-details-title"]).props({ textContent: this.title }).attr({ colorschema: "dark" }).obj;
        this.header.append(this.title);
    }
    class(classes) {
        this.obj.classList.add(...classes);
    }
}
