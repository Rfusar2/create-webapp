"use strict";
class HandlerConnection {
}
class MyDB {
    constructor() {
        this.handler = new HandlerConnection();
        this.tables = {
            documents: []
        };
        this.ready = this.init();
    }
    async init() {
        await Promise.all([
            await this.load({ name: "documents" }),
        ]);
    }
    async load(query) {
        let res = await fetch(`/db/${query.name}/get`, { method: "GET" });
        res = await res.json();
        this.tables[query.name] = res;
    }
}
const DATABASE = new MyDB();
