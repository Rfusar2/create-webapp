package main

import (
	"encoding/json"
	_ "log"
	"net/http"
	"os"
)
// FOR DATA USING https://json-generator.com/

//============================== TYPES TABLES ==============================
type ITEM struct {
	Id   int `json:"id"`
	guid string `json:"guid"`
	active bool `json:"active"`
	balance float64 `json:"balance"`
	age int `json:"age"`
	name string `json:"name"`
	gender string `json:"gender"`
	company string `json:"company"`
	email string `json:"email"`
	phone string `json:"phone"`
	address string `json:"address"`
	about string `json:"about"`
	registred string `json:"registred"`
}

//============================== METHODS ==============================

func GET_EXAMPLE() ([]ITEM, error) {
	var documents []ITEM
	data, err := os.ReadFile("database/example.json")
	if err != nil {
		return documents, err
	}
	err = json.Unmarshal(data, &documents)
	if err != nil {
		return documents, err
	}

	return documents, nil
}

//============================== ROUTES ==============================
//* FRONTEND
func MAIN(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "index.html")
}

//============================== GET ==============================
func API_EXAMPLE_FULL(w http.ResponseWriter, r *http.Request) {
	data, err := GET_EXAMPLE()
	if err != nil {
		http.Error(w, err.Error(), 500)
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(data)
}
