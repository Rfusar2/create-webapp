package main 

//*FRONTEND
const (
	FRONTEND_INPUT_TS = `
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
}`

	FRONTEND_ASIDE_TS = `
type RouteName = "project"

type AsideItem = {
    text: string;
    href: string;
}

const LINKS_ASIDE: AsideItem[] = [
    {text: "Home", href: "#",},
] 


class Sidebar{
    items = LINKS_ASIDE;
    routes = new Routes();
    obj = SELECT.one("#sidebar");
    header = SELECT.one("header");
    list_items = SELECT.one("#container-aside-items");
    container_list_items: HTMLElement;
    item_type: Node;

    constructor(){
        this.container_list_items = this.obj.querySelector("section") as HTMLElement;

        this.getHeader();

        const item_type = SELECT.one(".aside-item");
        this.item_type = item_type.cloneNode(true);
        item_type.remove();

        this.init_items();
        
        //this.getLogout()
        this.setRoutes();
    }
    
    getHeader(){
        const container_logo = new TAG_HTML("div").id("container-logo").obj;
        const logo = new TAG_HTML("img").obj;
        //logo.alt = "Logo"
        container_logo.append(logo);
        const divider = new TAG_HTML("div").class(["divider"]).obj;

        this.header.append(container_logo, divider);
        
    }
    init_items(){
        for(const item of this.items){
            const element = this.item_type.cloneNode(true) as HTMLElement;
            this.style(element);

            const link = element.querySelector("a") as HTMLAnchorElement;
            link.textContent = item.text;
            link.href = item.href;

            this.list_items.append(element);
        }
    }
    
    setRoutes(){
        const routes_names = this.items.filter((item)=>item.href=="#").map(e=>e.text);
        for(const item of this.list_items.childNodes){
            item.addEventListener("click", ()=>{
                const route = item.textContent!.replaceAll(" ", "").toLowerCase().trim() as RouteName
                this.routes[route]()
            });
        }
    }
    style(e:HTMLElement){
        e.addEventListener("mouseover", ()=>{
            const circle = e.querySelector(".circle") as HTMLElement
            const link = e.querySelector("a") as HTMLAnchorElement

            circle.style.background = SELECT.style("--light-blue");
            link.style.transform = "translateX(5px)";
        })
        e.addEventListener("mouseout", ()=>{
            const circle = e.querySelector(".circle") as HTMLElement
            const link = e.querySelector("a") as HTMLAnchorElement
            circle.style.background = "transparent";
            link.style.transform = "translateX(0)";
        })

        e.addEventListener("click", ()=>{
            for(const item of SELECT.all(".aside-item")){
                item.setAttribute("active", "false");
            }
            e.setAttribute("active", "true");
        })
    }
}

new Sidebar()`
	FRONTEND_ASIDE_CSS = `
#sidebar {
    display: grid;
    grid-template-rows: 10% 90%;
    width: var(--width-sidebar);
    background: var(--bg-card);
    border-right: 1px solid #fff2;
}
#sidebar > header {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-rows: 50% 50%;
}
.divider {
    border-bottom: 1px solid #fff1;
    margin: 0px 20px;

}


#container-aside-items{
    display: flex;
    gap: 25px;
    flex-direction: column;
    margin-top: 20px;
}
.aside-item {
    display: grid;
    grid-template-columns: 30% 70%;
    width: 80%;
    cursor: pointer;
}

.container-circle{
    position: relative;
}

.circle {
    position: absolute;
    border-radius: 50%;
    padding: 5px;
    top: 3px;
    right: 10px;
    transition: 300ms;
}

a {
    display: block;
    text-decoration: none;
    transition: 300ms;
}

#sidebar > section > footer {
    height: 30%;
}

#logout {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

#logout > a {
    border-radius: 50%;
    padding: 10px;
    background: var(--error);
    cursor: pointer;
}

.aside-item[active=true] {
    border-right: 1px solid var(--light-blue);
}`

	FRONTEND_CARDS_SIMPLE_TS = `
	enum ConfigCardStyle {
    PRIMARY,
    ERROR,
    SUCCESS
}

type ConfigCardForm = {
    conn: (data:object)=>Promise<void>;
    title: string;
    model: ConfigModelTypes;
    inputs: ConfigModelInput[]
}

type ConfigCardProps = {
    parent: HTMLElement;
    title: string;
    style: ConfigCardStyle;
    content: string;
    note?: string;
    view: boolean;
    form?: ConfigCardForm;
    router?: string;
}

class Card {
    parent: HTMLElement;
    obj = new TAG_HTML("div").class(["card", "card-details"]).attr({colorschema:"dark"}).obj;
    btn_add = new TAG_HTML("button").class(["btn", "btn-primary", "btn-card-add"]).props({textContent: "+"}).obj;
    btn_change_page = new TAG_HTML("button").class(["btn", "btn-warning", "btn-card-changepage"]).props({textContent: "?"}).obj;
    
    title: string;
    style: ConfigCardStyle;
    content: string;
    note: string | undefined;
    form: ConfigCardForm | undefined;
    router: string | undefined;

    constructor({parent, title, style, content, note, view, form, router}: ConfigCardProps){
        this.parent = parent;
        this.parent.append(this.obj);
        this.obj.style.visibility = view ? "visible" : "hidden"
        this.title = title;
        this.style = style;
        this.content = content;
        this.note = note;
        this.form = form;
        this.router = router;

        this.init();
        this.getEvents();
    }

    init(){
        const [header, main, footer] = [ "header", "main", "footer"].map((e:string)=>new TAG_HTML(e).obj)
        this.obj.append(header, main, footer);

        //HEADER
        const title = new TAG_HTML("span").class(["card-details-title"]).props({textContent: this.title}).attr({colorschema:"dark"}).obj
        header.append(title)

        if(this.form){ header.append(this.btn_add) };
        
        //MAIN
        const main_containers = ["div", "div"].map((e:string)=>new TAG_HTML(e).obj);
        main_containers[1].append(
            new TAG_HTML("span").class(["card-details-content"]).props({textContent: this.content}).attr({colorschema:"dark"}).obj
        )
        main.append(...main_containers);
        
        //FOOTER
        if(this.note){
            const note = new TAG_HTML("span").class(["card-details-note"]).props({textContent: this.note}).attr({colorschema:"dark"}).obj;
            footer.append(note);
        }
        if(this.router){ footer.append(this.btn_change_page) };
    }

    getEvents(){
        if(this.form){
            this.btn_add.addEventListener("click", ()=>{
                new Model({
                    conn: this.form!.conn,
                    type: this.form!.model,
                    title: this.form!.title,
                    inputs: this.form!.inputs
                })
            })
        }
        if(this.router){
            this.btn_change_page.addEventListener("click", ()=>{
                new Routes()[this.router]()

            })
        }

    }
}`
	FRONTEND_CARDS_SIMPLE_CSS = `
.card {
    border-radius: 3px;
    box-shadow: 1px 2px 2px #0002;
}

.card[data-colorschema="light"]{background: #fff9;border: 1px solid #0002}
.card[data-colorschema="dark"]{background: var(--bg-card);border: 1px solid #fff2;}

.card-details-content[data-colorschema="light"]{color: #0008;}
.card-details-content[data-colorschema="dark"] {color: #fff8;}

.card-details-note[data-colorschema="light"] {color: #0004}
.card-details-title[data-colorschema="light"] {color: #0004;}

.card-details-note[data-colorschema="dark"] {color: #fff4;}
.card-details-title[data-colorschema="dark"] {color:#fff8;}

.card-details {
    width: 23%;
    display: grid;
    grid-template-rows: 30% 50% 20%;
}

.card-details > header {
    position: relative;
    padding: 10px;
}
.card-details > main {
    position: relative;
    padding: 10px;
    display: grid;
    grid-template-columns: 30% 70%;
}
.card-details > footer {
    position: relative;
    padding-right: 10px;
    text-align: right;
    font-size: .7rem;
}

.card-details-title {
    font-size: .7rem;
    font-weight: 600;
}
.card-details-content {
    font-size: 2rem;
    font-weight: 700;
}
.card-details-note {
    font-size: .6rem;
    font-weight: 500;
}

.card .btn-card-add {
    position:absolute;
    top:15px;
    right: 15px;
}
.card .btn-card-changepage {
    position:absolute;
    bottom:15px;
    right: 15px;
}`
	
	FRONTEND_CHART_TS = `
type ConfigChartProps = {
    parent: HTMLElement;
    n_docs_luce: number;
    n_docs_gas: number;
}


class MyChart {
    card = new TAG_HTML("div").class(["card-chart-pie"]).attr({colorschema:"dark"}).obj;
    container_chart = new TAG_HTML("div").id("chart-container").obj;
    element_chart = new TAG_HTML("div").id("chart").obj;

    chart: any;
    constructor({parent, n_docs_luce, n_docs_gas}: ConfigChartProps){
        this.container_chart.append(this.element_chart);
        this.card.append(this.container_chart);
        parent.append(this.card)
        
        this.chart = anychart.pie(this.config(n_docs_luce, n_docs_gas)); // CDN Esterna
        this.chart.container("chart");
        this.chart.background("transparent");
        this.chart.innerRadius("70%");
        this.chart.labels().position("inside");
        this.chart.insideLabelsOffset("-95%");
        this.chart.labels(false);

        this.setLegend();
        this.setToolTip();

        this.chart.draw();
        SELECT.one("#chart")!.querySelector("div a")!.remove();

        this.setDetails()
    }

    setDetails(){
        const container_details = new TAG_HTML("div").obj;
        this.card.append(container_details);
    }


    setLegend(){
        //TODO da inserire nell'evento di cambio colorschema
        const legend = this.chart.legend()
        legend.position('right');
        legend.itemsLayout('vertical');
        legend.align('top');
        legend.fontColor("#fff9");
        legend.fontSize("12px");
        
        //legend.useHtml(true)
        //legend.itemsFormat(function() {
        //  var date = anychart.format.dateTime(this.value, "dd MMMM yyyy");
        //  return "<span style='color:#455a64;font-weight:600'>DATE: " +
        //         date + "</span>";
        //});
    }

    setToolTip(){
        const tooltip = this.chart.tooltip()
        tooltip.background("#000");
        tooltip.fontColor("#fff");
    }

    
    config(n_docs_luce:number, n_docs_gas:number){
        const color_luce = SELECT.style("--get-pro")
        const color_gas = SELECT.style("--light-blue");
         return [
          {x: "LUCE", value: n_docs_luce,
           normal:  {
              fill: color_luce,
           },
           hovered: {
              fill: color_luce,
              outline: {
                enabled: false,
                stroke: null
              }
           },
           selected: {
              outline: {
                enabled: true,
                width: 6,
                fill: color_luce,
                stroke: null
              }
           }
          },
          {x: "GAS", value: n_docs_gas,
           normal:  {fill: color_gas},
           hovered: {
              fill: color_gas,
              outline: {
                enabled: false,
                stroke: null
              }
           },
           selected: {
              outline: {
                enabled: true,
                width: 6,
                fill: color_gas,
                stroke: null
              }
           }
          }
        ];
    }
}`
	FRONTEND_CHART_CSS = `
#card-chart-pie{
}
#chart-container{
}

#chart{
}

#card-chart-pie[data-colorschema="dark"]{background: var(--bg-card);}
#card-chart-pie[data-colorschema="light"]{background: #fff;}`
	
	FRONTEND_MODELS_TS = `
enum ConfigModelTypes {
    CENTER,
    RIGHT
}

type ConfigModelProps = {
    conn: (data:object)=>Promise<void>;
    type: ConfigModelTypes;
    title: string;
    inputs: MyInput[];
}

class ConfigModel {
    conn: (data:object)=>Promise<void>;
    type: ConfigModelTypes;
    title: string;
    inputs: MyInput[];
    constructor({conn, type, title, inputs}: ConfigModelProps){
        this.conn = conn
        this.type = type
        this.title = title,
        this.inputs = inputs
    }
};


class Model {
    settings: ConfigModel;
    max_inputs = 9;
    container: HTMLElement;
    container_inputs = new TAG_HTML("main").obj;
    obj: HTMLElement;
    _type: string;
    inputs: HTMLElement[] = [];

    header = new TAG_HTML("header").obj;
    footer = new TAG_HTML("footer").obj;
    btn_close = new TAG_HTML("button").id("btn-close").props({textContent: "Cancella"}).obj;
    btn_send = new TAG_HTML("button").id("btn-send").props({textContent: "Conferma"}).obj;


    constructor(settings:ConfigModelProps){
        this.settings = new ConfigModel(settings);
        
        switch(this.settings.type){
            case ConfigModelTypes.RIGHT: this._type = "right";break;
            case ConfigModelTypes.CENTER: this._type="center";break;
        }

        this.container = this.createSfondo();
        this.obj = this.createModel();

        this.getEvents();
        //this.close(true, 1000 * 60)
    }

    createSfondo():HTMLElement{
        const container = new TAG_HTML("div")
            .id("sfondo-model-"+this._type)
            .class(["sfondo-model"]).obj;
        
        switch(this._type){
            case "right": container.append(new TAG_HTML("div").obj); break;
            case "center": break;
        }
        

        
        return container;
    }

     createModel():HTMLElement{
        const container = new TAG_HTML("form").id("container-model").obj;
        const model = new TAG_HTML("div").id("model-"+this._type).class(["model"]).obj;

        container.append(model);
        this.container.append(container);
        this.configModel(model);

        document.body.prepend(this.container);
        return model;
     }

    configModel(model:HTMLElement){
        const title = new TAG_HTML("h1").props({textContent: this.settings.title}).obj;
        this.header.append(title);
        this.loadInputs();
        this.createBtns();

        model.append(this.header, this.container_inputs, this.footer);
    }

    loadInputs(){
        const boxies = []
        for(let i = 0; i < this.max_inputs; i++){
            const box = new TAG_HTML("div").class(["model-input-box"]).obj;
            this.container_inputs.append(box);
            boxies.push(box);
        }
        const INPUTS = this.settings.inputs;
        for(let i = 0; i < INPUTS.length; i++){
            const outOfRange = i >= this.max_inputs-1;
            if(outOfRange) { break; }
            this.inputs.push(INPUTS[i].input);
            boxies[i].append(INPUTS[i].obj);
        }
    }

    createBtns(){
        const container = new TAG_HTML("div").id("model-container-btns-"+this._type).obj;
        
        container.append(this.btn_close, this.btn_send);
        this.footer.append(container);
    }

    getEvents(){
        this.btn_send.addEventListener("click", async(e)=>{
            e.preventDefault()
            this.settings.conn(this.inputs)
        });

        this.btn_close.addEventListener("click", (e)=>{e.preventDefault();this.close(false)});
    }

    close(background=true, timeout=3000){
        if(background) { 
            setTimeout(()=>this.container.remove(), timeout);
            return;
        }   
        this.container.remove();
    }
}`
	FRONTEND_MODELS_CSS = `
:root{
    --get-pro: #0FFC03;
}

@keyframes model-right {
   from { transform: translateX(100%); }
    to   { transform: translateX(0); }
}
@keyframes model-center {
   from { opacity: 0; } 
    to   { opacity: 1; }
}

.sfondo-model {
    position: fixed;
    inset: 0;
    z-index: 2147483647;
    background: #0005;
}

#container-model {
    position: relative;
}


.model {
    background: var(--bg-card);
    display: grid;
    grid-template-rows: 20% 60% 20%;
}


.model > header {
    display: flex;
    justify-content: center;
    align-items: center;
}

.model h1 {
    padding-bottom: 5px;
    border-bottom: 1px solid var(--light-blue);
}

.model > main {
    width: 85%;
    display: flex;
    gap: 30px;
    flex-direction: column;
    padding: 20px 0px 0px 20px;
}

.model-input-box > input {
    color: var(--color-text);
    background: transparent;
    border:none;
    border-bottom: 1px solid var(--light-blue);
    outline: none;
    padding: 5px;
}

.model > footer {
    position: relative;
    width: 85%;
}

#btn-close {
    border: 1px solid var(--light-blue);
    color: var(--light-blue);
}
#btn-send {
    border: 1px solid var(--get-pro);
    color: var(--get-pro)
}
#btn-close:hover {
    border: none;
    color: #fff;
    background: var(--light-blue);
}
#btn-send:hover {
    border: none;
    color: #fff;
    background: var(--get-pro);
}
#btn-close, #btn-send {
    border-radius: 10px;
    background: transparent;
    transition: 300ms;
    cursor: pointer;
}


/*MODEL RIGHT*/
#sfondo-model-right {
    display: grid;
    grid-template-columns: 70% 30%;
}

#model-right {
    position: absolute;
    width: 100%;
    height: 100%;
    transform: translateX(100%);
    border-left: 1px solid #fff2;
    animation: model-right 500ms ease forwards;
}

#model-container-btns-right{
    display: grid;
    grid-template-columns: 50% 50%;
    position: absolute;
    bottom: 30px;
    width: 100%;
    height: 40px;
    gap: 30px;
    padding: 20px;
}

/*MODEL CENTER*/
#sfondo-model-center {
    display: flex;
    justify-content: center;
    align-items: center;
}

#model-center {
    width: 750px;
    height: 400px;
    animation: model-center 500ms ease forwards;
    border: 1px solid #fff2;
    box-shadow: 2px 4px 6px #0004;
    border-radius: 7px;
}


#model-center  > main {
    display: grid;
    grid-template-columns: 33% 34% 33%;
}

#model-container-btns-center{
    display: grid;
    grid-template-columns: 50% 50%;
    position: absolute;
    bottom: 30px;
    width: 100%;
    height: 40px;
    gap: 30px;
    padding: 20px;
}

.model-input-select > label {

}
.model-input-select > select {
    margin-left: 20px;
    color: #fff;
    background: var(--bg-card);
    border: 1px solid #fff2;
    border-radius: 5px;
    padding: 5px;
    outline: none;
}

.model-input-select > select > option {
    color: #fff;
    background: var(--bg-card);
}`

	FRONTEND_NAV_TS = `
type ColorSchema = "light" | "dark";

class Navbar {
    obj = SELECT.one("#nav");
    btns: HTMLElement[];
    colorschema: ColorSchema = "dark";


    constructor(){
        const [s1, s2] = ["section", "section"].map((e:string)=>new TAG_HTML(e).class(["navbar-section"]).attr({colorschema: "dark"}).obj)
        this.obj.append(s1, s2);

        this.btns = ["settings", "colorschema", "logout"].map((e:string)=>this.init_btn(e).attr({colorschema:"dark"}).obj);
        const container_btns = new TAG_HTML("div").id("container-btns-navbar").obj
        container_btns.append(...this.btns);
        s1.append(container_btns);
        
        this.get_events();
    }

    get_events(){
        this.btns[1].addEventListener("click", ()=>{
            const colorschema = this.btns[1].dataset.colorschema == "dark" ? "light" : "dark";
            //SELECT.one("#data-colorschema")!.setAttribute("colorschema", colorschema);

            for(const e of SELECT.all("[data-colorschema]")){ e.dataset.colorschema = colorschema;}//isDark?"dark":"light";}
        })
    }

    //TODO inizializzare btn
    init_btn(type:string):TAG_HTML{
        switch(type){
            case "settings": return new TAG_HTML("i").class(["btn", "fa-solid","fa-gears"]);
            case "colorschema": return new TAG_HTML("i").class(["btn", "fa-solid","fa-circle-half-stroke"]);
            case "logout": return new TAG_HTML("i").class(["btn", "fa-solid","fa-arrow-right-from-bracket"]);
            default: return new TAG_HTML("i");
        }
    }

}


new Navbar();`
	FRONTEND_NAV_CSS = `
#nav {
    height: 60px;
    width: 100%;
    display: flex;
    position:relative;
}

#nav[data-colorschema="dark"]{background: var(--bg-card)}

.navbar-section:nth-child(1) {
    flex:1;
    display:flex;
    justify-content: end;
    align-items: center;
}
.navbar-section:nth-child(2) {
    position: absolute;
    left:0;
}

.navbar-section:nth-child(2)[data-colorschema="dark"] {
    border-left: 1px solid #fff2;
    top:0;
    height: 100%;
}
.navbar-section:nth-child(2)[data-colorschema="light"] {
    border-bottom: 1px solid #0002;
    bottom:0;
    width: 100%;
}

#container-btns-navbar{
    padding-right: 20px;
}

#container-btns-navbar > .btn {
    margin-right: 30px;
}

#container-btns-navbar > .btn[data-colorschema="light"] {
    color: #0008;
}
#container-btns-navbar > .btn[data-colorschema="dark"] {
    color: #fff8;
}`

	FRONTEND_POPUP_TS = `
enum ConfigPopupStatus {
    OK,
    KO
}

type ConfigPopupProps = {
    type: string;
    text: string;
    status: ConfigPopupStatus;
}

class ConfigPopup {
    type: string;
    text: string;
    status: ConfigPopupStatus;

    constructor({ type, text, status }: ConfigPopupProps) {
        this.type = type;
        this.text = text;
        this.status = status;
    }
}


class Popup {
    settings: ConfigPopupProps;
    container = new TAG_HTML("div").id("sfondo-popup").obj;

    constructor(settings: ConfigPopupProps){
        this.settings = new ConfigPopup(settings);

        const popup = new TAG_HTML("main")
            .id("popup-"+this.settings.type)
            .class(["popup"]).obj;
        
        const span = new TAG_HTML("span").obj;

        switch(this.settings.status){
            case ConfigPopupStatus.OK: span.id = "popup-message-ok"; break;
            case ConfigPopupStatus.KO: span.id = "popup-message-ko"; break;
        }

        span.textContent = this.settings.text;
        popup.append(span);

        this.container.prepend(popup);
        document.body.prepend(this.container);

        setTimeout(()=>{ this.container.remove() }, 4000);
    }
}`
	FRONTEND_POPUP_CSS = `
@keyframes view {
    from{opacity: 0; transform: translateY(0%);} 
    to {opacity: 1; transform: translateY(10%);}
}
@keyframes disable {
    from{opacity: 1; transform: translateY(10%);} 
    to {opacity: 0; transform: translateY(0%);}
}

:root{
    --delay: 3s;
}
#sfondo-popup {
    position: fixed;
    inset: 0;
    z-index: 2147483647;
}
.popup{
    width: 250px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: var(--bg-card);
    color: var(--color-text);
    border: 1px solid #fff2;
    box-shadow: 2px 4px 6px #0002;

    border-radius: 5px;
    padding: 30px;
    animation: 
        view 300ms linear forwards, 
        disable 300ms var(--delay) linear forwards;
}

#popup-right {
    position: absolute;
    top: 10px;
    right: 10px;
}
#popup-left {
    position: absolute;
    top: 10px;
    left: 10px;
}




.popup > span {
    padding: 3px 5px;
}

#popup-message-ko {
    border-left: 3px solid red;
}

#popup-message-ok {
    border-left: 3px solid green;
}`

	FRONTEND_TABLES_TS = `
type SettingsTools = {
    n_pag: boolean;
    n_rows: boolean;
    search: boolean;
    settings: boolean;
}
const TAG_ID = "id"
type TableDimension = "small" | "large";
type TableStyle = "simple" | "paging";
type TableFilterColumns = "storehouse" | "orders" | "customers"; //Sperimentale
type TableProps = {
    e: HTMLElement;
    parent:HTMLElement;
    title: string;
    dimension: TableDimension;
    style: TableStyle;
    tools: SettingsTools;
    conn?: ()=>Promise<Data[]>;
    ths: string[];
}
type ContentTableProps = {
    settings: SettingsTools;
    parent: HTMLElement;
    width_columns?: string;
    conn?: ()=>Promise<Data[]>;
}

class SettingsTable {
    tools: SettingsTools;
    constructor(){
        this.tools = {
            n_pag: true,
            n_rows: true,
            search: true,
            settings: true,
        };
    }
}

class HeaderTable {
    filters: SettingsTools;
    obj = new TAG_HTML("header").attr({colorschema:"dark"}).obj;
    containerTools = new TAG_HTML("div").class(["container-tools"]).obj;
    input_set_pag: HTMLInputElement;
    input_set_n_rows: HTMLInputElement;
    input_set_search: HTMLInputElement;
    search: string;
    title: HTMLElement;
    
    constructor(filters: SettingsTools, title_text: string, parent: HTMLElement){
        parent.append(this.obj)
        this.filters = filters;
        
        this.title = new TAG_HTML("h2").class(["table-name"]).props({textContent: title_text}).attr({colorschema:"dark"}).obj;
        this.containerTools.append(this.title);

        this.input_set_search = this.create_setSearch();
        this.input_set_pag = this.create_setPag();
        this.input_set_n_rows = this.create_setRows();
        this.search = this.input_set_search ? this.input_set_search.value : "";

        this.obj.append(this.containerTools)

        this.getEvents();
    }

    create_setPag():HTMLInputElement{
        if(!this.filters.n_pag) return new TAG_HTML("input").obj as HTMLInputElement;

        const input = new TAG_HTML("input")
            .class(["table-func-n-pag"])
            .props({type: "number",placeholder: "n pagina"}).obj as HTMLInputElement;

        this.containerTools.append(input);
        return input;
    }

    create_setRows():HTMLInputElement{
        if(!this.filters.n_rows) return new TAG_HTML("input").obj as HTMLInputElement;
        const input = new TAG_HTML("select").class(["table-func-n-rows"]).obj as HTMLInputElement;
        input.append(
            new Option("10", "10"),
            new Option("25", "25"),
            new Option("50", "50"),
            new Option("100", "100"),
        );
        this.containerTools.append(input);
        return input;
    }
    
    create_setSearch():HTMLInputElement{
        if(!this.filters.search) return new TAG_HTML("input").obj as HTMLInputElement;
        const input = new TAG_HTML("input")
            .class(["table-func-search"])
            .props({type: "text",placeholder: "Search..."}).obj as HTMLInputElement;

        this.containerTools.append(input);
        return input;
    }
    
    getEvents(){
        //this.title.addEventListener("click", ()=>new Model({
        //    type: ConfigModelTypes.RIGHT,
        //    title: "Impostazioni",
        //    inputs: [new TAG_HTML("input").obj as HTMLInputElement ],
        //}));
    }
}

class FooterTable {
    obj = new TAG_HTML("footer").attr({colorschema: "dark"}).obj;
    btn_next = new TAG_HTML("button").obj;
    btn_prec = new TAG_HTML("button").obj;
    span = new TAG_HTML("span").obj;
    n_pag: number;
    n_pages: number;
    view: boolean;
    container_btns = new TAG_HTML("div").obj;
    
    constructor(n_pag:number, n_pages:number){
        this.n_pag = n_pag;
        this.n_pages = n_pages;
        this.view = this.n_pages == 1 ? false :  true;
        if(this.view){this.handlerBtnPages();}
    }
    
    handlerBtnPages(){
        const container = new TAG_HTML("div").class(["container-btn-footer"]).obj;
        
        const btn_next = new TAG_HTML("button").class(["btn-next"]).props({textContent: "Prossima"}).obj;
        const btn_prec = new TAG_HTML("button").class(["btn-prec"]).props({textContent: "Precedente"}).obj;

        const span = new TAG_HTML("span").props({textContent: "1-"+String(this.n_pages)}).obj;

        container.append(btn_prec, span, btn_next);
        this.obj.append(container);

        this.container_btns = container;
        this.btn_next = btn_next;
        this.btn_prec = btn_prec;
        this.span = span;
    }

    setCurrentPage(){
        this.btn_prec.style.opacity = this.n_pag+1 > 1 ? "1" : "0";
        this.span.textContent = String(this.n_pag+1)+"-"+String(this.n_pages);
    }
}

class ContentTable {
    obj = new TAG_HTML("main").class(["container-table-content"]).obj;
    n_pag = 0;
    n_rows = 10;
    search = "";

    thead = new TAG_HTML("div").obj;
    tbody = new TAG_HTML("div").obj;
    //empty_row: Data;
    data: Data[];
    pages: Data[][];
    page: Data[];
    conn?: ()=>Promise<Data[]>;
    //TODO fare enum
    action_names = {
        N_PAG: "n_pag",
        N_ROWS: "n_rows",
        SEARCH: "search",
    };
    ths: string[];
    settings: SettingsTools;
    ready: Promise<void>;

    constructor({settings, parent, width_columns, conn, ths}: ContentTableProps){
        parent.append(this.obj)
        this.settings = settings;
        this.data = [];
        this.pages = [];
        this.page = [];
        this.conn = conn
        this.ths = ths

        this.thead.setAttribute("label", "thead");
        this.tbody.setAttribute("label", "tbody");
        this.obj.append(this.thead, this.tbody);

        this.ready = this.init(parent, width_columns)
    }

    async init(parent, width_columns) {
        await this.toScreenNameColumns()

        this.handlerWidthColumns(parent, width_columns)
        this.setContent(true)
    }

    async handlerWidthColumns(parent:HTMLElement, width_columns:string|undefined){
        //*per adattare il numero di colonne con i dati passsati
        //*nel caso non sia settata la lunghezza delle colonne
        let style = ".row, .table-titles { grid-template-columns: " 
        const addStyle = new TAG_HTML("style").obj
        const ths = this.ths.filter((e:string)=>e!==TAG_ID)

        if(!width_columns){ 
            //const n_columns = Object.keys(this.data[0]).length;
            const n_columns = ths.length;
            const width_table = parent.getBoundingClientRect().width;
            const width_column = Math.floor(width_table / n_columns)-2;
            style+= "repeat("+String(n_columns)+", "+String(width_column)+"px) }"
        }
        else { style+=String(width_columns)+" }"}
        addStyle.textContent = style;
        SELECT.one("head").append(addStyle)
    }

    async toScreenNameColumns(){
        await this.getDBData()
        let riga = new TAG_HTML("div").class(["table-titles"]).obj;
        //for(const th_text of Object.keys(this.data[0])){
        const ths = this.ths.filter((e:string)=>e!==TAG_ID)
        for(const th_text of ths){
            const container_th = new TAG_HTML("div")
                .class(["container-th"])
                .attr({colorschema: "dark"}).obj;

            const th = new TAG_HTML("span").props({textContent: th_text}).obj;
            container_th.append(th);
            riga.append(container_th);
            this.thead.append(riga);
        }
    }

    toScreenBody(){
        this.obj.querySelector('[label="tbody"]')!.innerHTML = "";

        for(let i=0; i < this.page.length; i++){
            const record = this.page[i];
            const riga = new TAG_HTML("div").class([i%2==0 ? "row-0" : "row-1", "row"]).obj;

            for(const [k, v] of Object.entries(record)){
                console.log(record)
                if(k==TAG_ID){
                    riga.setAttribute("record-id", v)
                    continue
                }
                const container_td = new TAG_HTML("div").class(["container-td"]).attr({colorschema: "dark"}).obj;

                const td = new TAG_HTML("span").props({textContent: v}).obj;
                
                //* HANDLER_BADGES
                switch(k.toLowerCase()){
                    case "status": this.fieldStatus(container_td, td);break;
                    default:container_td.append(td);break;
                }

                riga.append(container_td);
                //* HANDLER_EMPTY_ROWS
                //if(v=="dummy-code"){ td.style.opacity = "0"; }
            }        
            this.tbody.append(riga);
        }
    }

    fieldStatus(parent:HTMLElement, target:HTMLElement){
        target.classList.add("badge")
        target.textContent = target.textContent.toUpperCase();
        target.style.fontSize = "10px";
        target.setAttribute("data-colorschema","dark");
        switch(target.textContent.replaceAll(" ", "")){
            case "ATTIVO":target.classList.add("badge-success");break;
            case "SCADUTO":target.classList.add("badge-error");break;
            case "INSCADENZA":target.classList.add("badge-warning");break;
        }
        const container_badge = new TAG_HTML("div").class(["container-badge"]).obj
        container_badge.append(target);
        
        parent.append(container_badge);
    }

    init_book(search_text="") {
        const doSearch = search_text != "" ? true : false;
        const pages = [];
        let page = [];
        for (let i=0;i < this.data.length;i++) {
            const record = this.data[i];
            let doAdd = false;
            if(doSearch){
                for(const record_value of Object.values(record)){
                    if(record_value.includes(search_text)){
                        doAdd = true;
                        break;
                    }
                }
            }
            if (doSearch && !doAdd) { continue; } else { page.push(record); }

            if (page.length == this.n_rows) {
                pages.push([...page]);
                page = [];
            }
        }
        if (page.length > 0) { pages.push([...page]); }

        this.pages = pages;
        this.page =  pages[this.n_pag];
        
        //* HANDLER_EMPTY_ROWS
        //const not_full_first_page = this.pages.length == 1 && this.page.length < this.n_rows;
        //const search_null = this.pages.length == 0 && this.page == undefined;

        //if(not_full_first_page || search_null){
        //    this.page = search_null ? [] : this.page;

        //    const extra_rows = this.n_rows - this.page.length;
        //    for(let i = 0; i<extra_rows; i++){
        //        this.page.push(this.empty_row);
        //    }
        //}
    }

    async getDBData(){ 
        if(this.conn) { 
            const data = await this.conn();
            //*Filtro e i dati con le colonne scelte
            this.data = data.map((e: object) => {
                const filteredEntries = Object.entries(e)
                    .filter(([key]) => this.ths.includes(key))
                    .sort(([a], [b]) => this.ths.indexOf(a) - this.ths.indexOf(b));
                return Object.fromEntries(filteredEntries);
            });
            return
        }
        //this.data = EXAMPLE_DATA.customers().customers
    }

    async update(doQuery:boolean){ if(doQuery){ await this.getDBData(); } }

    async setContent(doQuery:boolean, filter?:{name: string; value:string}){
        if(filter){
            if (filter.name == this.action_names.N_PAG){
                this.n_pag = Number(filter.value);
            }
            else if (filter.name == this.action_names.N_ROWS){
                this.n_rows = Number(filter.value);
            }
            else if (filter.name == this.action_names.SEARCH){
                this.search = filter.value;
            }
        }
        await this.update(doQuery);
        
        this.init_book(this.search);
        this.toScreenBody();
    }
}



class Table {
    obj: HTMLElement;
    settings = new SettingsTable();
    isDark = true; //da togliere

    header: HeaderTable;
    table:  ContentTable;
    footer = new FooterTable(0, 0);


    constructor({e, parent, title, dimension, style, tools, conn, ths}:TableProps){
        parent.append(e)
        this.obj = e;
        this.obj.setAttribute("data-colorschema", "dark")
        this.obj.classList.add("table-"+dimension);
        this.settings.tools = tools;
        
        this.header = new HeaderTable(this.settings.tools, title,this.obj);
        this.table = new ContentTable({
            settings: tools, 
            parent: this.obj,
            conn: conn,
            ths: ths
        });

        this.loadContent({style, tools, conn})

    }

    async loadContent({style, tools, conn}: {style:TableStyle, tools: SettingsTools, conn:()=>Promise<[void, void]> | undefined}){
        await this.table.ready
        console.log(style)
        switch(style){
            case "paging": {
                const N_PAGES = this.table.pages.length;
                const footer = new FooterTable(0, N_PAGES);
                console.log(N_PAGES, this.obj, footer)
                this.obj.append(footer.obj);
                this.footer = footer;
                break;
            }
        }
        console.log(this.obj)
        this.set_events();
    }

    set_events(){
        //*EVENTO SET Numero Pagina
        this.header.input_set_pag!.addEventListener("input", (e)=>{
            try {
                const e_current = e.currentTarget as HTMLInputElement
                const N_PAG = Number(e_current.value)-1;
                const correct_index = N_PAG < this.table.pages.length && N_PAG >= 0;
                if(correct_index){
                    this.table.n_pag = N_PAG;
                    this.footer.n_pag = this.table.n_pag;
                    //console.log("Table: N_PAG: "+page_user)
                    this.table.setContent(false, {name: "n_pag", value: String(N_PAG)});
                    this.footer.setCurrentPage();
                }
            }
            catch{console.log("Valore non valido");}
        })
        
        //*EVENTO SET Numero riga su tabella
        this.header.input_set_n_rows!.addEventListener("change", (e)=>{
            try {
                const e_current = e.currentTarget as HTMLInputElement
                const N_ROWS = Number(e_current.value);
                const record_minori_del_limite = this.table.data.length%N_ROWS== this.table.data.length;
                this.table.n_pag = 0;
                if(record_minori_del_limite){
                    this.footer.container_btns.style.opacity = "0" ;
                }
                else{
                    this.footer.container_btns.style.opacity = "1";
                }
                //console.log("Table: N_ROWS: "+user_limit)
                this.table.setContent(false, {name: "n_rows", value: String(N_ROWS)});
                this.footer.n_pages = this.table.pages.length;
                this.footer.setCurrentPage();
            }
            catch(err){console.log("Valore non valido: "+err);}
        })

        //*EVENTO SET ricerca
        this.header.input_set_search.addEventListener("input", (e)=>{
            const input = e.currentTarget as HTMLInputElement;
            this.header.search = input.value;
            this.table.setContent(false, {name: "search", value: this.header.search});
            this.footer.n_pag = this.table.n_pag;
            this.footer.n_pages = this.table.pages.length;
            this.footer.setCurrentPage();
        })



        //*EVENTO SET pagina++
        this.footer.btn_next.addEventListener("click", ()=>{
            const N_PAG = this.table.n_pag + 1;
            if(N_PAG < this.table.pages.length){
                this.table.n_pag = N_PAG;
                this.table.setContent(false, {name: "n_pag", value: String(this.table.n_pag)});
                this.footer.n_pag = this.table.n_pag;
                this.footer.setCurrentPage();
            }
        })
        
        //*EVENTO SET pagina--
        this.footer.btn_prec.addEventListener("click", ()=>{
            const N_PAG = this.table.n_pag - 1;
            if(this.table.n_pag > 0){;
                this.table.n_pag = N_PAG;
                this.table.setContent(false, {name: "n_pag", value: String(this.table.n_pag)});
                this.footer.n_pag = this.table.n_pag;
                this.footer.setCurrentPage();
            }
        })

    }
}`
	FRONTEND_TABLES_CSS = `
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

/* Firefox */
.table-func-n-pag {
    -moz-appearance: textfield;
}

:root {
    --sections-table-small: 70px calc(88vh - 300px) 0px;
    --sections-table-large: 70px calc(100vh - 260px) 60px;
    
    --max-height-tbody: calc(100vh - 280px);
    --max-width-table: calc(100vw - 280px);
}

@keyframes open-large {
    from {transform: translateY(-10%); opacity: 0;}
    to {transform: translateY(0%); opacity: 1;}
}
@keyframes open-small {
    from {transform: translateY(10%); opacity: 0;}
    to {transform: translateY(0%); opacity: 1;}
}

.table-small {
    grid-template-rows: var(--sections-table-small);
    animation: open-small 500ms ease forwards;
}
.table-large {
    grid-template-rows: var(--sections-table-large);
    width: var(--max-width-table);
    opacity: 0;
    animation: open-large 500ms ease forwards;
}

.table {
    border-radius: 3px;
    display: grid;
    overflow: hidden;
    box-shadow: 2px 3px 5px #0005;
}

.table[data-colorschema="dark"] {background: var(--bg-card);border:1px solid #fff2;}
.table[data-colorschema="light"] {background: #fff9;border:1px solid #0002;}

.table > header {
    padding: 20px;
    position: relative;
    font-size: 1.1rem;
}
.table .table-name[data-colorschema="dark"]{color:#fff9;}
.table .table-name[data-colorschema="light"]{color:#0008;}
.table .table-name{
    position: absolute;
    top: 17px;
    left: 17px;
    cursor: pointer;
}


.table > header[data-colorschema="dark"] {
    border-bottom: 1px solid #fff2;
}
.table > header[data-colorschema="light"] {
    border-bottom: 1px solid #0002;
}

.table .container-tools {
    display: flex;
    justify-content: end;
    gap: 30px;
}

.table-func-n-pag {
    border: none;
    border-bottom: 1px solid var(--light-blue);
    width: 75px;
    outline: none;
    color: #000;
    background: transparent;
    padding: 5px;
    color: #fff9;
}

.table-func-n-rows {
    background: transparent;
    padding: 5px;
    border: none;
    border-bottom: 1px solid var(--light-blue);
    outline: none;
    color: #fff9;
    cursor: pointer;
}
.table-func-search {
    background: transparent;
    padding: 5px;
    border: none;
    border-bottom: 1px solid var(--light-blue);
    outline: none;
    color: #fff9;
}

.container-table-content {
    position: relative;
    overflow: auto;
    height: 100%;
    border-collapse: collapse;
    scrollbar-width: thin;  /* auto | thin | none */
    scrollbar-color: var(--light-blue) transparent;
}

[label="thead"] {
    position: sticky;
    top: 0;
    min-height: 0px;
}

.container-th {
    border-bottom: 1px solid #fff1;
    font-size: .9rem;
    box-shadow: 0px 4px 3px #0003;
    font-weight: 800;
}
.container-th[data-colorschema="dark"] {background: var(--bg-card);}
.container-th[data-colorschema="dark"] > span {color:#fff9;}
.container-th[data-colorschema="light"] {background: #fff;}
.container-th[data-colorschema="light"] > span {color:#0009;}


.row-0 > div {border-bottom: 1px solid #fff1;}
.row-1 > div {border-bottom: 1px solid #fff1;}

.row-0 > div[data-colorschema="dark"] {background: #0005;}
.row-1 > div[data-colorschema="dark"] {background: #0007;}
.row-0 > div[data-colorschema="light"] {background: #fff;}
.row-1 > div[data-colorschema="light"] {background: #0001;}
.container-td[data-colorschema="dark"] > span {color:#fff9;}
.container-td[data-colorschema="light"] > span {color:#0009;}

.container-th, .container-td {
    padding: 10px;
    text-align: center;
    overflow: hidden;
}


.row-0 > div, .row-1 > div,{
    text-align: center;
}


.row, .table-titles {
    display: grid;
}
.row {
    transition: 200ms;
}
.row:hover {
    opacity: .5;
}

.table [label="tbody"] {
    font-size: .8rem;
    min-width: 600px;
}

.table > footer {
    border-top: 1px solid #fff2;
    position: relative;
    min-height: 60px;
}
.table > footer[data-colorschema="dark"] { background: var(--bg-card); color: #fff9; }
.table > footer[data-colorschema="light"] { background: #fff9; color: #0009; }

.container-btn-footer{
    position: absolute;
    width: max-content;
    top: 15px;
    right: 20px;
}

button.btn-next, 
button.btn-prec {
    border: 1px solid var(--light-blue);
    background: transparent;
    color: var(--light-blue);
    padding: 3px 5px;
    border-radius: 5px;
    cursor: pointer;
    transition: 300ms;
}
button.btn-prec {opacity: 0}

footer .btn-next:hover, 
footer .btn-prec:hover {
    background: var(--light-blue);
    color: #fff;
}

.container-btn-footer > span {
    margin: 0px 10px;
}




:root{
    --dark-bg-success-badge: #1b322b;
    --dark-text-success-badge: #029964;
    --dark-bg-warning-badge: #343128;
    --dark-text-warning-badge: #a29950;
    --dark-bg-error-badge: #362525;
    --dark-text-error-badge: #b4483e;
    
    --light-bg-success-badge: #8bf288;
    --light-bg-warning-badge: #f2cf88;
    --light-bg-error-badge: #f77281;
}
/*BADGES*/
.badge{
    padding:3px 5px;
    border-radius: 5px;
    color: #fff;
    font-weight: 800;
}

span.badge-success[data-colorschema="dark"]{background: var(--dark-bg-success-badge);color: var(--dark-text-success-badge);border: 1px solid var(--dark-text-success-badge);}
span.badge-warning[data-colorschema="dark"]{background: var(--dark-bg-warning-badge);color: var(--dark-text-warning-badge);border: 1px solid var(--dark-text-warning-badge);}
span.badge-error[data-colorschema="dark"]{background: var(--dark-bg-error-badge);color: var(--dark-text-error-badge);border: 0.5px solid var(--dark-text-error-badge);}

span.badge-success[data-colorschema="light"]{background: var(--light-bg-success-badge);color: var(--light-text-success-badge);border: 1px solid var(--light-text-success-badge);}
span.badge-warning[data-colorschema="light"]{background: var(--light-bg-warning-badge);color: var(--light-text-warning-badge);border: 1px solid var(--light-text-warning-badge);}
span.badge-error[data-colorschema="light"]{background: var(--light-bg-error-badge);color: var(--light-text-error-badge);border: 0.5px solid var(--light-text-error-badge);}`

	FRONTEND_DBCONNECTION_TS = `
type DBQuery = {
    name: "storehouse" | "orders" | "customers";
}

type ItemCustomer = {
    id: number;
    name: string;
    surname: string;
    address: string;
}

class HandlerConnection {}

class MyDB {
    handler = new HandlerConnection();
    tables = {
    };
    ready: Promise<void>;

    constructor(){
        this.ready = this.init()
    }

    async init(){
        await Promise.all([
            await this.load({name: "customers"}),
        ])
    }

    async load(query: DBQuery){
        let res = await fetch(`+"`/db/${query.name}/get`"+`, {method:"GET"})
        res = await res.json();
        this.tables[query.name] = res;
    }

}

const DATABASE = new MyDB()`
	FRONTEND_ROUTES_TS = `
class Routes {
    main = SELECT.one("#page");
    db = DATABASE

    init(_class: string){
        this.main.className = "";
        this.main.innerHTML = "";
        this.main.classList.add(_class);
    }

    async home(){
        this.init("page-listino");
        const [s1, s2] = ["section", "section"].map((e:string)=>new TAG_HTML(e).obj);
        this.main.append(s1, s2);
        s1.id = "home-section1"

        //*QUERY DB
        await this.db.ready;

		//TODO do something

    }
}`
	FRONTEND_UTILS_TS = `
	class TAG_HTML {
    obj: HTMLElement;
        
    constructor(tag: string){
        this.obj = document.createElement(tag) as HTMLElement;
    }
    id(id: string){this.obj.id = id;return this;}
    class(classes: string[]){this.obj.classList.add(...classes);return this;}
    props(props: object){Object.assign(this.obj, props);return this;}
    attr(attr: object){Object.assign(this.obj.dataset, attr);return this; }
}

class SELECT {
    static one(e:string):HTMLElement {return document.querySelector(e)!}

    static style = (v:string)=>window.getComputedStyle(document.documentElement).getPropertyValue(v).trim();
    static all(e:string):HTMLElement[] {return Array.from(document.querySelectorAll(e)!)}
}




const texts = {
    full_without_special:()=>"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    full:()=>"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%",
    number:()=>"0123456789",
    upper:()=>"ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    lower:()=>"abcdefghijklmnopqrstuvwxyz",
    special:()=>"!@#$%",
}
class GENERATE {
    static get(choices:string[]): string | undefined {
        const n_choices = choices.length;
        const temp = Math.random() * n_choices;

        for(let i=1; i < n_choices+1; i++){
            if(temp < i){ return choices[i-1] }
        }
    }
    static number(max:number){
        return (Math.random() * max).toFixed(0)
    }
    static number_string(length=5){
        const chars = texts.number();
        let result = "";
        for (let i = 0; i < length; i++) {
            result += chars[Math.floor(Math.random() * chars.length)];
        }
        return result;
    }


    static string(length = 8) {
        const chars = texts.full_without_special();
        let result = "";
        for (let i = 0; i < length; i++) {
            result += chars[Math.floor(Math.random() * chars.length)];
        }
        return result;
    }
    static date(start:Date, end:Date) {
        const startTs = start.getTime();
        const endTs = end.getTime();
        
        const randomTs = startTs + Math.random() * (endTs - startTs);
        return new Intl.DateTimeFormat('it-IT', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).format(randomTs);
    }

    static price():string {
        return (Math.random() * 100).toFixed(2).replace(".", ",") + "€";
    }

    static securePassword(length = 12): string {
        const chars = texts.full();
        const array = new Uint32Array(length);
        crypto.getRandomValues(array);

        return Array.from(array, n => chars[n % chars.length]).join('');
    }
}

//from api
type Data = ItemCustomer[]`
    FRONTEND_APP_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap');

:root {
    --bg-card: #1A1B24;
    /*
    --bg-body: #fafafb;
    --bg-body: linear-gradient(to top, #07080f, #121529);
    --bg-body: linear-gradient(to top, #475154, #272f30);
     */
    --bg-body: linear-gradient(to top, #3A4154, #232330);

    --yellow-text: #fcba03;



    --color-text: #fff;
    --light-blue: #5ED3EC;
    --get-pro: #0FFC03;
    --error: #FA020F;
    --width-sidebar: 200px
}

* {
    margin:0;
    padding:0;
    color: #fff9;
}

#data-colorschema{
    position:absolute;
    top :0;
    visibility: hidden;
}

body {
    /*
    font-family: 'Inter', 'Roboto', 'Helvetica Neue', Arial, sans-serif;

    */
    font-family: "Roboto", sans-serif;
    font-optical-sizing: auto;
    font-weight: 500;
    font-style: normal;
    font-variation-settings: "wdth" 100;
    font-size: 15px;
    overflow:hidden;

}

#app {
    display: grid;
    grid-template-columns: 200px 400px;
    height: 100vh;
    width: 100vw;
    position: relative;
}
#app[data-colorschema="light"]{background: #fafafb;}
#app[data-colorschema="dark"]{background: var(--bg-body);}

#page-container{
    width:calc(100vw - var(--width-sidebar))

}

#page {
    padding: 20px;
}

/* CONFIG PAGES */
.page-documents, .page-models {
    display: flex;
    justify-content: center;
}


/* Buttons */
.btn {padding: 5px 8px; border-radius: 5px;background:transparent;cursor:pointer;transition:300ms}

.btn-primary {border: 1px solid var(--light-blue); color: var(--light-blue)}
.btn-error {border: 1px solid var(--error); color: var(--error)}
.btn-success {border: 1px solid var(--get-pro); color: var(--get-pro)}
.btn-warning {border: 1px solid var(--yellow-text); color: var(--yellow-text)}

.btn-primary:hover {background: var(--light-blue); color: #fff}
.btn-error:hover {background: var(--error); color: #fff}
.btn-success:hover {background: var(--get-pro); color: #fff}
.btn-warning:hover {background: var(--yellow-text); color: #fff}`
    FRONTEND_HOME_CSS = `
@keyframes open-large-section1 {
    from {opacity: 0;}
    to {opacity: 1;}
}

#home-section1{
    display:flex;
    justify-content: space-between;
    padding: 10px;
    animation: open-large-section1 500ms linear forwards;
    width: 100%;
}

#home-section1[data-colorschema="dark"]{
    background: var(--bg-card);
    border: 1px solid #fff2;
}
#home-section1[data-colorschema="light"]{
    background: #fff;
    border: 1px solid #0002;
}



#home-section1-box2{
    display: flex;
    justify-content: space-around;
}




#home-section2{
    padding-top: 30px;
}`

//*LIBS CONFIG
	PACKAGEJSON = `
{
  "name": "dashboard tools",
  "version": "0.3.0",
  "description": "",
  "scripts": {
    "build-css": "postcss style.css -o ./full.min.css",
    "build-js": "esbuild index.js --minify --outfile=./full.min.js",
    "start": "tsc --watch",
    "compile": "tsc"
  },
  "devDependencies": {
    "cssnano": "^6.0.0",
    "esbuild": "^0.27.4",
    "postcss-cli": "^10.1.0",
    "typescript": "^6.0.2"
  }
}`
	TSCONFIG = `
{
  "compilerOptions": {
    "outDir": "./app/static/js",
    "rootDir": "./ts",
    "module": "commonjs",
    "target": "es2021",
    "strict": true
  }
}`

)

//*BACKEND GOLANG
const (
	BACKEND_GOLANG_MAIN = `
package main

import (
    "net/http"
    "fmt"
    "time"
)
var server = &http.Server{
    	Addr:           ":8080",
    	ReadTimeout:    10 * time.Second,
    	WriteTimeout:   10 * time.Second,
    	MaxHeaderBytes: 1 << 20,
    }


func main(){
    fs := http.FileServer(http.Dir("static"))
    http.Handle("/static/", http.StripPrefix("/static/", fs))

    for _, file := range percorsi {http.HandleFunc(file.route, file.f)}
    fmt.Println("Server acceso ===> http://127.0.0.1:8080")
    server.ListenAndServe()    
}`
	BACKEND_GOLANG_UTILS= `
package main

import (
	"encoding/json"
	"os"
	_ "log"
    "net/http"
)

//============================== TYPES TABLES ==============================
//* customer
type ITEM_CUSTOMER struct {
	Id int `+"`json:\"id\"`"+`
	Name string `+"`json:\"name\"`"+`
	Surname string `+"`json:\"surname\"`"+`
	Address string `+"`json:\"address\"`"+`
}
//============================== METHODS ==============================

func GET_CUSTOMERS() ([]ITEM_CUSTOMER, error) {
	var customers []ITEM_CUSTOMER
	data, err := os.ReadFile("database/customers.json")
	if err != nil { return customers, err}
	err = json.Unmarshal(data, &customers)
	if err != nil {return customers, err}

	return customers, nil
}

//============================== ROUTES ==============================
//* FRONTEND
func MAIN(w http.ResponseWriter, r *http.Request) { 
	http.ServeFile(w, r, "index.html") 
}

//============================== GET ==============================
func API_CUSTOMERS_FULL(w http.ResponseWriter, r *http.Request){
	data, err := GET_CUSTOMERS()
	if err != nil { http.Error(w, err.Error(), 500)}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(data)
}`
	BACKEND_GOLANG_ROUTES = `
package main 

import (
	"net/http"
)

type Percorso struct{
    route   string
    f       func(http.ResponseWriter, *http.Request)  
}

//DEFINIZIONI ROUETS
var percorsi = []Percorso{
    {route: "/",  f: MAIN,},
    
    {route: "/db/customers/get",  f: API_CUSTOMERS_FULL,},
}`
)


//*BACKEND FLASK
const (
	BACKEND_FLASK = ``
)


const HTML_PAGE  = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Home</title>
  
    <link rel="stylesheet" href="static/css/app.css">

    <!--libs-->
    <link rel="stylesheet" href="static/css/home.css">
    <link rel="stylesheet" href="static/css/libs/cards/init.css">
    <link rel="stylesheet" href="static/css/libs/aside/init.css">
    <link rel="stylesheet" href="static/css/libs/popup/init.css">
    <link rel="stylesheet" href="static/css/libs/nav/init.css">
    <link rel="stylesheet" href="static/css/libs/models/init.css">
    <link rel="stylesheet" href="static/css/libs/tables/init.css">
    <link rel="stylesheet" href="static/css/libs/chart/init.css">
    
    <!--CDNs -->
    <script src="https://cdn.anychart.com/releases/8.14.1/js/anychart-bundle.min.js"></script>
    <link href="https://cdn.anychart.com/releases/8.14.1/css/anychart-ui.min.css" type="text/css" rel="stylesheet">
    <link href="https://cdn.anychart.com/releases/8.14.1/fonts/css/anychart-font.min.css" type="text/css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">

  </head>
  <body>

      <div id="data-colorschema"></div>
    
      <main id="app" data-colorschema="dark">
        
        <aside id="sidebar">
          <header></header>
          <section>
            <ul id="container-aside-items">
              <li class="aside-item">
                <div class="container-circle">
                    <div class="circle"></div>
                </div>
                <div><a></a></div>
              </li>
            </ul>
            <footer>
            </footer>
          </section>
        </aside>

        <section id="page-container">  
          <nav id="nav" data-colorschema="dark"></nav>
          <main id="page" data-colorschema="dark">
            

          </main>
        </section>  

      </main>


    <!--libs-->
    <script src="static/js/libs/dbConnection.js" ></script>
    <script src="static/js/libs/utils.js" ></script>
    <script src="static/js/libs/input/init.js" ></script>
    <script src="static/js/libs/chart/init.js" ></script>
    <script src="static/js/libs/nav/init.js" ></script>
    <script src="static/js/libs/routes.js" ></script>
    <script src="static/js/libs/cards/init.js" ></script>
    <script src="static/js/libs/popup/init.js" ></script>
    <script src="static/js/libs/models/init.js" ></script>
    <script src="static/js/libs/aside/init.js" ></script>
    <script src="static/js/libs/tables/init.js"></script>

    <script>new Routes().home()</script>
    

  </body>
</html>`
