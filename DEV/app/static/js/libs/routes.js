"use strict";
class Routes {
    constructor() {
        this.main = SELECT.one("#page");
        this.db = DATABASE;
    }
    init(_class) {
        this.main.className = "";
        this.main.innerHTML = "";
        this.main.classList.add(_class);
    }
    async dashboard() {
        this.init("page-listino");
        const [s1, s2] = ["section", "section"].map((e) => new TAG_HTML(e).obj);
        this.main.append(s1, s2);
        s1.id = "home-section1";
        //*QUERY DB
        await this.db.ready;
        new CardDetails({
            parent: s1,
            title: "Dettaglio Customer",
            sections: [
                {
                    title: "titolo1",
                    inputs: [
                        new MyInput({
                            regex: /[a-zA-XZ]/,
                            props: {
                                placeholder: "inserisci qualcosa",
                            },
                        }),
                    ]
                }
            ]
        });
    }
}
