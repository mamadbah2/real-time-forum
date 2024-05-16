package models

import (
	"strings"
)

type User struct {
	User_id        int
	Username       string
	age            int
	gender         string
	firstname      string
	lastname       string
	Email          string
	Password       string
	LikeCounter    int
	CommentCounter int
}

func (m *ConnDB) GetUser(id int) (*User, error) {
	statement := `SELECT * FROM User WHERE user_id = ?`
	row := m.DB.QueryRow(statement, id)
	user := &User{}
	err := row.Scan(&user.User_id, &user.Username, &user.age, &user.gender, &user.firstname, &user.lastname, &user.Email, &user.Password)
	if err != nil {
		return nil, err
	}
	return user, nil
}

func (m *ConnDB) SetUser(username string, age int, gender, firstname, lastname, email, password string) (int, error) {
	statement := `INSERT INTO User(username, age, gender, firstname, lastname, email, password) VALUES (?, ?, ?, ?, ?, ?, ?)`
	result, err := m.DB.Exec(statement, strings.ToLower(username), age, gender, firstname, lastname, email, password)
	if err != nil {
		return 0, err
	}
	id, err := result.LastInsertId()
	if err != nil {
		return 0, err
	}
	return int(id), nil
}

func (m *ConnDB) GetUserByMail(email string) (*User, error) {
	statement := `SELECT user_id, username, email, password FROM User WHERE email = ?`
	row := m.DB.QueryRow(statement, email)
	user := &User{}
	err := row.Scan(&user.User_id, &user.Username, &user.Email, &user.Password)
	if err != nil {
		return nil, err
	}
	return user, nil
}

func (m *ConnDB) GetUserByNickname(username string) (*User, error) {
	statement := `SELECT user_id, username, email, password FROM User WHERE username = ?`
	row := m.DB.QueryRow(statement, username)
	user := &User{}
	err := row.Scan(&user.User_id, &user.Username, &user.Email, &user.Password)
	if err != nil {
		return nil, err
	}
	return user, nil
}

func (m *ConnDB) GetAllUserSortedByLastSent(actualUser int) ([]*User, error) {
	statement := `SELECT user_id, username FROM User ORDER BY username ASC`
	rows, err := m.DB.Query(statement)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var users []*User
	for rows.Next() {
		u := &User{}
		err = rows.Scan(&u.User_id, &u.Username)
		if err != nil {
			return nil, err
		}
		users = append(users, u)
	}

	// Recuperation par dernier envoyeur
	statement = `SELECT DISTINCT m.receiver_id, u.username FROM Messages m INNER JOIN User u ON m.receiver_id = u.user_id WHERE m.sender_id = ? ORDER BY m.creation_date DESC`
	rows, err = m.DB.Query(statement, actualUser)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var usersMsg []*User
	for rows.Next() {
		u := &User{}
		err = rows.Scan(&u.User_id, &u.Username)
		if err != nil {
			return nil, err
		}
		usersMsg = append(usersMsg, u)
	}

	var sortedTable []*User
	sortedTable = append(sortedTable, usersMsg...)
	for _, us := range users {
		added := true
		for _, sus := range sortedTable {
			if us.User_id == sus.User_id {
				added = false
				break
			}
		}
		if added {
			sortedTable = append(sortedTable, us)
		}
	}
	return sortedTable, nil
}
