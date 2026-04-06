
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

        

    }
}
