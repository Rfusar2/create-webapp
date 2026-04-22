# CREATE-WEBAPP CLI

## Descrizione

* Ambiente typescript (in piu anche lib per compressare il codice per ambiente di produzione)
    
    * sviluppo dei propri componenti

    * tool per ricreare l'ambiente

* backend minimale in go, connessione con file locali

## Aggiornamento dei file contenuti nell'eseguibile

per generare const.go:

    go run build-const.go

per creare l'eseguibile:

    go build main.go const.go

## ARCHITETTURA

* MyDB

* Render

* Routes

nel file routes:

```javascript
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

    async home(){
        //DEFINISCI LA PAGINA
    }
}
```

## COMPONENTI 

* aside

* cards

* chart

* input

* models

* nav

* popup

* tables

## UTILS

```javascipt
class TAG_HTML {
    obj: HTMLElement;
        
    constructor(tag: string){
        this.obj = document.createElement(tag) as HTMLElement;
    }
    id(id: string){this.obj.id = id;return this;}
    class(classes: string[]){this.obj.classList.add(...classes);return this;}
    props(props: object){Object.assign(this.obj, props);return this;}
    style(styles: object){Object.assign(this.obj.style, styles);return this;}
    attr(attr: object){Object.assign(this.obj.dataset, attr);return this; }
}
class Button extends TAG_HTML {
    constructor(){ super("button"); }
}
class Span extends TAG_HTML {
    constructor(){ super("span"); }
}
class Title extends TAG_HTML {
    constructor(){ super("h1"); }
}
```

## Prossimi Aggiornamenti

* creare ambiente backend flask (per webapp con sessioni, e etc...)
