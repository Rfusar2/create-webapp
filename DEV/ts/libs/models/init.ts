type ConfigModelProps = {
    title?: string;
    type: "center" | "right";
    dimension: "large" | "medium" | "small"
    inputs?: MyInput[];
    send?: (data:object)=>Promise<void>;
    load?: Promise<void>;
    custom?: Promise<void>;
}

class Model {
    max_inputs = 9; //da rivedere
    send: (data:object)=>Promise<void>;

    background:  HTMLElement;
    container: HTMLElement;
    obj: HTMLElement;
    
    eInputs: HTMLElement[] = [];
    inputs: MyInput[] = [];

    header = new TAG_HTML("header").obj;
    main = new TAG_HTML("main").obj;
    footer = new TAG_HTML("footer").obj;

    btn_close = new TAG_HTML("button").id("btn-close").class(["btn", "btn-primary"]).props({textContent: "Cancella"}).obj;
    btn_send = new TAG_HTML("button").id("btn-send").class(["btn", "btn-success"]).props({textContent: "Conferma"}).obj;

    constructor({send, type, dimension, title, inputs, load, custom}:ConfigModelProps){
        this.send = send
        this.inputs = inputs

        this.background =  new TAG_HTML("div").id(`sfondo-model`).class([type]).obj;
        this.container = new TAG_HTML("form").id("container-model").class([type]).obj
        this.obj = new TAG_HTML("div").id("model").class([type, dimension]).obj;

        this.container.append(this.obj);
        this.obj.append(this.header, this.main, this.footer)

        //LAYOUT
        switch(type){
            case "right": this.background.append(new TAG_HTML("div").obj); break;
            case "center": break;
        }
        this.background.append(this.container);

        this.header.append(new TAG_HTML("h1").props({textContent: title}).obj);

        if (custom){ custom(this); }
        else { this.loadInputs(); }

        const container = new TAG_HTML("div").id("model-container-btns").class([type]).obj;
        container.append(this.btn_send, this.btn_close);
        switch(type){
            case "center": this.header.append(container);break;
            case "right": this.footer.append(container);break;
        }
        
        document.body.prepend(this.background);
        
        this.getEvents();
        this.obj.addEventListener("load", this.load)
        //this.close(true, 1000 * 60)
    }

    loadInputs(){
        const boxies = []
        for(let i = 0; i < this.max_inputs; i++){
            const box = new TAG_HTML("div").class(["model-input-box"]).obj;
            this.main.append(box);
            boxies.push(box);
        }
        for(let i = 0; i < this.inputs.length; i++){
            const outOfRange = i >= this.max_inputs-1;
            if(outOfRange) { break; }
            this.eInputs.push(this.inputs[i].input);
            boxies[i].append(this.inputs[i].obj);
        }
    }

    getEvents(){
        this.btn_send.addEventListener("click", async(e)=>{
            e.preventDefault()
            this.send(this.eInputs)
        });

        this.btn_close.addEventListener("click", (e)=>{e.preventDefault();this.background.remove()});
    }
}
