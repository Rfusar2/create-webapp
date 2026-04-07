package main 

import (
	"os"
	"log"
	"regexp"
	"path/filepath"
)

var project string
var backend string

func main() {
	FRONTEND_TS := map[string]string{
		"aside":  FRONTEND_ASIDE_TS,
		"cards":  FRONTEND_CARDS_SIMPLE_TS,
		"chart":  FRONTEND_CHART_TS,
		"models": FRONTEND_MODELS_TS,
		"details": FRONTEND_DETAILS_TS,
		"nav":    FRONTEND_NAV_TS,
		"tables": FRONTEND_TABLES_TS,
		"popup":  FRONTEND_POPUP_TS,
		"input":  FRONTEND_INPUT_TS,
	}
	FRONTEND_CSS := map[string]string{
		"aside":  FRONTEND_ASIDE_CSS,
		"cards":  FRONTEND_CARDS_SIMPLE_CSS,
		"chart":  FRONTEND_CHART_CSS,
		"models": FRONTEND_MODELS_CSS,
		"nav":    FRONTEND_NAV_CSS,
		"tables": FRONTEND_TABLES_CSS,
		"popup":  FRONTEND_POPUP_CSS,
	}


	//"dbConnection": FRONTEND_DBCONNECTION_TS,
	//"routes": FRONTEND_ROUTES_TS,
	//"utils": FRONTEND_UTILS_TS,

	re_backend := regexp.MustCompile(`--backend=(local|online)`)
	re_project := regexp.MustCompile(`--project=([a-zA-Z0-9]+)`)

	for _, a := range os.Args[1:] {
		match := re_backend.FindStringSubmatch(a)
		if match != nil { backend = match[1] }
		
		match = re_project.FindStringSubmatch(a)
		if match != nil { project = match[1] }
	}

	if(backend == "" || project == "") {log.Println("Devi specificare --project=??? e --backend=???"); os.Exit(1)}

	log.Println("NOME PROGETTO: '"+project+"'")
	log.Println("TIPOLOGIA: '"+backend+"'")

	createTS(FRONTEND_TS)
	createCSS(FRONTEND_CSS)
	createFileCSS("home", FRONTEND_HOME_CSS)
	createFileCSS("app", FRONTEND_APP_CSS)
	createFileTS("dbConnection", FRONTEND_DBCONNECTION_TS)
	createFileTS("routes", FRONTEND_ROUTES_TS)
	createFileTS("utils", FRONTEND_UTILS_TS)
	createFile("package.json", PACKAGEJSON)
	createFile("tsconfig.json", TSCONFIG)
	createFile(filepath.Join("app", "index.html"), HTML_PAGE)
	
	log.Println("CREAZIONE AMBIENTE-FRONTEND COMPLETATO")

	createDATABASE()
	createFile(filepath.Join("app", "database", "customers.json"), `[{"id": 0, "name": "customer1", "surname": "asdasd", "address": "adasd"}]`)


	if backend != "" {
		if backend == "local" {
			createFile(filepath.Join("app", "server.go"), BACKEND_GOLANG_MAIN)
			createFile(filepath.Join("app", "routes.go"), BACKEND_GOLANG_ROUTES)
			createFile(filepath.Join("app", "utils.go"),  BACKEND_GOLANG_UTILS)

		} else if backend == "online" {
			//...

		}
	}
	log.Println("CREAZIONE AMBIENTE-BACKEND COMPLETATO")
}


func createFile(name string, file_content string){
	os.WriteFile(
		filepath.Join(project, name),
		[]byte(file_content),
		0644,
	)
}
func createFileCSS(name string, file_content string){
	os.WriteFile(
		filepath.Join(project, "app", "static", "css", name+".css"), 
		[]byte(file_content),
		0644,
	)
}

func createFileTS(name string, file_content string){
	os.WriteFile(
		filepath.Join(project, "ts", "libs", name+".ts"), 
		[]byte(file_content),
		0644,
	)
}

func createDATABASE(){
	os.MkdirAll(filepath.Join(project, "app", "database"), 0755)
}

func createCSS(frontend map[string]string){
	for name, file_content := range frontend {
		os.MkdirAll(filepath.Join(project, "app", "static", "css", "libs", name), 0755)
		os.WriteFile(
			filepath.Join(project, "app", "static", "css", "libs", name, "init.css"), 
			[]byte(file_content),
			0644,
		)
	}
}

func createTS(frontend map[string]string){
	for name, file_content := range frontend {
		os.MkdirAll(filepath.Join(project, "ts", "libs", name), 0755)
		os.WriteFile(
			filepath.Join(project, "ts", "libs", name, "init.ts"), 
			[]byte(file_content),
			0644,
		)
	}
}
