
package main

import (
	"encoding/json"
	"os"
	_ "log"
    "net/http"
)

//============================== TYPES TABLES ==============================
type ITEM_ADDRESS struct {
	Street string `json:"street"`
	Civic string `json:"civic"`
	Zipcode string `json:"zipcode"`
	City string `json:"city"`
	Province string `json:"province"`
}
type ITEM_BILLING struct {
	Address ITEM_ADDRESS `json:"address"`
}
type ITEM_CUSTOMER struct {
	Name string `json:"name"`
	Surname string `json:"surname"`
	TaxId string `json:"taxId"`
	Address ITEM_ADDRESS `json:"address"`
}
//* documents
type ITEM_DOCUMENT struct {
	id string `json:"id"`
	Type string `json:"type"`
	NDocument string `json:"nDocument"`
	IssueDate string `json:"issueDate"`
	Description string `json:"description"`
	TypeProviding string `json:"typeProviding"`
	TotalAmount string `json:"totalAmount"`
	ExpirationDate string `json:"expirationDate"`
	Consumption string `json:"consumption"`
	AnnualConsumption string `json:"annualConsumption"`
	ConsumptionPeriod string `json:"consumptionPeriod"`
	UnitOfMeasurement string `json:"unitOfMeasurement"`
	IdentificationType string `json:"identificationType"`
	Status string `json:"status"`
	IdentificationValue string `json:"identificationValue"`
	Billing ITEM_BILLING `json:"billing"`
	Customer ITEM_CUSTOMER `json:"customer"`
}
//============================== METHODS ==============================

func GET_DOCUMENTS() ([]ITEM_DOCUMENT, error) {
	var documents []ITEM_DOCUMENT
	data, err := os.ReadFile("database/documents.json")
	if err != nil { return documents, err}
	err = json.Unmarshal(data, &documents)
	if err != nil {return documents, err}

	return documents, nil
}

//============================== ROUTES ==============================
//* FRONTEND
func MAIN(w http.ResponseWriter, r *http.Request) { 
	http.ServeFile(w, r, "index.html") 
}

//============================== GET ==============================
func API_DOCUMENTS_FULL(w http.ResponseWriter, r *http.Request){
	data, err := GET_DOCUMENTS()
	if err != nil { http.Error(w, err.Error(), 500)}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(data)
}
