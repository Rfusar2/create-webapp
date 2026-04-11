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

    background =  new TAG_HTML("div").id("sfondo-model-"+this._type).class(["sfondo-model"]).obj;
    container = new TAG_HTML("form").id("container-model").obj;
    obj = new TAG_HTML("div").id("model-"+this._type).class(["model"]).obj;
    
    eInputs: HTMLElement[] = [];
    inputs: MyInput[] = [];

    header = new TAG_HTML("header").obj;
    container_inputs = new TAG_HTML("main").obj;
    footer = new TAG_HTML("footer").obj;

    btn_close = new TAG_HTML("button").id("btn-close").class(["btn", "btn-primary"]).props({textContent: "Cancella"}).obj;
    btn_send = new TAG_HTML("button").id("btn-send").class(["btn", "btn-success"]).props({textContent: "Conferma"}).obj;

    constructor({send, type, dimension, title, inputs, load, custom}:ConfigModelProps){
        this.send = send
        this.inputs = inputs

        this.background =  new TAG_HTML("div").id(`sfondo-model-${type}`).class(["sfondo-model"]).obj;
        this.obj = new TAG_HTML("div").id("model").class([type, dimension]).obj;

        this.background.append(this.container);
        this.container.append(this.obj);
        this.obj.append(this.header, this.container_inputs, this.footer)

        //LAYOUT
        switch(type){
            case "right": this.background.append(new TAG_HTML("div").obj); break;
            case "center": break;
        }

        this.header.append(new TAG_HTML("h1").props({textContent: title}).obj);

        let container_btns_class = "custom"
        if (custom){ custom(this); }
        else { 
            this.loadInputs(); 
            container_btns_class = type
        }

        const container = new TAG_HTML("div").id("model-container-btns").class([container_btns_class]).obj;
        container.append(this.btn_close, this.btn_send);
        this.footer.append(container);
        
        document.body.prepend(this.background);
        
        this.getEvents();
        this.obj.addEventListener("load", this.load)
        //this.close(true, 1000 * 60)
    }

    loadInputs(){
        const boxies = []
        for(let i = 0; i < this.max_inputs; i++){
            const box = new TAG_HTML("div").class(["model-input-box"]).obj;
            this.container_inputs.append(box);
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
