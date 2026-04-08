type ItemCustomer = {
    id: number;
    name: string;
    surname: string;
    address: string;
}

class HandlerConnection {}

class MyDB {
    handler = new HandlerConnection();
    tables = {
        documents: []
    };
    ready: Promise<void>;

    constructor(){
        this.ready = this.init()
    }

    async init(){
        await Promise.all([
            await this.load({name: "documents"}),
        ])
    }

    async load(query: DBQuery){
        let res = await fetch(`/db/${query.name}/get`, {method:"GET"})
        res = await res.json();
        this.tables[query.name] = res;
    }

}

//class EXAMPLE_DATA {
//    static customer():Data{
//        const data:ItemCustomer[] = [];
//        for (let i = 0; i < 500; i++) {
//            data.push({
//                id: i + 1,
//                name:    GENERATE.get(["prov1", "prova2"]),
//                surname: GENERATE.get(["a", "b"]),
//                address: GENERATE.get(["c", "d"])
//            });
//        }
//        return {customers: data};
//    }
//}

const DATABASE = new MyDB()
