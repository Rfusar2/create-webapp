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

## Prossimi Aggiornamenti

* creare ambiente backend flask (per webapp con sessioni, e etc...)
