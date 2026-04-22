"use strict";
class Button extends TAG_HTML {
    constructor(text) {
        super("button");
        this.obj.textContent = text;
    }
    file(type, text) {
        this.obj = new MyInput({ tag: type, label: text });
        return this;
    }
}
class Altro extends Page {
    constructor(router) {
        super(router);
        router.init("page-home");
        const sections = this.createSections(3, ["section-page"]);
        sections.forEach((e, i) => e.obj.id = i);
        router.main.append(...sections.map((e) => e.obj));
        this.sections = sections;
        const cBtns = [
            "Primary", "Warning", "Error", "Extra1", "Extra2", "Extra3", "Extra4"
        ].map((color) => {
            const btn = new Button().class(["btn", `btn-${color.toLowerCase()}`]).props({ textContent: color }).obj;
            const container = new Container().obj;
            container.append(btn);
            return container;
        });
        this.sections[0].obj.append(...cBtns);
        this.sections[1].obj.append(new Spinner("success").container);
        this.sections[1].obj.append(new Spinner("warning").container);
        this.sections[1].obj.append(new Spinner("error").container);
        this.sections[1].obj.append(new Spinner("extra1").container);
        this.sections[1].obj.append(new Spinner("extra2").container);
        this.sections[1].obj.append(new Spinner("extra3").container);
        this.sections[1].obj.append(new Spinner("extra4").container);
        this.sections[2].obj.append(new Button().file("savefile", "Salva file").obj.obj);
        this.sections[2].obj.append(new Button().file("loadfile", "Carica file").obj.obj);
        this.connect();
    }
    async connect() {
        const data = await this.getDataLoadPage("/api", { action: "view_example" });
        if (typeof (data) == "string") {
            return;
        }
        //console.log(data)
    }
}
