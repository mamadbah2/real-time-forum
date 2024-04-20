package models

import (
	"database/sql"
	"errors"
)

type ReactionComments struct {
	LikeDislike_id int
	User_id        int
	Comment_id     int
	Liked          bool
	Disliked       bool
}

func (m *ConnDB) GetLikeDislikePC(user_id int, comment_id int) (*ReactionComments, error) {
	statement := `SELECT like_dislike_id, liked, disliked FROM ReactionComments WHERE user_id=? AND comment_id=?`
	row := m.DB.QueryRow(statement, user_id, comment_id)
	ld := &ReactionComments{}
	err := row.Scan(&ld.LikeDislike_id, &ld.Liked, &ld.Disliked)
	if err != nil {
		return nil, err
	}
	return ld, nil
}

func (m *ConnDB) SetLikeComments(userId int, commentid int, liked bool) (int, error) {
	_, err := m.GetLikeDislikePC(userId, commentid)
	if err != nil && !errors.Is(err, sql.ErrNoRows) {
		return 0, err
	}
	if errors.Is(err, sql.ErrNoRows) {
		statement := `INSERT INTO ReactionComments (user_id, comment_id, liked, disliked) VALUES (?, ?, TRUE, FALSE)`

		result, err := m.DB.Exec(statement, userId, commentid)
		if err != nil {
			return 0, err
		}
		id, err := result.LastInsertId()
		if err != nil {
			return 0, err
		}
		return int(id), nil
	}
	var statement string
	if !liked {
		statement = `UPDATE ReactionComments SET liked = TRUE, disliked = FALSE WHERE user_id=? AND comment_id=?`
	} else {
		statement = `UPDATE ReactionComments SET liked = FALSE WHERE user_id=? AND comment_id=?`
	}
	result, err := m.DB.Exec(statement, userId, commentid)
	if err != nil {
		return 0, err
	}
	id, err := result.LastInsertId()
	if err != nil {
		return 0, err
	}
	return int(id), nil
}


func (m *ConnDB) SetDislikeComments(userId int, comment_id int, disliked bool) (int, error) {
	_, err := m.GetLikeDislikePC(userId, comment_id)
	if err != nil && !errors.Is(err, sql.ErrNoRows) {
		return 0, err
	}
	if errors.Is(err, sql.ErrNoRows) {
		statement := `INSERT INTO ReactionComments (user_id, comment_id, liked, disliked) VALUES (?, ?, FALSE, TRUE)`

		result, err := m.DB.Exec(statement, userId, comment_id)
		if err != nil {
			return 0, err
		}
		id, err := result.LastInsertId()
		if err != nil {
			return 0, err
		}
		return int(id), nil
	}
	var statement string
	if !disliked {
		statement = `UPDATE ReactionComments SET liked = FALSE, disliked = TRUE WHERE user_id=? AND comment_id=?`
	} else {
		statement = `UPDATE ReactionComments SET disliked = FALSE WHERE user_id=? AND comment_id=?`
	}
	result, err := m.DB.Exec(statement, userId, comment_id)
	if err != nil {
		return 0, err
	}
	id, err := result.LastInsertId()
	if err != nil {
		return 0, err
	}
	return int(id), nil
}

func (m *ConnDB) getLikeNumberByComment(comment_id int) (int, error) {
	statement := `SELECT COUNT(*) FROM ReactionComments WHERE liked=TRUE AND comment_id= ?`
	row := m.DB.QueryRow(statement, comment_id)
	var counter int
	err := row.Scan(&counter)
	if err != nil {
		return 0, err
	}
	return counter, nil
}

func (m *ConnDB) getDislikeNumberByComment(comment_id int) (int, error) {
	statement := `SELECT COUNT(*) FROM ReactionComments WHERE disliked=TRUE AND comment_id= ?`
	row := m.DB.QueryRow(statement, comment_id)
	var counter int
	err := row.Scan(&counter)
	if err != nil {
		return 0, err
	}
	return counter, nil
}