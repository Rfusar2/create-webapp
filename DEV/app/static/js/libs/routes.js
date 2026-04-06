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
        new Card({});
        new Table({
            e: new TAG_HTML("table").class(["table"]).obj,
            parent: s2,
            title: "I miei clienti",
            dimension: "small",
            style: "simple",
            tools: { n_rows: false, n_pag: false, search: false, settings: false },
            conn: async () => {
                let res = await fetch("/db/customers/get", { method: "GET" });
                return await res.json();
            }
        });
    }
    //*TABLES
    clienti() {
        this.init("page-customer");
        new Table({
            e: new TAG_HTML("table").class(["table"]).obj,
            parent: this.main,
            title: "I miei clienti",
            dimension: "large",
            style: "simple",
            tools: { n_rows: false, n_pag: false, search: false, settings: false },
            conn: async () => {
                let res = await fetch("/db/customers/get", { method: "GET" });
                return await res.json();
            }
        });
    }
    materiali() {
        this.init("page-materials");
        new Table({
            e: new TAG_HTML("table").class(["table"]).obj,
            parent: this.main,
            title: "I miei materiali",
            dimension: "large",
            style: "simple",
            tools: { n_rows: false, n_pag: false, search: false, settings: false },
        });
    }
    ordini() {
        this.init("page-orders");
        new Table({
            e: new TAG_HTML("table").class(["table"]).obj,
            parent: this.main,
            title: "I miei ordini",
            dimension: "large",
            style: "simple",
            tools: { n_rows: false, n_pag: false, search: false, settings: false },
        });
    }
    prodotti() {
        this.init("page-products");
        new Table({
            e: new TAG_HTML("table").class(["table"]).obj,
            parent: this.main,
            title: "I mio Listino",
            dimension: "large",
            style: "simple",
            tools: { n_rows: false, n_pag: false, search: false, settings: false },
        });
    }
    //UPGRADE v0.0.2
    progetti() {
        this.init("page-projects");
    }
}
