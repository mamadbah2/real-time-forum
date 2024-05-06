package models

import "time"

type Message struct {
	Message_id int
	Content string
	Date_Creation time.Time
	Sender_id int
	Receiver_id int
}

func (m *ConnDB) getMessagesByConversation(senderId, receiverId int) ([]*Message, error ){
	statement := `SELECT * FROM Messages WHERE senderId = ? AND receiverId = ?`
	rows, err := m.DB.Query(statement, senderId, receiverId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var Messages []*Message
	for rows.Next() {
		m := &Message{}
		err := rows.Scan(&m.Message_id, &m.Content, &m.Date_Creation, &m.Sender_id, &m.Receiver_id)
		if err != nil {
			return nil, err
		}
		Messages = append(Messages, m)
	}
	return Messages, nil
}

func (m *ConnDB) SetMessage(content string, senderId, receiverId int) (int, error) {
	statement := `INSERT INTO Messages (content, date_creation, sender_id, receiver_id) 
	VALUES (?, CURRENT_TIMESTAMP, ?, ?)`
	result, err := m.DB.Exec(statement, content,senderId, receiverId)
	if err != nil {
		return 0, err
	}
	id, err := result.LastInsertId()
	if err != nil {
		return 0, err
	}
	return int(id), nil
}