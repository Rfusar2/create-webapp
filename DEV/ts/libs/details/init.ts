type ConfigCardDetailsSection = {
    title: string;
    inputs: MyInput[];
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

    constructor({parent, title, sections}: ConfigCardDetailsProps){
        this.obj.append(this.header, this.main)
        parent.append(this.obj)

        const [h_box1, h_box2] = ["div", "div"].map((e:string)=>new TAG_HTML(e).obj)
        this.header.append(h_box1, h_box2)

        const h1 = new TAG_HTML("h1").props({textContent: title}).obj
        h_box1.append(h1)

        for(const s of sections){
            const container = new TAG_HTML("section").obj
            const [b1, b2] = ["div", "div"].map((e:string)=>new TAG_HTML(e).obj)
            b1.append(
                new TAG_HTML("h3").props({textContent: s.title}).obj
            )
            for(const input of s.inputs){ b2.append(input.obj) }

            container.append(b1, b2)
            this.main.append(container)
        }

        


    }
}
