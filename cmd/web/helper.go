package main

import (
	"fmt"
	"net/http"
	"runtime/debug"
)

type Erreur struct {
	Code int
}

// handler of the error server
func (app *application) serverError(w http.ResponseWriter, r *http.Request, err error) {
	trace := fmt.Sprintf("%s\n%s", err.Error(), debug.Stack())
	app.errorLog.Output(2, trace)
	var code Erreur
	code.Code = http.StatusInternalServerError
	w.WriteHeader(code.Code)
	data := &TemplateData{CodeStatus: code}
	app.render(w, r, "baseLogRegis", "error", data)
	// http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
}

// handler of the error client
func (app *application) clientError(w http.ResponseWriter, r *http.Request, status int) {
	w.WriteHeader(status)
	var code Erreur
	code.Code = status
	data := &TemplateData{CodeStatus: code}
	app.render(w, r, "baseLogRegis", "error", data)

}

// handler of the not the found page error
func (app *application) notFound(w http.ResponseWriter, r *http.Request, status int) {
	w.WriteHeader(status)
	var code Erreur
	code.Code = status
	data := &TemplateData{CodeStatus: code}
	app.render(w, r, "baseLogRegis", "error", data)
}
