class Routes {
    main = SELECT.one("#page");
    db = DATABASE
    render = RENDER

    init(_class: string){
        this.main.className = "";
        this.main.innerHTML = "";
        this.main.classList.add(_class);
    }

    async home(){
        this.init("page-listino");

        let text = 0;
        const span = new TAG_HTML("span").props({textContent: String(text)}).obj
        this.render.add({ id:"testo",  element: span });

        setInterval(async ()=>{
            await this.db.refresh();
            text = this.db.tables.example.length;
            this.render.update("testo", String(text))
            console.log("ho eseguito l'aggiornamento")

        }, 5 * 1000);

        const [s1, s2] = ["section", "section"].map((e:string)=>new TAG_HTML(e).obj);
        this.main.append(s1, s2);
        s1.id = "home-section1"

        const btn = new TAG_HTML("button").props({textContent: "cambia il valore"}).class(["btn", "btn-success"]).obj;
        s1.append(btn, span);

    }
}
