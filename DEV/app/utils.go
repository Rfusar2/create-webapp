package main

import (
	"encoding/json"
	_ "log"
	"net/http"
	"os"
	_ "fmt"
)
// FOR DATA USING https://json-generator.com/

//============================== TYPES TABLES ==============================
type ITEM struct {
	Id   int `json:"id"`
	Guid string `json:"guid"`
	Active bool `json:"active"`
	Balance float64 `json:"balance"`
	Age int `json:"age"`
	Name string `json:"name"`
	Gender string `json:"gender"`
	Company string `json:"company"`
	Email string `json:"email"`
	Phone string `json:"phone"`
	Address string `json:"address"`
	About string `json:"about"`
	Registered string `json:"registered"`
}

type REQ struct {
	Action string `json:"action"`
	Record string `json:"record"`
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
	if r.Method != "POST" { http.Error(w, "NON PUOI FIGLIO DI PUTTANA", 415); return }

	var req REQ
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil { http.Error(w, err.Error(), 415); return }

	w.Header().Set("Content-Type", "application/json")

	var data []ITEM
	if req.Action == "view_example" {
		data, err = GET_EXAMPLE()
		if err != nil { http.Error(w, err.Error(), 500); return }

	} else {
		http.Error(w, "COSA CAZZO FAII?!? action non valido, scemo", 415)
		return
	}

	err = json.NewEncoder(w).Encode(data)
	if err != nil { http.Error(w, err.Error(), 500) }
}
