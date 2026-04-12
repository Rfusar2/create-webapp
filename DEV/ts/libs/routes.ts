class Routes {
    main = SELECT.one("#page");
    db = DATABASE
    render = RENDER

    intervalPolling = 5 * 1000

    init(_class: string){
        this.main.className = "";
        this.main.innerHTML = "";
        this.main.classList.add(_class);
    }

    async loadDB(){
        await this.db.refresh();
        setInterval(this.db.refresh, this.intervalPolling);
    }

    async testasyncvalue(){
        this.init("page-home");
        await this.loadDB()

        const [s1, s2] = ["section", "section"].map((e:string)=>new TAG_HTML(e).obj);
        this.main.append(s1, s2);
        s1.id = "home-section1"

        let text = this.db.tables.example.length;
        const span = new TAG_HTML("span").props({textContent: String(text)}).obj
        s1.append(span);
        this.render.add({ id:"testo",  element: span });

        setInterval(async ()=>{
            text = this.db.tables.example.length;
            this.render.update("testo", String(text));

        }, this.intervalPolling);
    }
    
    async testasynctable(){
        this.init("page-progetti");
        await this.loadDB()

        const table = new Table({
            e: new TAG_HTML("div").class(["table"]).obj,
            parent: this.main,
            title: "Data",
            dimension: "small",
            style: "simple",
            tools: {n_rows:false, n_pag:false, settings:false, search:false},
            ths: [
                ["id", ""],
                ["name", "NOME"],
            ],
            conn: async ()=>{
                return this.db.tables.example;
            }
        })

        setInterval(async ()=>{
            console.log(this.db)
            await this.db.load("example")
            table.table.data = this.db.tables.example
            table.table.setContent(false, {name: "n_pag", value: String(0)});

        }, this.intervalPolling);
    }

    async testmodelupdate(){
        this.init("page-one-element")

        const style = {
            border: "1px solid #fff2",
            width: "80%",
            height: "100%",
        }

        const [btn1, btn2, btn3, btn4] = [
            ["button", "model-large"], 
            ["button", "model-medium"],
            ["button", "model-small"],
            ["button", "model-right"],
        ].map((e:string)=>new TAG_HTML(e[0]).class(["btn", "btn-primary"]).props({textContent: e[1]}).obj);
        this.main.append(btn1, btn2, btn3, btn4);

        btn1.addEventListener("click", ()=>{
            new Model({
                type: "center",
                title: "MODELLO LARGE",
                dimension: "large",
                custom: async (model)=>{
                    const [s1, s2] = ["section", "section"].map((e:string)=>new TAG_HTML(e).obj)
                    model.main.append(s1, s2)

                    Object.assign(s1.style, style)
                    Object.assign(s2.style, style)
                }
            })
        })
        btn2.addEventListener("click", ()=>{
            new Model({
                type: "center",
                title: "MODELLO MEDIUM",
                dimension: "medium",
                custom: async(model)=>{
                    const [s1, s2] = ["section", "section"].map((e:string)=>new TAG_HTML(e).obj)
                    model.main.append(s1, s2)

                    Object.assign(s1.style, style)
                    Object.assign(s2.style, style)
                }
            })
        })
        btn3.addEventListener("click", ()=>{
            new Model({
                type: "center",
                title: "MODELLO SMALL",
                dimension: "small",
                custom: async(model)=>{
                    const [s1, s2] = ["section", "section"].map((e:string)=>new TAG_HTML(e).obj)
                    model.main.append(s1)

                    Object.assign(s1.style, style)
                    Object.assign(s2.style, style)
                }
            })
        })
        btn4.addEventListener("click", ()=>{
            new Model({
                type: "right",
                title: "MODELLO RIGHT",
                dimension: "small",
                custom: async(model)=>{
                    const [s1, s2] = ["section", "section"].map((e:string)=>new TAG_HTML(e).obj)
                    model.main.append(s1, s2)

                    Object.assign(s1.style, style)
                    Object.assign(s2.style, style)
                }
            })
        })

    }

    async playwithinput(){
        this.init("page-full")

        new UserPromptPage(this.main)

    }

    async testaudio(){
        this.init("page-full")

        //BASE
        //const container = new TAG_HTML("div").class(["card-container"]).obj;
        //const audio = new TAG_HTML("audio").props({controls:true}).obj;
        //const source = new TAG_HTML("source").props({type:"audio/mpeg", src:"static/etc/idea8.mp3.mpeg"}).obj;
        //audio.append(source);
        //container.append(audio);
        //this.main.append(container);
        const [s1, s2]  = ["section", "section"].map((e:string)=>new TAG_HTML(e).obj)
        this.main.append(s1, s2)

        const createRow = ()=>{
            const box = new TAG_HTML("div").obj
            Object.assign(box.style, {
                display: "flex",
                flexDircetion: "column";
                gap: "20px";
            })
            
            const [d1, d2] = ["div", "div"].map((e:string)=>new TAG_HTML(e).obj)
            const audio = new TAG_HTML("audio").props({src: "static/etc/idea8.mp3.mpeg"}).obj;
            const btn1 = new TAG_HTML("div").class(["btn", "btn-primary"]).obj;
            btn1.setAttribute("play", "false")
            const icon = new TAG_HTML("i").class(["fa-solid", "fa-play"]).obj;
            btn1.append(icon)
            d1.append(btn1)
            const range = new TAG_HTML("input").props({type:"range", min: "0", max:"100", value:"0"}).obj
            d2.append(range)
            Object.assign(range.style, {
                width: "100%",
            })
            Object.assign(d2.style, {
                display: "flex",
                justifyContent: "center",
            })
            

            box.append(audio, d2, d1)
            s1.append(box)

            btn1.addEventListener("click", ()=>{
                if (audio.paused) {
                    audio.play();
                    icon.classList = ""
                    icon.classList.add("fa-solid", "fa-stop")
                } else {
                    audio.pause();
                    icon.classList = ""
                    icon.classList.add("fa-solid", "fa-play")
                }
            })
            audio.addEventListener('timeupdate', () => {
              range.value = (audio.currentTime / audio.duration) * 100;
            });
            
            range.addEventListener('input', () => {
              audio.currentTime = (range.value / 100) * audio.duration;
            });

        }
         
        for(let i = 0; i < 10; i++){ createRow() }
        
        
        Object.assign(this.main.style, {
            display: "grid",
            gridTemplateColumns: "50% 50%",
        })
        Object.assign(s1.style, {
            display: "flex",
            flexDirection: "column",
            gap: "20px";
        })
        


    }
}
