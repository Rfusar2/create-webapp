type ConfigInputEvent = {
    type: string;
    func: ()=>void;
}
type ConfigInputChoices = {
    conn: Promise<void>;
    name_column: string;
}
type ConfigInputProps = {
    props: object;
    tag?: string;
    options?: HTMLOptionElement[];
    label?: string;
    event?: ConfigModelInputEvent;
    regex?: RagExp;
    choices?: ConfigInputChoices; 
}

class MyInput {
    obj: HTMLElement;
    input: HTMLInputElement;

    constructor({props, tag, options, label, event, regex, choices}:ConfigModelInputProps){
        this.obj = new TAG_HTML(tag ? tag : "input").props(props).obj
        this.input = this.obj

        switch(tag){
            case "select": 
                if(options) {console.log(this.obj, label, options); this.obj.append(...options);} break; 
        }
        
        if(event){ this.obj.addEventListener(event.type, event.func) }

        if(label){
            const input = this.obj;
            this.input = input
            const container = new TAG_HTML("div").class(["model-input-select"]).obj
            const name_input = new TAG_HTML("label").props({textContent: label}).obj
            container.append(name_input, input)
            this.obj = container
        }
        if(regex){
            this.input.addEventListener("blur", ()=>{
                const correct = regex.test(this.input.value);
                const color = correct ? SELECT.style("--light-blue") : "red";
                this.input.style.borderBottom = "1px solid "+color;
            })
        }

        if(choices){ this.load(choices) }
    }

    async load(choices:ConfigInputChoices):HTMLElement[]{
        const data = await choices.conn()
        console.log(data)
        const texts = new Map<string, int>();
        data.map((e:any)=>texts.set(e[choices.name_column], e.id))
        const options = Array.from(texts).map(([text, id])=>new Option(text, String(id)))
        this.input.append(...options)
    }
}
