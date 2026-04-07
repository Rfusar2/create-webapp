
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
                                    let res = await fetch("/db/documents/get", {method:"GET"})
                                    return await res.json()
                                },
                                name_column: "nDocuments"
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

    async progetti(){
        this.init("page-progetti");

        await this.db.ready;
        const record = this.db.tables.documents[0] //record simulato

        const [s1, s2] = ["section", "section"].map((e:string)=>new TAG_HTML(e).obj);
        this.main.append(s1, s2);

        const typeDoc = record.type == "LUCE" ? "LUCE" : "GAS" 
        const otherType = typeDoc == "LUCE" ? "GAS" : "LUCE"

        const options_status_document = []
        options_status_document.push(new Option(record.status.toUpperCase(), record.status))

        options_status_document.push(...["attivo", "in scadenza", "scaduto"]
            .filter((e:string)=> e!==record.status )
            .map((e:string)=> new Option(e.toUpperCase(), e))
        )

        console.log(record.billing)


        new CardDetails({
            parent: s1,
            title: "",
            conn: async(e)=>{
                e.preventDefault()
                let res = await fetch("/db/documents/get")
                console.log(await res.text())
            },
            sections: [
                {
                    title: "", 
                    inputs: [
                        new MyInput({
                            tag: "select",
                            label: "Tipologia",
                            options: [new Option(typeDoc, typeDoc), new Option(otherType, otherType)],
                        }),
                        new MyInput({
                            tag: "select",
                            label: "Status",
                            options: options_status_document,
                            props: {},
                        }),
                    ]
                },
                {
                    title: "Dettaglio", 
                    inputs: [
                        new MyInput({
                            label: "Numero Bolletta", value: record.nDocument
                        }),
                        new MyInput({
                            label: "Data Emissione", value: record.issueDate
                        }),
                        new MyInput({
                            label: "Descrizione", value: record.description
                        }),
                        new MyInput({
                            label: "Durata Fornitura", value: record.typeProviding
                        }),
                        new MyInput({
                            label: "Totale Importo", value: record.totalAmount
                        }),
                        new MyInput({
                            label: "Scadenza", value: record.expirationDate
                        }),
                        new MyInput({
                            label: "Consumo", value: `${record.consumption} ${record.unitOfMeasurement}`
                        }),
                        new MyInput({
                            label: "Consumo Annuo", value: `${record.annualConsumption} ${record.unitOfMeasurement}`
                        }),
                        new MyInput({
                            label: "Periodo Di Consumo", value: record.consumptionPeriod
                        }),
                        new MyInput({
                            label: record.identificationType, value: record.identificationValue
                        }),
                    ]
                },
                {
                    title: "Anagrafica Cliente",
                    inputs: [
                        new MyInput({
                            regex: /[a-zA-Z]{1,50}/,
                            label: "Nome",
                            value: record.customer.name,
                        }),
                        new MyInput({
                            regex: /[a-zA-Z]{1,50}/,
                            label: "Cognome" ,
                            value: record.customer.surname,
                        }),
                        //TODO fare regex
                        new MyInput({
                            regex: /[a-zA-Z]/,
                            label: "Codice Fiscale" ,
                            value: record.customer.taxId,
                        }),
                        new MyInput({
                            regex: /[a-zA-Z ]{1,100}/,
                            label: "Via",
                            value: record.customer.address.street,
                        }),
                        new MyInput({
                            regex: /[0-9]{1,7}/,
                            label: "Civico" ,
                            value: record.customer.address.civic,
                        }),
                        new MyInput({
                            regex: /[0-9]{5}/,
                            label: "Codice Postale" ,
                            value: record.customer.address.zipcode,
                        }),
                        new MyInput({
                            regex: /[a-zA-Z ]{1,70}/,
                            label: "Città" ,
                            value: record.customer.address.city,
                        }),
                        new MyInput({
                            regex: /[A-Z]{2}/,
                            label: "Provincia" ,
                            value: record.customer.address.province,
                        }),
                    ]
                },
                {
                    title: "Fatturazione", 
                    inputs: [
                        new MyInput({
                            regex: /[a-zA-Z ]{1,100}/,
                            label: "Via",
                            value: record.billing.address.street,
                        }),
                        new MyInput({
                            regex: /[0-9]{1,7}/,
                            label: "Civico" ,
                            value: record.billing.address.civic,
                        }),
                        new MyInput({
                            regex: /[0-9]{5}/,
                            label: "Codice Postale" ,
                            value: record.billing.address.zipcode,
                        }),
                        new MyInput({
                            regex: /[a-zA-Z ]{1,70}/,
                            label: "Città" ,
                            value: record.billing.address.city,
                        }),
                        new MyInput({
                            regex: /[A-Z]{2}/,
                            label: "Provincia" ,
                            value: record.billing.address.province,
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
