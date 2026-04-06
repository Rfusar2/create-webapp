
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
	Id int `json:"id"`
	Name string `json:"name"`
	Surname string `json:"surname"`
	Address string `json:"address"`
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
}