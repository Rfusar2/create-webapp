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

## Prossimi Aggiornamenti

* creare ambiente backend flask (per webapp con sessioni, e etc...)
