package main

import (
	"os"
	"path/filepath"
	"strconv"
	"fmt"
)

var WORKDIR_TS_LIBS = filepath.Join("DEV", "ts", "libs")
var WORKDIR_CSS_LIBS = filepath.Join("DEV", "app", "static", "css", "libs")

var WORKDIR_CSS = filepath.Join("DEV", "app", "static", "css")

var WORKDIR_HOME = filepath.Join("DEV", "app")
var WORKDIR_PRJ = filepath.Join("DEV")
//var WORKDIR_DB = filepath.Join("DEV", "app", "database")

func main(){
	content_file := "package main\nconst (\n"
	
	//Typescirpt
	createVAR("FRONTEND_ASIDE_TS", filepath.Join(WORKDIR_TS_LIBS, "aside", "init.ts"), &content_file)
	createVAR("FRONTEND_CARDS_SIMPLE_TS", filepath.Join(WORKDIR_TS_LIBS, "cards", "init.ts"), &content_file)
	createVAR("FRONTEND_CHART_TS", filepath.Join(WORKDIR_TS_LIBS, "chart", "init.ts"), &content_file)
	createVAR("FRONTEND_DETAILS_TS", filepath.Join(WORKDIR_TS_LIBS, "details", "init.ts"), &content_file)
	createVAR("FRONTEND_INPUT_TS", filepath.Join(WORKDIR_TS_LIBS, "input", "init.ts"), &content_file)
	createVAR("FRONTEND_MODELS_TS", filepath.Join(WORKDIR_TS_LIBS, "models", "init.ts"), &content_file)
	createVAR("FRONTEND_NAV_TS", filepath.Join(WORKDIR_TS_LIBS, "nav", "init.ts"), &content_file)
	createVAR("FRONTEND_POPUP_TS", filepath.Join(WORKDIR_TS_LIBS, "popup", "init.ts"), &content_file)
	createVAR("FRONTEND_TABLES_TS", filepath.Join(WORKDIR_TS_LIBS, "tables", "init.ts"), &content_file)

	createVAR("FRONTEND_DBCONNECTION_TS", filepath.Join(WORKDIR_TS_LIBS, "dbConnection.ts"), &content_file)
	createVAR("FRONTEND_ROUTES_TS", filepath.Join(WORKDIR_TS_LIBS, "routes.ts"), &content_file)
	createVAR("FRONTEND_UTILS_TS", filepath.Join(WORKDIR_TS_LIBS, "utils.ts"), &content_file)

	//CSS
	createVAR("FRONTEND_ASIDE_CSS", filepath.Join(WORKDIR_CSS_LIBS, "aside", "init.css"), &content_file)
	createVAR("FRONTEND_CARDS_SIMPLE_CSS", filepath.Join(WORKDIR_CSS_LIBS, "cards", "init.css"), &content_file)
	createVAR("FRONTEND_CHART_CSS", filepath.Join(WORKDIR_CSS_LIBS, "chart", "init.css"), &content_file)
	createVAR("FRONTEND_DETAILS_CSS", filepath.Join(WORKDIR_CSS_LIBS, "details", "init.css"), &content_file)
	createVAR("FRONTEND_INPUT_CSS", filepath.Join(WORKDIR_CSS_LIBS, "input", "init.css"), &content_file)
	createVAR("FRONTEND_MODELS_CSS", filepath.Join(WORKDIR_CSS_LIBS, "models", "init.css"), &content_file)
	createVAR("FRONTEND_NAV_CSS", filepath.Join(WORKDIR_CSS_LIBS, "nav", "init.css"), &content_file)
	createVAR("FRONTEND_POPUP_CSS", filepath.Join(WORKDIR_CSS_LIBS, "popup", "init.css"), &content_file)
	createVAR("FRONTEND_TABLES_CSS", filepath.Join(WORKDIR_CSS_LIBS, "tables", "init.css"), &content_file)
	
	createVAR("FRONTEND_APP_CSS", filepath.Join(WORKDIR_CSS, "app.css"), &content_file)
	createVAR("FRONTEND_HOME_CSS", filepath.Join(WORKDIR_CSS, "home.css"), &content_file)
	createVAR("FRONTEND_PROGETTI_CSS", filepath.Join(WORKDIR_CSS, "progetti.css"), &content_file)
	
	//BACKEND
	createVAR("BACKEND_GOLANG_MAIN", filepath.Join(WORKDIR_HOME, "server.go"), &content_file)
	createVAR("BACKEND_GOLANG_ROUTES", filepath.Join(WORKDIR_HOME, "routes.go"), &content_file)
	createVAR("BACKEND_GOLANG_UTILS", filepath.Join(WORKDIR_HOME, "utils.go"), &content_file)
	createVAR("HTML_PAGE", filepath.Join(WORKDIR_HOME, "index.html"), &content_file)
	

	//LIBS (frontend)
	createVAR("PACKAGEJSON", filepath.Join(WORKDIR_PRJ, "package.json"), &content_file)
	createVAR("TSCONFIG", filepath.Join(WORKDIR_PRJ, "tsconfig.json"), &content_file)


	content_file += "\n)"

	os.WriteFile("const.go", []byte(content_file), 0644)
}

func createVAR(var_name string, path string, full_content *string) {
	content, err := os.ReadFile(path)
	if(err!= nil){fmt.Print(err); os.Exit(1)}

	*full_content += fmt.Sprintf(
		"\t%v = %v\n", var_name, strconv.Quote(string(content)),
	)
	
}
