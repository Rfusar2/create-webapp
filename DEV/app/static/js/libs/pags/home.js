"use strict";
class Home extends Page {
    constructor(router) {
        super(router);
        router.init("page-home");
        const sections = this.createSections(10, ["section-page"]);
        sections.forEach((e, i) => e.obj.id = i);
        router.main.append(...sections.map((e) => e.obj));
        this.connect();
    }
    async connect() {
        const data = await this.getDataLoadPage("/api", { action: "view_example" });
        console.log(data);
        if (typeof (data) == "string") {
            return;
        }
    }
}
