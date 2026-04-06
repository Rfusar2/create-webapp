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
        new Model({
            conn: async () => { },
            type: ConfigModelTypes.RIGHT,
            title: "ualala",
            inputs: [
                new MyInput({
                    props: { placeholder: "ok" },
                    regex: /[a-z]{5}[0-9]{3}/,
                }),
            ]
        });
    }
}
