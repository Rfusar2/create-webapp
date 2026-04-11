"use strict";
class HandlerConnection {
    constructor() {
        this.GET = [
            { id: "example", url: "/db/example/get" },
        ];
    }
    async refresh(id, tables) {
        for (const endpoint of this.GET) {
            if (id == endpoint.id) {
                let res = await fetch(endpoint.url, { method: "GET" });
                res = res.status == 200 ? await res.json() : await res.text();
                //console.log("BEFORE", tables);
                tables[id] = res;
                //console.log("AFTER", tables);
            }
        }
    }
}
class MyDB {
    constructor() {
        this.handler = new HandlerConnection();
        this.tables = {};
    }
    async load(queryName) {
        await this.handler.refresh(querName, this.tables);
    }
    async refresh() {
        for (const e of this.handler.GET) {
            await this.handler.refresh(e.id, this.tables);
        }
    }
}
const DATABASE = new MyDB();
//setInterval(DATABASE.refresh, 10 * 1000)
