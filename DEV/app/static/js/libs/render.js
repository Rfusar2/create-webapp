"use strict";
class Render {
    constructor() {
        this.register = [];
    }
    add(item) { this.register.push(item); }
    update(id, value) {
        for (const item of this.register) {
            if (item.id == id) {
                item.element.textContent = value;
            }
        }
    }
}
const RENDER = new Render();
