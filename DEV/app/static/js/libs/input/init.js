"use strict";
class MyInput {
    constructor({ props, tag, options, label, event, regex, choices, classes, value }) {
        this.obj = new TAG_HTML("div").obj;
        this.label = new TAG_HTML("label").class(["label"]).props({ textContent: label }).obj;
        if (tag == "file") {
            this.input = new TAG_HTML("file").class(["input-file"]).obj;
            const container = new TAG_HTML("div").class(["container-input-file"]).obj;
            container.append(this.input, new TAG_HTML("i").class(["fa-regular", "fa-file"]).obj);
            this.obj.append(this.label, container);
        }
        else {
            this.tag = tag ? tag : "input";
            this.input = new TAG_HTML(this.tag).class(["input"]).obj;
            this.obj.append(this.label, this.input);
        }
        this.obj.classList.add(`container-${this.tag}`);
        this.input.value = value ? value : "";
        this.valid = true;
        switch (tag) {
            case "select":
                if (options) {
                    this.input.append(...options);
                }
                break;
        }
        if (classes) {
            this.input.classList.add(...classes);
        }
        if (event) {
            this.input.addEventListener(event.type, event.func);
        }
        //*PULIZIA
        this.input.addEventListener("blur", () => {
            this.input.value = this.input.value.trim();
        });
        if (regex) {
            this.input.addEventListener("blur", () => {
                const correct = regex.test(this.input.value);
                const color = correct ? SELECT.style("--light-blue") : "red";
                this.input.style.borderBottom = "1px solid " + color;
                this.valid = correct;
                if (!correct) {
                    new Popup({
                        type: "right",
                        text: `CAMPO: ${this.label.textContent} non valido`,
                        status: ConfigPopupStatus.KO
                    });
                }
            });
        }
        if (choices) {
            this.load(choices);
        }
    }
    async load(choices) {
        const data = await choices.conn();
        const texts = new Map();
        data.map((e) => texts.set(e[choices.name_column], e.id));
        const options = Array.from(texts).map(([text, id]) => new Option(text, String(id)));
        this.input.append(...options);
    }
    labelEvent() {
        this.input.addEventListener("focus", () => this.label.style.transform = "scale(80%)");
        this.input.addEventListener("blur", () => this.label.style.transform = "scale(100%)");
    }
}
