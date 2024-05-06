package main

import (
	"fmt"
	"html"
	"io"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"forum.01/internal/filters"
	"forum.01/internal/models"
	"forum.01/internal/utils"
	"github.com/gofrs/uuid"
	"golang.org/x/crypto/bcrypt"
)

func (app *application) indexSPA(w http.ResponseWriter, r *http.Request) {
	app.renderLayoutSPA(w, r)
}

func (app *application) home(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/home" {
		w.WriteHeader(http.StatusNotFound)
		app.notFound(w, r, http.StatusNotFound)
		return
	}
	// Verification de la session
	var disconnected bool
	actualUser, err := app.validSession(r)
	if err != nil {
		disconnected = true
	}

	err = r.ParseForm()
	if err != nil {
		var Erreur Erreur
		Erreur.Code = http.StatusBadRequest
		data := &TemplateData{CodeStatus: Erreur}
		app.clientError(w, r, data.CodeStatus.Code)
		return
	}

	switch r.Method {
	case http.MethodGet:
		postsInfo, err := app.connDB.GetAllPostInfo(actualUser)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			app.serverError(w, r, err)
			return
		}
		categories, err := app.connDB.GetAllCategory()
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)

			app.serverError(w, r, err)
			return
		}
		badRequest := false

		if r.Form.Has("filter") {
			filterCheck := r.Form["filterCheck"]
			if len(filterCheck) > 0 {
				for _, fc := range filterCheck {
					if fc == "Liked-Post" {
						postsInfo = filters.LikedPostFilter(postsInfo)
					}
					if fc == "Created-Post" {
						postsInfo = filters.CreatedPostFilter(postsInfo, actualUser)
					}
					if fc != "Created-Post" && fc != "Liked-Post" {
						app.clientError(w, r, http.StatusBadRequest)
						return
					}
				}

			}
			categoriesCheck := r.Form["filterCategoryCheck"]
			if len(categoriesCheck) > 0 && len(categoriesCheck) <= len(categories) {
				postsInfo = filters.CategoryFilter(postsInfo, categoriesCheck...)
			} else if len(categoriesCheck) > len(categories) {
				app.clientError(w, r, http.StatusBadRequest)
				return
			}

			if len(postsInfo) == 0 {
				badRequest = true
			}

		}

		data := &TemplateData{Categores: categories, PostsInfo: postsInfo, BadRequestForm: badRequest, Disconnected: disconnected}

		// app.render(w, r, "base", "home", data)
		app.renderJSON(w, r, data)
		// app.renderLayoutSPA(w, r)

	case http.MethodPost:
		if disconnected {
			app.renderJSON(w, r, &TemplateData{Disconnected: true})
			return
		}
		postId := r.PostForm.Get("postId")
		pId, err := strconv.Atoi(postId)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			app.clientError(w, r, http.StatusBadRequest)
			return
		}
		if r.PostForm.Has("like") {
			liked := r.PostForm.Get("like")
			l, err := strconv.ParseBool(liked)
			if err != nil {
				app.renderJSON(w, r, &TemplateData{BadRequestForm: true})
				app.clientError(w, r, http.StatusBadRequest)
				return
			}

			_, err = app.connDB.SetLike(actualUser, pId, l)
			if err != nil {
				app.renderJSON(w, r, &TemplateData{BadRequestForm: true})
				app.serverError(w, r, err)
			}
		}
		if r.PostForm.Has("dislike") {
			disliked := r.PostForm.Get("dislike")
			dl, err := strconv.ParseBool(disliked)
			if err != nil {
				app.renderJSON(w, r, &TemplateData{BadRequestForm: true})
				app.clientError(w, r, http.StatusBadRequest)
				return
			}

			_, err = app.connDB.SetDislike(actualUser, pId, dl)
			if err != nil {
				app.renderJSON(w, r, &TemplateData{BadRequestForm: true})
				app.serverError(w, r, err)
			}
		}
		pInfo, err := app.connDB.GetPostInfo(pId, actualUser)
		if err != nil {
			app.renderJSON(w, r, &TemplateData{BadRequestForm: true})
			// app.serverError(w, r, err)
		}
		// http.Redirect(w, r, "/home", http.StatusSeeOther)
		app.renderJSON(w, r, &TemplateData{BadRequestForm: false, PostInfo: pInfo})

	default:
		app.clientError(w, r, http.StatusMethodNotAllowed)
		return
	}
}

func (app *application) create(w http.ResponseWriter, r *http.Request) {
	actualUser, err := app.validSession(r)
	if err != nil {
		http.Redirect(w, r, "/logout", http.StatusSeeOther)
		return
	}

	// Action selon la methode d'entrée
	switch r.Method {
	case http.MethodGet:
		categories, err := app.connDB.GetAllCategory()
		if err != nil {
			app.serverError(w, r, err)
			return
		}
		bad := r.URL.Query().Has("bad")
		data := &TemplateData{Categores: categories, BadRequestForm: bad}

		// app.render(w, r, "base", "form", data)
		app.renderJSON(w, r, data)

	case http.MethodPost:
		err := r.ParseForm()
		if err != nil {
			app.clientError(w, r, http.StatusBadRequest)
			return
		}

		fileImg, fileHeaderImg, err := r.FormFile("imagePost")
		var nameImg string
		// if err == nil marche mais celui là en bas ne marche pas :)
		if err == nil {
			if int(fileHeaderImg.Size) > 20000000 || !utils.ImageValidation(fileImg) {
				// http.Redirect(w, r, "/create?bad", http.StatusSeeOther)
				app.renderJSON(w, r, &TemplateData{BadRequestForm: true})
				return
			}
			if _, err := fileImg.Seek(0, io.SeekStart); err != nil {
				fmt.Println("Error resetting file reader position:", err)
				return
			}
			nameImg = time.Now().Format("20060102_150405") + fileHeaderImg.Filename
			dst, err := os.Create("./ui/static/uploads/" + nameImg)
			if err != nil {
				app.serverError(w, r, err)
				return
			}
			defer dst.Close()
			_, err = io.Copy(dst, fileImg)
			if err != nil {
				app.serverError(w, r, err)
				return
			}

		} else {
			app.infoLog.Println(err, " --Pas d'image set")
		}
		// faire une fonction pour la logique de validation des donnees
		// la fonction retourne une boolean si donne bonne ou pas
		categoryIds := r.Form["categorCheck"]
		content := r.PostForm.Get("content")
		escapedContent := html.EscapeString(content)

		fmt.Println("id : ", r.Form)
		max, err := app.connDB.GetNumberCategory()
		if err != nil {
			app.errorLog.Fatal(err)
		}
		for _, v := range categoryIds {
			id, err := strconv.Atoi(v)
			if err != nil {
				app.serverError(w, r, err)
				return
			}
			if id <= 0 || id > max {
				app.clientError(w, r, http.StatusBadRequest)
				return
			}
		}
		if len(categoryIds) == 0 || strings.TrimSpace(escapedContent) == "" {
			// http.Redirect(w, r, "/create?bad", http.StatusSeeOther)
			app.renderJSON(w, r, &TemplateData{BadRequestForm: true})
			return
		}
		lastPostId, err := app.connDB.SetPost(escapedContent, nameImg, actualUser)
		if err != nil {
			app.serverError(w, r, err)
			return
		}

		for _, categoryId := range categoryIds {
			cId, err := strconv.Atoi(strings.TrimSpace(categoryId))
			if err != nil {
				app.clientError(w, r, http.StatusBadRequest)
				return
			}
			_, err = app.connDB.SetPostCategory(lastPostId, cId)
			if err != nil {
				app.serverError(w, r, err)
				return
			}
		}

		app.renderJSON(w, r, &TemplateData{BadRequestForm: false})

	default:
		app.clientError(w, r, http.StatusMethodNotAllowed)
		return
	}
}

func (app *application) comment(w http.ResponseWriter, r *http.Request) {
	// Verification de la session
	actualUser, err := app.validSession(r)
	var disconnected bool
	if err != nil {
		disconnected = true
	}

	// Recuperation de l'id dans l'url
	idPostUrlVal := r.URL.Query()
	if len(idPostUrlVal) != 1 {
		app.clientError(w, r, http.StatusBadRequest)
		return
	}
	var (
		pId int
	)

	for key := range idPostUrlVal {
		pId, err = strconv.Atoi(key)
		if err != nil {
			app.clientError(w, r, http.StatusBadRequest)
			return
		}
	}

	switch r.Method {
	case http.MethodGet:
		postInfo, err := app.connDB.GetPostInfo(pId, actualUser)
		if err != nil {
			app.clientError(w, r, http.StatusBadRequest)
			return
		}

		commentsInfo, err := app.connDB.GetCommentsInfoByPost(actualUser, pId)
		if err != nil {
			app.serverError(w, r, err)
			return
		}

		data := &TemplateData{PostInfo: postInfo, CommentsInfo: commentsInfo, Disconnected: disconnected}
		// app.render(w, r, "base", "comment", data)
		app.renderJSON(w, r, data)

	case http.MethodPost:
		err := r.ParseForm()
		if err != nil {
			app.clientError(w, r, http.StatusBadRequest)
			return
		}

		if r.PostForm.Has("like") {
			liked := r.PostForm.Get("like")
			l, err := strconv.ParseBool(liked)
			if err != nil {
				app.clientError(w, r, http.StatusBadRequest)
				return
			}

			_, err = app.connDB.SetLike(actualUser, pId, l)
			if err != nil {
				app.serverError(w, r, err)
				return
			}
		}
		if r.PostForm.Has("dislike") {
			disliked := r.PostForm.Get("dislike")
			dl, err := strconv.ParseBool(disliked)
			if err != nil {
				app.clientError(w, r, http.StatusBadRequest)
				return
			}

			_, err = app.connDB.SetDislike(actualUser, pId, dl)
			if err != nil {
				app.serverError(w, r, err)
				return
			}
		}

		var commentInfo *models.CommentInfo

		if r.PostForm.Has("send-comment") {
			comment := r.PostForm.Get("comment")
			escapedComment := html.EscapeString(comment)
			if len(escapedComment) > 0 {
				cId, err := app.connDB.SetComment(escapedComment, pId, actualUser)
				if err != nil {
					app.serverError(w, r, err)
					return
				}
				commentInfo, err = app.connDB.GetCommentInfoById(actualUser, cId)
				if err != nil {
					app.serverError(w, r, err)
					return
				}
			}
		}
		if r.PostForm.Has("likeComment") {
			liked := r.PostForm.Get("likeComment")
			l, err := strconv.ParseBool(liked)
			if err != nil {
				app.clientError(w, r, http.StatusBadRequest)
				return
			}
			commentId, err := strconv.Atoi(r.PostForm.Get("commentId"))
			if err != nil {
				app.clientError(w, r, http.StatusBadRequest)
				return
			}
			_, err = app.connDB.SetLikeComments(actualUser, commentId, l)
			if err != nil {
				app.serverError(w, r, err)
				return
			}

			commentInfo, err = app.connDB.GetCommentInfoById(actualUser, commentId)
			if err != nil {
				app.serverError(w, r, err)
				return
			}
		}
		if r.PostForm.Has("dislikeComment") {
			disliked := r.PostForm.Get("dislikeComment")
			dl, err := strconv.ParseBool(disliked)
			if err != nil {
				app.clientError(w, r, http.StatusBadRequest)
				return
			}
			commentId, err := strconv.Atoi(r.PostForm.Get("commentId"))
			if err != nil {
				app.clientError(w, r, http.StatusBadRequest)
				return
			}

			_, err = app.connDB.SetDislikeComments(actualUser, commentId, dl)
			if err != nil {
				app.serverError(w, r, err)
				return
			}

			commentInfo, err = app.connDB.GetCommentInfoById(actualUser, commentId)
			if err != nil {
				app.serverError(w, r, err)
				return
			}
		}

		// http.Redirect(w, r, fmt.Sprintf("/comment?%d", pId), http.StatusSeeOther)
		app.renderJSON(w, r, &TemplateData{CommentInfo: commentInfo, BadRequestForm: false})

	default:
		app.clientError(w, r, http.StatusMethodNotAllowed)
		return
	}
}

func (app *application) login(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		actualUser, err := app.validSession(r)
		if err != nil {
			fmt.Println(err)
		}
		if actualUser != 0 {
			http.Redirect(w, r, "/", http.StatusSeeOther)
			return
		}
		bad := r.URL.Query().Has("bad")
		data := &TemplateData{BadRequestForm: bad}

		// app.render(w, r, "baseLogRegis", "login", data)
		app.renderJSON(w, r, data)

	case http.MethodPost:
		err := r.ParseForm()
		if err != nil {
			app.clientError(w, r, http.StatusBadRequest)
			return
		}
		email := r.PostForm.Get("email")
		password := r.PostForm.Get("password")
		if !utils.EmailValidation(email) || !utils.PasswordValidation(password) {
			// http.Redirect(w, r, "/login?bad", http.StatusSeeOther)
			app.renderJSON(w, r, &TemplateData{BadRequestForm: true})
			return
		}

		user, err := app.connDB.GetUserByMail(email)
		if err != nil {
			// http.Redirect(w, r, "/login?bad", http.StatusSeeOther)
			app.renderJSON(w, r, &TemplateData{BadRequestForm: true})
			return
		}
		err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
		if err != nil {
			http.Redirect(w, r, "/login?bad", http.StatusSeeOther)
			return
		}
		/*
			Logique de creation de session ici
		*/
		u, err := uuid.NewV4()

		if err != nil {
			app.serverError(w, r, err)
			return
		}
		cookies := http.Cookie{
			Name:     "session_token",
			Value:    u.String(),
			Secure:   true,
			Expires:  time.Now().Add(60 * time.Minute),
			HttpOnly: true,
		}
		app.Session[u.String()] = user.User_id
		http.SetCookie(w, &cookies)

		// http.Redirect(w, r, "/", http.StatusSeeOther)
		app.renderJSON(w, r, &TemplateData{BadRequestForm: false})

	default:
		app.clientError(w, r, http.StatusBadRequest)
		return
	}
}

func (app *application) register(w http.ResponseWriter, r *http.Request) {

	switch r.Method {
	case http.MethodGet:
		actualUser, err := app.validSession(r)
		if err != nil {
			fmt.Println(err)
		}
		if actualUser != 0 {
			http.Redirect(w, r, "/", http.StatusSeeOther)
			return
		}
		bad := r.URL.Query().Has("bad")
		data := &TemplateData{BadRequestForm: bad}
		// app.render(w, r, "baseLogRegis", "register", data)
		app.renderJSON(w, r, data)

	case http.MethodPost:
		err := r.ParseForm()
		if err != nil {
			app.clientError(w, r, http.StatusBadRequest)
			return
		}

		username := r.PostForm.Get("username")
		email := r.PostForm.Get("email")
		password := r.PostForm.Get("password")
		fmt.Println("---------", r.PostForm)
		if !utils.UsernameValidation(username) || !utils.EmailValidation(email) || !utils.PasswordValidation(password) {
			// http.Redirect(w, r, "/register?bad", http.StatusSeeOther)
			app.renderJSON(w, r, &TemplateData{BadRequestForm: true})
			return
		}

		encryptPass, err := bcrypt.GenerateFromPassword([]byte(password), 12)
		if err != nil {
			// http.Redirect(w, r, "/register?bad", http.StatusSeeOther)
			app.renderJSON(w, r, &TemplateData{BadRequestForm: true})
			return
		}
		password = string(encryptPass)
		userId, err := app.connDB.SetUser(username, email, password)
		if err != nil {
			if err.Error() == "UNIQUE constraint failed: User.username" {
				// http.Redirect(w, r, "/register?bad", http.StatusSeeOther)
				app.renderJSON(w, r, &TemplateData{BadRequestForm: true})
				return
			}
			if err.Error() == "UNIQUE constraint failed: User.email" {
				// http.Redirect(w, r, "/register?bad", http.StatusSeeOther)
				app.renderJSON(w, r, &TemplateData{BadRequestForm: true})
				return
			}
			app.serverError(w, r, err)
			return
		}
		/*
			Logique de creation de session ici
		*/
		u, err := uuid.NewV4()

		if err != nil {
			app.serverError(w, r, err)
			return
		}
		cookies := http.Cookie{
			Name:     "session_token",
			Value:    u.String(),
			Secure:   true,
			Expires:  time.Now().Add(60 * time.Minute),
			HttpOnly: true,
			SameSite: http.SameSiteNoneMode,
		}
		app.Session[u.String()] = userId

		http.SetCookie(w, &cookies)
		// http.Redirect(w, r, "/", http.StatusSeeOther)
		app.renderJSON(w, r, &TemplateData{BadRequestForm: false})

	default:
		app.clientError(w, r, http.StatusBadRequest)
		return
	}
}

func (app *application) logout(w http.ResponseWriter, r *http.Request) {
	cookie, err := r.Cookie("session_token")
	if err == nil {
		delete(app.Session, cookie.Value)
	}
	// http.Redirect(w, r, "/login", http.StatusSeeOther)
	app.renderJSON(w, r, &TemplateData{BadRequestForm: false})
}

func (app *application) chat(w http.ResponseWriter, r *http.Request) {
	// Verification de la session
	actualUser, err := app.validSession(r)
	var disconnected bool
	if err != nil {
		disconnected = true
	}

	switch r.Method {
	case http.MethodGet:
		if disconnected {
			app.renderJSON(w, r, &TemplateData{Disconnected: true})
			return
		}
		// ON cree la connexion en changeant la connexion http en une connexion websocket (tcp)
		conn, err := Upgradero.Upgrade(w, r, nil)
		if err != nil {
			app.serverError(w, r, err)
			return
		}

		// ON append dans le tableau de client la connexion
		Clients[actualUser] = conn

		// Une fois la connexion créée on rentre une infinite loop
		for {
			// On lit le message
			msgType, msg, err := conn.ReadMessage()
			if err != nil {
				app.serverError(w, r, err)
				return
			}
			text := string(msg)
			receiverTrace := strings.Split(text, "\n")
			receiverId, err := strconv.Atoi(receiverTrace[len(receiverTrace)-1]) 
			if err != nil {
				app.serverError(w, r, err)
				return
			}

			app.connDB.SetMessage(string(msg), actualUser, receiverId)

			for idClient, connClient := range Clients {
				if idClient == receiverId {
					// Envoyer le message au client destinataire
					err := connClient.WriteMessage(msgType, msg)
					if err != nil {
						app.serverError(w, r, err)
						return
					}
					break
				}
			}

		}

	}
}
