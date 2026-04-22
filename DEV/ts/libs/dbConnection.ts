class HandlerConnection {
    GET = [
        {id: "example", url: "/db/example/get"},
    ];

    async refresh(id: string, tables: Record<string, any>){
        const endpoint = this.GET.find(e => e.id == id);
        if (!endpoint) return;

        const res = await fetch(endpoint.url);
        tables[id] = res.ok ? await res.json() : await res.text();
        return tables[id]
    };
}


class MyDB {
    handler = new HandlerConnection();
    ready: Promise<void>;
    tables: Record<string, any> = {};

    async load(url: string, body:object){
        return await fetch(url, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body),
        })
    }

    async refresh(){
        for(const e of this.handler.GET){
            await this.handler.refresh(e.id, this.tables);
        }
    }
}
const DATABASE = new MyDB();
//setInterval(DATABASE.refresh, 10 * 1000)
