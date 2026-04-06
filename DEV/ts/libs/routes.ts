
class Routes {
    main = SELECT.one("#page");
    db = DATABASE

    init(_class: string){
        this.main.className = "";
        this.main.innerHTML = "";
        this.main.classList.add(_class);
    }

    async dashboard(){
        this.init("page-listino");
        const [s1, s2] = ["section", "section"].map((e:string)=>new TAG_HTML(e).obj);
        this.main.append(s1, s2);
        s1.id = "home-section1"

        //*QUERY DB
        await this.db.ready;

        
        new Table({
            e: new TAG_HTML("table").class(["table"]).obj,
            parent: s2,
            title: "I miei clienti",
            dimension: "small",
            style: "simple",
            tools: {n_rows:false, n_pag:false, search:false, settings:false},
			conn: async()=>{
				let res = await fetch("/db/customers/get", {method:"GET"})
				return await res.json()
			},
            ths: ["name", "surname", "id"],
        })
        

    }

    //UPGRADE v0.0.2
    progetti(){
        this.init("page-projects");
    }   
}
