
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
}