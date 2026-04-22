type ConfigCardForm = {
    conn: (data:object)=>Promise<void>;
    title: string;
    model: ConfigModelTypes;
    inputs: MyInput[]
}

type ConfigCardProps = {
    parent: HTMLElement;
    title: string;
    form?: ConfigCardForm;
}

class Card {
    parent: HTMLElement;
    obj = new TAG_HTML("div").class(["card", "card-details"]).attr({colorschema:"dark"}).obj;
    
    title: string;
    form: ConfigCardForm | undefined;

    header = new TAG_HTML("header").obj
    main = new TAG_HTML("main").obj
    footer = new TAG_HTML("footer").obj

    constructor({parent, title, form }: ConfigCardProps){
        parent.append(this.obj);
        this.title = title;
        this.form = form;
        this.obj.append(this.header, this.main, this.footer);
        this.title = new TAG_HTML("span").class(["card-details-title"]).props({textContent: this.title}).attr({colorschema:"dark"}).obj
        this.header.append(this.title)
        
    }

    class(classes){
        this.obj.classList.add(...classes)
    }
}
