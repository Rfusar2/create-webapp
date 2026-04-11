package main

import (
	"encoding/json"
	_ "log"
	"net/http"
	"os"
)

//============================== TYPES TABLES ==============================
type ITEM struct {
	Id   int `json:"id"`
	Name string `json:"name"`
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
