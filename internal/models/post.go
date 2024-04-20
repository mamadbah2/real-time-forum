package models

import (
	"database/sql"
	"errors"
	"time"
)

type Post struct {
	Post_id       int
	Content       string
	ImageName     string
	Creation_Date time.Time
	User_id       int
}

type PostInfo struct {
	Post_id           int
	Username          string
	Creation_Date     string
	Content           string
	ImageName         string
	Categories        []string
	LikeActualUser    bool
	DislikeActualUser bool
	Like_Number       int
	Dislike_Number    int
	Comment_Number    int
	User_id           int
	Active            int
}

func (m *ConnDB) getPost(postId int) (*Post, error) {
	statement := `SELECT * FROM Post WHERE post_id = ?`
	rows := m.DB.QueryRow(statement, postId)
	p := &Post{}
	err := rows.Scan(&p.Post_id, &p.Content, &p.ImageName, &p.Creation_Date, &p.User_id)
	if err != nil {
		return nil, err
	}
	return p, nil
}

func (m *ConnDB) GetPostInfo(postId, actualUserId int) (*PostInfo, error) {
	postInfo := &PostInfo{}
	post, err := m.getPost(postId)
	if err != nil {
		return nil, err
	}

	//Parse data in new variable postInfo

	postInfo.Post_id = post.Post_id
	postInfo.Creation_Date = post.Creation_Date.String()
	postInfo.Content = post.Content
	postInfo.ImageName = post.ImageName

	user, err := m.GetUser(post.User_id)
	if err != nil {
		return nil, err
	}
	postInfo.Username = user.Username

	categories, err := m.GetCategoriesByPost(post.Post_id)
	if err != nil {
		return nil, err
	}
	for _, c := range categories {
		postInfo.Categories = append(postInfo.Categories, c.Name)
	}

	counterLike, err := m.getLikeNumberByPost(post.Post_id)
	if err != nil {
		return nil, err
	}
	postInfo.Like_Number = counterLike

	counterDisLike, err := m.getDislikeNumberByPost(post.Post_id)
	if err != nil {
		return nil, err
	}
	postInfo.Dislike_Number = counterDisLike

	counterComment, err := m.getCommentNumberByPost(post.Post_id)
	if err != nil {
		return nil, err
	}
	postInfo.Comment_Number = counterComment

	likdislik, err := m.getLikeDislikePU(actualUserId, post.Post_id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			postInfo.LikeActualUser = false
			postInfo.DislikeActualUser = false
		} else {
			return nil, err
		}

	} else {
		postInfo.LikeActualUser = likdislik.Liked
		postInfo.DislikeActualUser = likdislik.Disliked
	}

	//For Have the color if we like
	if postInfo.LikeActualUser {
		postInfo.Active = 1
	} else if postInfo.DislikeActualUser {
		postInfo.Active = 2
	}
	postInfo.User_id = post.User_id

	return postInfo, nil
}

func (m *ConnDB) SetPost(content, imageName string, userId int) (int, error) {
	statement := `INSERT INTO Post (content, image_name, creation_date, user_id) VALUES (?, ?, CURRENT_TIMESTAMP, ?) `
	result, err := m.DB.Exec(statement, content, imageName, userId)
	if err != nil {
		return 0, err
	}
	id, err := result.LastInsertId()
	if err != nil {
		return 0, err
	}
	return int(id), nil
}

func (m *ConnDB) GetAllPost() ([]*Post, error) {
	statement := `SELECT * FROM Post ORDER BY post_id DESC`
	rows, err := m.DB.Query(statement)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	posts := []*Post{}
	for rows.Next() {
		p := &Post{}
		rows.Scan(&p.Post_id, &p.Content, &p.ImageName, &p.Creation_Date, &p.User_id)
		posts = append(posts, p)
	}
	return posts, nil
}

func (m *ConnDB) GetAllPostInfo(actualUserId int) ([]*PostInfo, error) {
	posts, err := m.GetAllPost()
	postsInfo := []*PostInfo{}
	if err != nil {
		return nil, err
	}

	for _, post := range posts {
		postInfo, err := m.GetPostInfo(post.Post_id, actualUserId)
		if err != nil {
			return nil, err
		}
		postsInfo = append(postsInfo, postInfo)
	}

	return postsInfo, nil
}
