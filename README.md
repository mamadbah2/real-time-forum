# FORUM &#x1F4AC;

## DESCRIPTION

This project consists in creating a real time web forum that allows :\
    communication between users.\
    associating categories to posts.\
    liking and disliking posts and comments.\
    filtering posts.\
    chat between users.

## Key Features

### Registration and Login
- Users must register to access the forum.
- Registration form must include:
  - Nickname
  - Age
  - Gender
  - First Name
  - Last Name
  - Email
  - Password
- Users can log in using either their nickname or email combined with their password.
- Users must be able to log out from any page on the forum.

### Posts and Comments
- Users can create posts with categories.
- Users can comment on posts.
- Posts are displayed in a feed.
- Comments are visible when a post is clicked.

### Private Messages
- Users can send private messages to each other.
- Chat section shows online/offline status and organizes by the last message sent or alphabetically if no messages exist.
- Clicking on a user reloads past messages.
- Chats display the last 10 messages initially, with more loaded on scroll.
- Messages include a timestamp and sender's username.
- Real-time messaging using WebSockets.

## Implementation Details

### Backend: Golang
- **WebSockets**: For real-time communication between users.
- **SQLite**: For storing data.
- **Handlers**: To manage user sessions, posts, comments, and chat functionalities.

### Frontend: JavaScript
- **Single Page Application (SPA)**: All changes are handled in JavaScript to maintain a single HTML file.
- **Event Handling**: For user interactions like post creation, commenting, and messaging.
- **WebSocket Client**: To handle real-time updates.

### HTML and CSS
- **HTML**: Organizes page elements.
- **CSS**: Styles the page elements.



## HOW TO RUN IT   
* Run it on the terminal
```bash
go run ./cmd/web/.
```

## Captures d'écran
![Screenshot 1](ui/img/Screenshot from 2024-05-20 04-55-41)


## Structure

`cmd`:Emplacement of the handlers, SessionManager, the main function and so on\
`db`:Emplacement of the database and the migration file\
`internal`:Emplacement of the functions for all the Interactive stuff(liking,disliking,commenting..)\
`ui`:Emplacement of the html, css code and the uploads images\
`js`:Emplacement des fichier js\


## AUTHORS
[mamadbah](https://learn.zone01dakar.sn/git/mamadbah)\
[belhadjs](https://learn.zone01dakar.sn/git/belhadjs)