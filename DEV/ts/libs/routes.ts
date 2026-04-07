
class Routes {
    main = SELECT.one("#page");
    db = DATABASE

    init(_class: string){
        this.main.className = "";
        this.main.innerHTML = "";
        this.main.classList.add(_class);
    }

    async dashboard(){
        this.init("page-listino");
        const [s1, s2] = ["section", "section"].map((e:string)=>new TAG_HTML(e).obj);
        this.main.append(s1, s2);
        s1.id = "home-section1"

        //*QUERY DB
        await this.db.ready;

        const cards = [
            {
                title: "test1",
                content: "5",
                router: "progetti"
            },
            {
                title: "test2",
                content: "9",
                form: {
                    model: ConfigModelTypes.CENTER,
                    inputs: [
                        new MyInput({
                            tag: "select",
                            label: "Customer",
                            props: {name: "customer-name"},
                            choices: {
                                conn: async ()=>{
                                    let res = await fetch("/db/customers/get", {method:"GET"})
                                    return await res.json()
                                },
                                name_column: "name"
                            }

                        }),
                        new MyInput({
                            props: {placeholder: "Name", name: "customer-name"},
                            regex: /[0-9]/,
                        }),
                    ]
                }
            }
        ]

        //TO SCREEN
        for(const card of cards){
            new Card({
                parent: s1,
                title: card.title,
                style: ConfigCardStyle.PRIMARY,
                content: card.content,
                view: true,
                router: card.router,
                form: card.form,
            })

        }



    }

    progetti(){
        this.init("page-progetti");

        const [s1, s2] = ["section", "section"].map((e:string)=>new TAG_HTML(e).obj);
        this.main.append(s1, s2);
        s1.id = "home-section1"

        new CardDetails({
            parent: s1,
            title: "Bolletta",
            sections: [
                {
                    title: "Dettaglio", 
                    inputs: [
                        new MyInput({
                            tag: "select",
                            label: "Tipologia",
                            options: [new Option("LUCE", "0"), new Option("GAS", "1")],
                        }),
                        new MyInput({
                            label: "Numero Bolletta",
                        }),
                        new MyInput({
                            label: "Data Emissione",
                        }),
                        new MyInput({
                            label: "Descrizione",
                        }),
                        new MyInput({
                            label: "Durata Fornitura",
                        }),
                        new MyInput({
                            label: "Totale Importo",
                        }),
                        new MyInput({
                            label: "Scadenza",
                        }),
                        new MyInput({
                            tag: "select",
                            label: "Status",
                            options: [new Option("ATTIVO", "0"),new Option("IN SCADENZA", "1"),new Option("SCADUTO", "2")],
                            props: {},
                        }),
                    ]
                },
                {
                    title: "Anagrafica Cliente",
                    inputs: [
                        new MyInput({
                            regex: /[a-zA-Z]{1,50}/,
                            label: "Nome",
                            event:
                                type:"blur",
                                func: (e)=>{

                                }
                        }),
                        new MyInput({
                            regex: /[a-zA-Z]{1,50}/,
                            label: "Cognome" ,
                        }),
                        //TODO fare regex
                        new MyInput({
                            regex: /[a-zA-Z]/,
                            label: "Codice Fiscale" ,
                        }),
                        new MyInput({
                            regex: /[a-zA-Z ]{1,100}/,
                            label: "Via",
                        }),
                        new MyInput({
                            regex: /[0-9]{1,7}/,
                            label: "Civico" ,
                        }),
                        new MyInput({
                            regex: /[0-9]{5}/,
                            label: "Codice Postale" ,
                        }),
                        new MyInput({
                            regex: /[a-zA-Z ]{1,70}/,
                            label: "Città" ,
                        }),
                        new MyInput({
                            regex: /[A-Z]{2}/,
                            label: "Provincia" ,
                        }),
                    ]
                },
                {
                    title: "Fatturazione", 
                    inputs: [
                        new MyInput({
                            regex: /[a-zA-XZ]/,
                            label: "Luogo di fatturazione",
                        }),
                        new MyInput({
                            regex: /[a-zA-XZ]/,
                            label: "Luogo di fatturazione",
                        }),
                    ]
                }
            ]
        })


        //new Table({
        //    e: new TAG_HTML("table").class(["table"]).obj,
        //    parent: s2,
        //    title: "Customer",
        //    dimension: "small",
        //    style: "simple",
        //    tools: {n_rows: true, search:true, n_pag:false, settings:false},
        //    ths: ["id", "name"],
        //    conn: async()=>{
        //        let res = await fetch("/db/customers/get", {method: "GET"})
        //        return await res.json()
        //    }
        //})
    }
}
