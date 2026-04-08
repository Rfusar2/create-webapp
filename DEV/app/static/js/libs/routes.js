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
        const cards = [
            {
                title: "test1",
                content: "5",
                router: "progetti"
            },
            {
                title: "test2",
                content: "9",
                form: {
                    model: ConfigModelTypes.CENTER,
                    inputs: [
                        new MyInput({
                            tag: "select",
                            label: "Customer",
                            props: { name: "customer-name" },
                            choices: {
                                conn: async () => {
                                    let res = await fetch("/db/documents/get", { method: "GET" });
                                    return await res.json();
                                },
                                name_column: "nDocuments"
                            }
                        }),
                        new MyInput({
                            props: { placeholder: "Name", name: "customer-name" },
                            regex: /[0-9]/,
                        }),
                    ]
                }
            }
        ];
        //TO SCREEN
        for (const card of cards) {
            new Card({
                parent: s1,
                title: card.title,
                style: ConfigCardStyle.PRIMARY,
                content: card.content,
                view: true,
                router: card.router,
                form: card.form,
            });
        }
    }
    async progetti() {
        this.init("page-progetti");
        await this.db.ready;
        const record = this.db.tables.documents[0]; //record simulato
        const [s1, s2] = ["section", "section"].map((e) => new TAG_HTML(e).obj);
        this.main.append(s1, s2);
        new Table({
            e: new TAG_HTML("table").class(["table"]).obj,
            parent: s2,
            title: "Customer",
            dimension: "small",
            style: "simple",
            tools: { n_rows: true, search: true, n_pag: false, settings: false },
            ths: [
                ["nDocument", "Numero Documento"],
                ["description", "Descrizione"],
            ],
            conn: async () => {
                let res = await fetch("/db/documents/get", { method: "GET" });
                res = await res.json();
                console.log(res);
                return res;
            },
            router: this,
        });
    }
}
