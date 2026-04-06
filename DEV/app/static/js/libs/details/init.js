"use strict";
class CardDetails {
    constructor({ parent, title }) {
        this.obj = new TAG_HTML("main").id("card-datails-record").obj;
        this.header = new TAG_HTML("header").obj;
        this.main = new TAG_HTML("main").obj;
        this.obj.append(this.header, this.main);
        parent.append(this.obj);
        const [h_box1, h_box2] = ["div", "div"].map((e) => new TAG_HTML(e).obj);
        this.header.append(h_box1, h_box2);
        const h1 = new TAG_HTML("h1").props({ textContent: title });
        h_box1.append(h1);
    }
}
