type ButtonTypes = "savefile" | "loadfile";

class Button extends TAG_HTML {
    constructor(text:string){ 
        super("button"); 
        this.obj.textContent = text;
    }
    
    file(type:ButtonTypes, text:string){
        this.obj = new MyInput({ tag: type, label: text })
        return this;
    }
}


class Altro extends Page {
    router: Routes;

    constructor(router: Routes){
        super(router);
        router.init("page-home");

        const sections = this.createSections(3, ["section-page"]);
        sections.forEach((e:TAG_HTML, i:number)=> e.obj.id = i );
        router.main.append(...sections.map((e:TAG_HTML)=>e.obj));

        this.sections = sections;

        const cBtns = [
            "Primary", "Warning", "Error", "Extra1", "Extra2", "Extra3", "Extra4"
        ].map((color:string)=>{
            const btn = new Button().class(["btn", `btn-${color.toLowerCase()}`]).props({textContent: color}).obj;
            const container = new Container().obj;
            container.append(btn);
            return container;
        })

        this.sections[0].obj.append(...cBtns);


        this.sections[1].obj.append(new Spinner("success").container)
        this.sections[1].obj.append(new Spinner("warning").container)
        this.sections[1].obj.append(new Spinner("error").container)
        this.sections[1].obj.append(new Spinner("extra1").container)
        this.sections[1].obj.append(new Spinner("extra2").container)
        this.sections[1].obj.append(new Spinner("extra3").container)
        this.sections[1].obj.append(new Spinner("extra4").container)

        this.sections[2].obj.append(new Button().file("savefile", "Salva file").obj.obj)
        this.sections[2].obj.append(new Button().file("loadfile", "Carica file").obj.obj)

        this.connect();
    }

    async connect(){
        const data = await this.getDataLoadPage("/api", { action:"view_example" } );

        if(typeof(data) == "string"){ return; }

        //console.log(data)
    }

}
