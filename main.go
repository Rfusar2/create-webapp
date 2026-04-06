package main 

import (
	"os"
	"log"
	"regexp"
	"path/filepath"
)

func main() {
	FRONTEND_TS := map[string]string{
		"aside":  FRONTEND_ASIDE_TS,
		"cards":  FRONTEND_CARDS_SIMPLE_TS,
		"chart":  FRONTEND_CHART_TS,
		"models": FRONTEND_MODELS_TS,
		"nav":    FRONTEND_NAV_TS,
		"popup":  FRONTEND_POPUP_TS,
	}
	FRONTEND_CSS := map[string]string{
		"aside":  FRONTEND_ASIDE_CSS,
		"cards":  FRONTEND_CARDS_SIMPLE_CSS,
		"chart":  FRONTEND_CHART_CSS,
		"models": FRONTEND_MODELS_CSS,
		"nav":    FRONTEND_NAV_CSS,
		"popup":  FRONTEND_POPUP_CSS,
	}


	//"dbConnection": FRONTEND_DBCONNECTION_TS,
	//"routes": FRONTEND_ROUTES_TS,
	//"utils": FRONTEND_UTILS_TS,

	re_backend := regexp.MustCompile(`^--backend=(flask|golang)$`)

	backend := ""
	for _, a := range os.Args[1:] {
		match := re_backend.FindStringSubmatch(a)
		if match != nil { backend = match[1] }
	}

	log.Println(backend)

	if backend != "" {
		os.MkdirAll(filepath.Join("app", "backend"), 0755)
		if backend == "golang" {
			createFile("server.go", BACKEND_GOLANG_MAIN)
			createFile("routes.go", BACKEND_GOLANG_ROUTES)
			createFile("utils.go",  BACKEND_GOLANG_UTILS)

		} else if backend == "flask" {
			//...

		}
	}

	createTS(FRONTEND_TS)
	createCSS(FRONTEND_CSS)

	createFileTS("dbConnection", FRONTEND_DBCONNECTION_TS)
	createFileTS("routes", FRONTEND_ROUTES_TS)
	createFileTS("utils", FRONTEND_UTILS_TS)
	
	createFileJSON("package", PACKAGEJSON)
	createFileJSON("tsconfig", TSCONFIG)

	os.WriteFile(
		filepath.Join("app", "index.html"), 
		[]byte(HTML_PAGE),
		0644,
	)
}


func createFile(name string, file_content string){
	os.WriteFile(
		filepath.Join("app", "backend", name),
		[]byte(file_content),
		0644,
	)
}

func createFileJSON(name string, file_content string){
	os.WriteFile(
		filepath.Join("app", name+".json"), 
		[]byte(file_content),
		0644,
	)
}

func createFileTS(name string, file_content string){
	os.WriteFile(
		filepath.Join("app", "ts", name+".ts"), 
		[]byte(file_content),
		0644,
	)
}

func createCSS(frontend map[string]string){
	for name, file_content := range frontend {
		os.MkdirAll(filepath.Join("app", "static", name), 0755)
		os.WriteFile(
			filepath.Join("app", "static", name, "init.css"), 
			[]byte(file_content),
			0644,
		)
	}
}

func createTS(frontend map[string]string){

	for name, file_content := range frontend {
		os.MkdirAll(filepath.Join("app", "ts", name), 0755)
		os.WriteFile(
			filepath.Join("app", "ts", name, "init.ts"), 
			[]byte(file_content),
			0644,
		)
	}
}
