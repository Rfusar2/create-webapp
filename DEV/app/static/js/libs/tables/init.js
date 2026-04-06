"use strict";
class SettingsTable {
    constructor() {
        this.tools = {
            n_pag: true,
            n_rows: true,
            search: true,
            settings: true,
        };
    }
}
class HeaderTable {
    constructor(filters, title_text, parent) {
        this.obj = new TAG_HTML("header").attr({ colorschema: "dark" }).obj;
        this.containerTools = new TAG_HTML("div").class(["container-tools"]).obj;
        parent.append(this.obj);
        this.filters = filters;
        this.title = new TAG_HTML("h2").class(["table-name"]).props({ textContent: title_text }).attr({ colorschema: "dark" }).obj;
        this.containerTools.append(this.title);
        this.input_set_search = this.create_setSearch();
        this.input_set_pag = this.create_setPag();
        this.input_set_n_rows = this.create_setRows();
        this.search = this.input_set_search ? this.input_set_search.value : "";
        this.obj.append(this.containerTools);
        this.getEvents();
    }
    create_setPag() {
        if (!this.filters.n_pag)
            return new TAG_HTML("input").obj;
        const input = new TAG_HTML("input")
            .class(["table-func-n-pag"])
            .props({ type: "number", placeholder: "n pagina" }).obj;
        this.containerTools.append(input);
        return input;
    }
    create_setRows() {
        if (!this.filters.n_rows)
            return new TAG_HTML("input").obj;
        const input = new TAG_HTML("select").class(["table-func-n-rows"]).obj;
        input.append(new Option("10", "10"), new Option("25", "25"), new Option("50", "50"), new Option("100", "100"));
        this.containerTools.append(input);
        return input;
    }
    create_setSearch() {
        if (!this.filters.search)
            return new TAG_HTML("input").obj;
        const input = new TAG_HTML("input")
            .class(["table-func-search"])
            .props({ type: "text", placeholder: "Search..." }).obj;
        this.containerTools.append(input);
        return input;
    }
    getEvents() {
        //this.title.addEventListener("click", ()=>new Model({
        //    type: ConfigModelTypes.RIGHT,
        //    title: "Impostazioni",
        //    inputs: [new TAG_HTML("input").obj as HTMLInputElement ],
        //}));
    }
}
class FooterTable {
    constructor(n_pag, n_pages) {
        this.obj = new TAG_HTML("footer").attr({ colorschema: "dark" }).obj;
        this.btn_next = new TAG_HTML("button").obj;
        this.btn_prec = new TAG_HTML("button").obj;
        this.span = new TAG_HTML("span").obj;
        this.container_btns = new TAG_HTML("div").obj;
        this.n_pag = n_pag;
        this.n_pages = n_pages;
        this.view = this.n_pages == 1 ? false : true;
        if (this.view) {
            this.handlerBtnPages();
        }
    }
    handlerBtnPages() {
        const container = new TAG_HTML("div").class(["container-btn-footer"]).obj;
        const btn_next = new TAG_HTML("button").class(["btn-next"]).props({ textContent: "Prossima" }).obj;
        const btn_prec = new TAG_HTML("button").class(["btn-prec"]).props({ textContent: "Precedente" }).obj;
        const span = new TAG_HTML("span").props({ textContent: "1-" + String(this.n_pages) }).obj;
        container.append(btn_prec, span, btn_next);
        this.obj.append(container);
        this.container_btns = container;
        this.btn_next = btn_next;
        this.btn_prec = btn_prec;
        this.span = span;
    }
    setCurrentPage() {
        this.btn_prec.style.opacity = this.n_pag + 1 > 1 ? "1" : "0";
        this.span.textContent = `${this.n_pag + 1}-${this.n_pages}`;
    }
}
class ContentTable {
    constructor({ settings, parent, width_columns, conn, ths }) {
        this.obj = new TAG_HTML("main").class(["container-table-content"]).obj;
        this.n_pag = 0;
        this.n_rows = 10;
        this.search = "";
        this.thead = new TAG_HTML("div").obj;
        this.tbody = new TAG_HTML("div").obj;
        //TODO fare enum
        this.action_names = {
            N_PAG: "n_pag",
            N_ROWS: "n_rows",
            SEARCH: "search",
        };
        parent.append(this.obj);
        this.settings = settings;
        this.data = [];
        this.pages = [];
        this.page = [];
        this.conn = conn;
        this.ths = ths;
        this.thead.setAttribute("label", "thead");
        this.tbody.setAttribute("label", "tbody");
        this.obj.append(this.thead, this.tbody);
        this.init(parent, width_columns);
    }
    async init(parent, width_columns) {
        await this.toScreenNameColumns();
        this.handlerWidthColumns(parent, width_columns);
        this.setContent(true);
    }
    async handlerWidthColumns(parent, width_columns) {
        //*per adattare il numero di colonne con i dati passsati
        //*nel caso non sia settata la lunghezza delle colonne
        let style = ".row, .table-titles { grid-template-columns: ";
        const addStyle = new TAG_HTML("style").obj;
        if (!width_columns) {
            //const n_columns = Object.keys(this.data[0]).length;
            const n_columns = Object.keys(this.ths).length;
            const width_table = parent.getBoundingClientRect().width;
            const width_column = Math.floor(width_table / n_columns) - 2;
            style += `repeat(${n_columns}, ${width_column}px) }`;
        }
        else {
            style += `${width_columns} }`;
        }
        addStyle.textContent = style;
        SELECT.one("head").append(addStyle);
    }
    async toScreenNameColumns() {
        await this.getDBData();
        let riga = new TAG_HTML("div").class(["table-titles"]).obj;
        //for(const th_text of Object.keys(this.data[0])){
        for (const th_text of this.ths) {
            const container_th = new TAG_HTML("div")
                .class(["container-th"])
                .attr({ colorschema: "dark" }).obj;
            const th = new TAG_HTML("span").props({ textContent: th_text }).obj;
            container_th.append(th);
            riga.append(container_th);
            this.thead.append(riga);
        }
    }
    toScreenBody() {
        this.obj.querySelector('[label="tbody"]').innerHTML = "";
        for (let i = 0; i < this.page.length; i++) {
            const record = this.page[i];
            const riga = new TAG_HTML("div").class([i % 2 == 0 ? "row-0" : "row-1", "row"]).obj;
            for (const [k, v] of Object.entries(record)) {
                const container_td = new TAG_HTML("div")
                    .class(["container-td"])
                    .attr({ colorschema: "dark" }).obj;
                const td = new TAG_HTML("span").props({ textContent: v }).obj;
                //* HANDLER_BADGES
                switch (k.toLowerCase()) {
                    case "status":
                        this.fieldStatus(container_td, td);
                        break;
                    default:
                        container_td.append(td);
                        break;
                }
                riga.append(container_td);
                //* HANDLER_EMPTY_ROWS
                //if(v=="dummy-code"){ td.style.opacity = "0"; }
            }
            this.tbody.append(riga);
        }
    }
    fieldStatus(parent, target) {
        target.classList.add("badge");
        target.textContent = target.textContent.toUpperCase();
        target.style.fontSize = "10px";
        target.setAttribute("data-colorschema", "dark");
        switch (target.textContent.replaceAll(" ", "")) {
            case "ATTIVO":
                target.classList.add("badge-success");
                break;
            case "SCADUTO":
                target.classList.add("badge-error");
                break;
            case "INSCADENZA":
                target.classList.add("badge-warning");
                break;
        }
        const container_badge = new TAG_HTML("div").class(["container-badge"]).obj;
        container_badge.append(target);
        parent.append(container_badge);
    }
    init_book(search_text = "") {
        const doSearch = search_text != "" ? true : false;
        const pages = [];
        let page = [];
        for (let i = 0; i < this.data.length; i++) {
            const record = this.data[i];
            let doAdd = false;
            if (doSearch) {
                for (const record_value of Object.values(record)) {
                    if (record_value.includes(search_text)) {
                        doAdd = true;
                        break;
                    }
                }
            }
            if (doSearch && !doAdd) {
                continue;
            }
            else {
                page.push(record);
            }
            if (page.length == this.n_rows) {
                pages.push([...page]);
                page = [];
            }
        }
        if (page.length > 0) {
            pages.push([...page]);
        }
        this.pages = pages;
        this.page = pages[this.n_pag];
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
    async getDBData() {
        if (this.conn) {
            const data = await this.conn();
            //*Filtro e i dati con le colonne scelte
            this.data = data.map((e) => {
                const filteredEntries = Object.entries(e)
                    .filter(([key]) => this.ths.includes(key))
                    .sort(([a], [b]) => this.ths.indexOf(a) - this.ths.indexOf(b));
                return Object.fromEntries(filteredEntries);
            });
            return;
        }
        //this.data = EXAMPLE_DATA.customers().customers
    }
    async update(doQuery) { if (doQuery) {
        await this.getDBData();
    } }
    async setContent(doQuery, filter) {
        if (filter) {
            if (filter.name == this.action_names.N_PAG) {
                this.n_pag = Number(filter.value);
            }
            else if (filter.name == this.action_names.N_ROWS) {
                this.n_rows = Number(filter.value);
            }
            else if (filter.name == this.action_names.SEARCH) {
                this.search = filter.value;
            }
        }
        await this.update(doQuery);
        this.init_book(this.search);
        this.toScreenBody();
    }
}
class Table {
    constructor({ e, parent, title, dimension, style, tools, conn, ths }) {
        this.settings = new SettingsTable();
        this.isDark = true; //da togliere
        this.footer = new FooterTable(0, 0);
        parent.append(e);
        this.obj = e;
        this.obj.setAttribute("data-colorschema", "dark");
        this.obj.classList.add(`table-${dimension}`);
        this.settings.tools = tools;
        this.header = new HeaderTable(this.settings.tools, title, this.obj);
        this.table = new ContentTable({
            settings: tools,
            parent: this.obj,
            conn: conn,
            ths: ths
        });
    }
    async loadContent({ style, tools, conn }) {
        //console.log(this.table)
        await this.table.ready;
        //console.log(this.table)
        switch (style) {
            case "paging": {
                const N_PAGES = this.table.pages.length;
                const footer = new FooterTable(0, N_PAGES);
                this.obj.append(footer.obj);
                break;
                this.footer = footer;
                break;
            }
        }
        this.set_events();
    }
    set_events() {
        //*EVENTO SET Numero Pagina
        this.header.input_set_pag.addEventListener("input", (e) => {
            try {
                const e_current = e.currentTarget;
                const N_PAG = Number(e_current.value) - 1;
                const correct_index = N_PAG < this.table.pages.length && N_PAG >= 0;
                if (correct_index) {
                    this.table.n_pag = N_PAG;
                    this.footer.n_pag = this.table.n_pag;
                    //console.log("Table: N_PAG: "+page_user)
                    this.table.setContent(false, { name: "n_pag", value: String(N_PAG) });
                    this.footer.setCurrentPage();
                }
            }
            catch {
                console.log("Valore non valido");
            }
        });
        //*EVENTO SET Numero riga su tabella
        this.header.input_set_n_rows.addEventListener("change", (e) => {
            try {
                const e_current = e.currentTarget;
                const N_ROWS = Number(e_current.value);
                const record_minori_del_limite = this.table.data.length % N_ROWS == this.table.data.length;
                this.table.n_pag = 0;
                if (record_minori_del_limite) {
                    this.footer.container_btns.style.opacity = "0";
                }
                else {
                    this.footer.container_btns.style.opacity = "1";
                }
                //console.log("Table: N_ROWS: "+user_limit)
                this.table.setContent(false, { name: "n_rows", value: String(N_ROWS) });
                this.footer.n_pages = this.table.pages.length;
                this.footer.setCurrentPage();
            }
            catch (err) {
                console.log("Valore non valido: " + err);
            }
        });
        //*EVENTO SET ricerca
        this.header.input_set_search.addEventListener("input", (e) => {
            const input = e.currentTarget;
            this.header.search = input.value;
            this.table.setContent(false, { name: "search", value: this.header.search });
            this.footer.n_pag = this.table.n_pag;
            this.footer.n_pages = this.table.pages.length;
            this.footer.setCurrentPage();
        });
        //*EVENTO SET pagina++
        this.footer.btn_next.addEventListener("click", () => {
            const N_PAG = this.table.n_pag + 1;
            if (N_PAG < this.table.pages.length) {
                this.table.n_pag = N_PAG;
                this.table.setContent(false, { name: "n_pag", value: String(this.table.n_pag) });
                this.footer.n_pag = this.table.n_pag;
                this.footer.setCurrentPage();
            }
        });
        //*EVENTO SET pagina--
        this.footer.btn_prec.addEventListener("click", () => {
            const N_PAG = this.table.n_pag - 1;
            if (this.table.n_pag > 0) {
                ;
                this.table.n_pag = N_PAG;
                this.table.setContent(false, { name: "n_pag", value: String(this.table.n_pag) });
                this.footer.n_pag = this.table.n_pag;
                this.footer.setCurrentPage();
            }
        });
    }
}
