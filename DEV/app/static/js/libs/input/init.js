"use strict";
class MyInput {
    constructor({ props, tag, options, label, event, regex }) {
        this.obj = new TAG_HTML(tag ? tag : "input").props(props).obj;
        this.input = this.obj;
        this.regex = regex;
        switch (tag) {
            case "select":
                if (options) {
                    console.log(this.obj, label, options);
                    this.obj.append(...options);
                }
                break;
        }
        if (event) {
            this.obj.addEventListener(event.type, event.func);
        }
        if (label) {
            const input = this.obj;
            this.input = input;
            const container = new TAG_HTML("div").class(["model-input-select"]).obj;
            const name_input = new TAG_HTML("label").props({ textContent: label }).obj;
            container.append(name_input, input);
            this.obj = container;
        }
        if (regex) {
            this.input.addEventListener("blur", () => {
                const correct = regex.test(this.input.value);
                const color = correct ? SELECT.style("--light-blue") : "red";
                this.input.style.borderBottom = "1px solid " + color;
            });
        }
    }
}
