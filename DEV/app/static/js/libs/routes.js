"use strict";
class Routes {
    constructor() {
        this.main = SELECT.one("#page");
        this.db = DATABASE;
        this.render = RENDER;
        this.intervalPolling = 5 * 1000;
    }
    init(_class) {
        this.main.className = "";
        this.main.innerHTML = "";
        this.main.classList.add(_class);
    }
    async loadDB() {
        await this.db.refresh();
        setInterval(this.db.refresh, this.intervalPolling);
    }
    async testasyncvalue() {
        this.init("page-home");
        await this.loadDB();
        const [s1, s2] = ["section", "section"].map((e) => new TAG_HTML(e).obj);
        this.main.append(s1, s2);
        s1.id = "home-section1";
        let text = this.db.tables.example.length;
        const span = new TAG_HTML("span").props({ textContent: String(text) }).obj;
        s1.append(span);
        this.render.add({ id: "testo", element: span });
        setInterval(async () => {
            text = this.db.tables.example.length;
            this.render.update("testo", String(text));
        }, this.intervalPolling);
    }
    async testasynctable() {
        this.init("page-progetti");
        await this.loadDB();
        const table = new Table({
            e: new TAG_HTML("div").class(["table"]).obj,
            parent: this.main,
            title: "Data",
            dimension: "small",
            style: "simple",
            tools: { n_rows: false, n_pag: false, settings: false, search: false },
            ths: [
                ["id", ""],
                ["name", "NOME"],
            ],
            conn: async () => {
                return this.db.tables.example;
            }
        });
        setInterval(async () => {
            console.log(this.db);
            await this.db.load("example");
            table.table.data = this.db.tables.example;
            table.table.setContent(false, { name: "n_pag", value: String(0) });
        }, this.intervalPolling);
    }
    async testmodelupdate1() {
        this.init("page-one-element");
        new Model({
            type: "center",
            custom: async (model) => {
            }
        });
    }
    async testmodelupdate2() {
        this.init("page-one-element");
        new Model({
            type: "center",
            custom: async (model) => {
            }
        });
    }
}
