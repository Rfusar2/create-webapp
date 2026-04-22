class Routes {
    main = SELECT.one("#page");
    db = DATABASE
    render = RENDER

    intervalPolling = 5 * 1000

    init(_class: string){
        this.main.className = "";
        this.main.innerHTML = "";
        this.main.classList.add(_class);
    }

    async loadDB(){
        await this.db.refresh();
        setInterval(this.db.refresh, this.intervalPolling);
    }

    async home(){ new Home(this) }
    
    async altro(){ new Altro(this) }

}
