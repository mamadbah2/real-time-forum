package models

type User struct {
	User_id        int
	Username       string
	Email          string
	Password       string
	LikeCounter    int
	CommentCounter int
}

func (m *ConnDB) GetUser(id int) (*User, error) {
	statement := `SELECT * FROM User WHERE user_id = ?`
	row := m.DB.QueryRow(statement, id)
	user := &User{}
	err := row.Scan(&user.User_id, &user.Username, &user.Email, &user.Password)
	if err != nil {
		return nil, err
	}
	return user, nil
}

func (m *ConnDB) SetUser(username, email, password string) (int, error) {
	statement := `INSERT INTO User(username, email, password) VALUES (?, ?, ?)`
	result, err := m.DB.Exec(statement, username, email, password)
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
	statement := `SELECT * FROM User WHERE email = ?`
	row := m.DB.QueryRow(statement, email)
	user := &User{}
	err := row.Scan(&user.User_id, &user.Username, &user.Email, &user.Password)
	if err != nil {
		return nil, err
	}
	return user, nil
}

func (m *ConnDB) GetAllUser() ([]*User, error) {
	statement := `SELECT user_id, username FROM User`
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
	return users, nil
}
