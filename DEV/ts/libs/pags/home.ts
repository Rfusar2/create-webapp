class Home extends Page {
    router: Routes;

    constructor(router: Routes){
        super(router);
        router.init("page-home");

        const sections = this.createSections(10, ["section-page"]);
        sections.forEach((e:TAG_HTML, i:number)=> e.obj.id = i )

        router.main.append(...sections.map((e:TAG_HTML)=>e.obj))

        this.connect()
    }

    async connect(){
        const data = await this.getDataLoadPage("/api", { action:"view_example" } );
        console.log(data)

        if(typeof(data) == "string"){ return; }
    }

}
