"use strict";
class HandlerConnection {
    constructor() {
        this.GET = [
            { id: "example", url: "/db/example/get" },
        ];
    }
    async refresh(id, tables) {
        const endpoint = this.GET.find(e => e.id == id);
        if (!endpoint)
            return;
        const res = await fetch(endpoint.url);
        tables[id] = res.ok ? await res.json() : await res.text();
    }
    ;
}
class MyDB {
    constructor() {
        this.handler = new HandlerConnection();
        this.tables = {};
    }
    async load(queryName) {
        await this.handler.refresh(queryName, this.tables);
    }
    async refresh() {
        for (const e of this.handler.GET) {
            await this.handler.refresh(e.id, this.tables);
        }
    }
}
const DATABASE = new MyDB();
//setInterval(DATABASE.refresh, 10 * 1000)
