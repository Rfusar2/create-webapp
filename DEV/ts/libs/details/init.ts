type ConfigCardDetailsInputProps = {
    label: string;
    tag: string;
}

type ConfigCardDetailsSection = {
    title: string;
    inputs: ConfigCardDetailsInput[];
}

type ConfigCardDetailsProps = {
    parent: HTMLElement;
    title: string;
    sections: ConfigCardDetailsSection[];
}

class CardDetails {
    obj = new TAG_HTML("main").id("card-datails-record").obj;
    header = new TAG_HTML("header").obj;
    main = new TAG_HTML("main").obj;

    constructor({parent, title}: ConfigCardDetailsProps){
        this.obj.append(this.header, this.main)
        parent.append(this.obj)

        const [h_box1, h_box2] = ["div", "div"].map((e:string)=>new TAG_HTML(e).obj)
        this.header.append(h_box1, h_box2)

        const h1 = new TAG_HTML("h1").props({textContent: title})
        h_box1.append(h1)




    }
}
