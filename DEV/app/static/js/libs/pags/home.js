"use strict";
class Home extends Page {
    constructor(router) {
        super(router);
        router.init("page-full");
        const sections = this.createSections(10, ["section-page"]);
        sections.forEach((e, i) => e.obj.id = i);
        router.main.append(...sections.map((e) => e.obj));
        this.sections = sections;
        this.connect();
    }
    async connect() {
        const data = await this.getDataLoadPage("/api", { action: "view_example" });
        if (typeof (data) == "string") {
            return;
        }
        console.log(data);
        for (let i = 0; i < 10; i++) {
            new Table({
                parent: this.sections[i].obj,
                title: "example",
                dimension: "large",
                style: "paging",
                tools: { n_rows: false, n_pag: false, search: false, settings: false },
                conn: async () => data,
                ths: [
                    ["id", ""],
                    ["email", "Email"],
                    ["active", "active"],
                    ["phone", "phone"],
                    ["name", "name"],
                    ["registered", "registered"],
                ],
                router: this.router
            });
        }
    }
}
