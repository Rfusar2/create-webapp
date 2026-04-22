type ConfigCardProps = {
    parent: HTMLElement;
    title: string;
}

class Card {
    parent: HTMLElement;
    obj = new TAG_HTML("div").class(["card", "card-details"]).attr({colorschema:"dark"}).obj;
    
    title: string;

    header = new TAG_HTML("header").obj
    main = new TAG_HTML("main").obj
    footer = new TAG_HTML("footer").obj

    constructor({parent, title }: ConfigCardProps){
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
