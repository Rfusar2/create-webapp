"use strict";
class HandlerConnection {
}
class MyDB {
    constructor() {
        this.handler = new HandlerConnection();
        this.tables = {};
        this.ready = this.init();
    }
    async init() {
        await Promise.all([
        //await this.load({name: "storehouse"}),
        ]);
    }
    async load(query) {
        //let res = await fetch(`/db/${query.name}/get`, {method:"GET"})
        //res = await res.json();
        //this.tables[query.name] = res;
    }
}
const DATABASE = new MyDB();
