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
    async home() { new Home(this); }
    async altro() { new Altro(this); }
}
