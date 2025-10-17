# 💬 Real-Time Forum

A modern, interactive web forum built with Go and JavaScript featuring real-time messaging capabilities through WebSockets. This project demonstrates full-stack development skills with a focus on concurrent programming, real-time communication, and modern web architecture.

[![Go Version](https://img.shields.io/badge/Go-1.22.0-00ADD8?logo=go)](https://go.dev/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![SQLite](https://img.shields.io/badge/SQLite-3-003B57?logo=sqlite)](https://www.sqlite.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)

## 🎯 Project Overview

This real-time forum is a complete web application that enables users to create posts, comment, interact through likes/dislikes, and communicate via private messages in real-time. Built as a Single Page Application (SPA), it provides a seamless user experience without page reloads while maintaining secure authentication and data persistence.

---

## ✨ Key Features

### 👤 User Authentication & Management
- **Complete Registration System** with comprehensive user profiles:
  - Nickname, Age, Gender
  - First Name, Last Name
  - Email and secure password storage
- **Flexible Login**: Users can authenticate using either nickname or email
- **Session Management**: Secure session handling with UUID-based tokens and logout functionality
- **Password Encryption**: Using bcrypt for secure password hashing

### 📝 Posts & Comments
- Create posts with multiple category associations
- Comment on posts with nested display
- Feed-based post display for easy browsing
- Click-to-expand post details with full comment thread
- Image upload support for posts

### 👍 Interactive Features
- Like and dislike posts
- Like and dislike comments
- Real-time post filtering by categories
- Dynamic UI updates without page refresh
- Interaction tracking and counters

### 💬 Real-Time Private Messaging
- **WebSocket-based chat** for instant communication
- **Online/offline status** indicators for all users
- **Smart chat organization**: Sorted by last message or alphabetically
- **Message history**: Display last 10 messages with scroll-to-load-more functionality
- **Message metadata**: Timestamps and sender information
- **Real-time notifications**: Instant message delivery across all connected clients
- **Bidirectional communication**: Full-duplex messaging system

---

## 🛠️ Technology Stack

### **Backend**
![Go](https://img.shields.io/badge/Go-00ADD8?style=for-the-badge&logo=go&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)

- **Language**: Go (Golang) 1.22.0
- **HTTP Server**: Native Go HTTP handlers with custom routing
- **WebSockets**: Gorilla WebSocket library for real-time communication
- **Database**: SQLite3 with migration system
- **Authentication**: UUID-based session management (gofrs/uuid)
- **Password Security**: bcrypt encryption (golang.org/x/crypto)
- **Dependencies**:
  - `github.com/mattn/go-sqlite3` - SQLite database driver
  - `github.com/gorilla/websocket` - WebSocket implementation
  - `github.com/gofrs/uuid` - UUID generation
  - `golang.org/x/crypto` - Cryptographic functions

### **Frontend**
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

- **Architecture**: Single Page Application (SPA)
- **JavaScript**: ES6+ with Web Components (Custom Elements)
- **WebSocket Client**: Real-time message handling and UI updates
- **Event-Driven**: Asynchronous user interactions
- **DOM Manipulation**: Dynamic HTML generation and updates
- **Styling**: Modern CSS3 with responsive design

### **Database**
![SQLite](https://img.shields.io/badge/Database-SQLite3-003B57?style=for-the-badge&logo=sqlite)

- **Type**: SQLite3 (Lightweight, embedded database)
- **Features**:
  - Migration system for schema management
  - Normalized data structure
  - Efficient queries with proper indexing
  - Tables: Users, Posts, Comments, Messages, Categories, Likes/Dislikes

### **DevOps**
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

- **Containerization**: Docker with Alpine Linux base
- **Deployment**: Automated build and run scripts
- **Environment**: Cross-platform compatibility

---

## 🚀 Getting Started

### Prerequisites
- Go 1.22.0 or higher
- SQLite3
- Docker (optional, for containerized deployment)

### Installation & Running

**Option 1: Run Locally**

```bash
# Clone the repository
git clone https://github.com/mamadbah2/real-time-forum.git
cd real-time-forum

# Install dependencies
go mod download

# Run the application
go run ./cmd/web/.

# Access the forum at http://localhost:4000
```

**Option 2: Docker Deployment**

```bash
# Using the provided script
./Run_docker.sh

# Or manually
docker build -t real-time-forum .
docker run -p 4000:4000 real-time-forum
```

The application will be available at `http://localhost:4000`

---

## 📁 Project Structure

```
real-time-forum/
├── cmd/
│   └── web/                    # Application entry point
│       ├── main.go            # Server initialization
│       ├── routes.go          # HTTP routing
│       ├── handlers.go        # Request handlers
│       ├── chat.go            # WebSocket handlers
│       └── dbmanager.go       # Database setup
├── internal/
│   ├── models/                # Data models & database operations
│   │   ├── user.go           # User operations
│   │   ├── post.go           # Post operations
│   │   ├── comment.go        # Comment operations
│   │   └── message.go        # Message operations
│   └── filters/              # Business logic filters
│       └── filters.go        # Post filtering logic
├── db/
│   ├── migration.sql         # Database schema
│   └── data.sql              # Seed data
├── ui/
│   ├── static/
│   │   ├── css/              # Stylesheets
│   │   ├── js/               # JavaScript modules
│   │   │   ├── app.js       # Main application
│   │   │   ├── utils.js     # Utility functions
│   │   │   └── pages/       # Page components
│   │   ├── img/              # Images
│   │   └── uploads/          # User uploads
│   └── html/
│       └── index.html        # SPA entry point
├── Dockerfile                 # Docker configuration
├── Run_docker.sh             # Docker run script
├── go.mod                    # Go module dependencies
└── README.md                 # Project documentation
```

---

## 🎓 Skills Acquired & Demonstrated

### **Backend Development**
✅ **Go Programming**
- Mastery of Go syntax, idioms, and best practices
- Goroutines and concurrency patterns for handling multiple WebSocket connections
- Channel communication for real-time message broadcasting
- Error handling and logging strategies

✅ **HTTP Server Development**
- Building RESTful APIs with native Go HTTP handlers
- Custom routing and middleware
- Request/response handling and JSON serialization
- Static file serving and uploads management

✅ **WebSocket Implementation**
- Real-time bidirectional communication
- Connection lifecycle management (open, message, close)
- Broadcasting messages to multiple clients
- Handling concurrent connections safely

✅ **Database Management**
- SQLite integration and schema design
- Writing efficient SQL queries
- Database migrations and versioning
- Data modeling with normalized structures
- CRUD operations and transactions

✅ **Security & Authentication**
- Session management with UUID tokens
- Secure password hashing with bcrypt
- Cookie-based authentication
- Protection against SQL injection
- Input validation and sanitization

### **Frontend Development**
✅ **JavaScript ES6+**
- Modern JavaScript features (arrow functions, destructuring, async/await)
- Modules and code organization
- Promise-based asynchronous programming
- Fetch API for AJAX requests

✅ **Single Page Application (SPA)**
- Dynamic content rendering without page reloads
- Client-side routing and navigation
- State management across components
- Custom Web Components (Custom Elements API)

✅ **WebSocket Client**
- Real-time data handling
- Event-driven message processing
- UI updates based on server events
- Connection state management

✅ **DOM Manipulation & Events**
- Dynamic HTML generation
- Event delegation and listeners
- Form handling and validation
- Responsive UI updates

✅ **CSS & Responsive Design**
- Modern CSS3 layouts
- Responsive design principles
- Cross-browser compatibility
- User interface best practices

### **Software Architecture & Design**
✅ **MVC Pattern**
- Clear separation of concerns
- Models for data layer
- Views for presentation
- Controllers for business logic

✅ **Project Organization**
- Clean code structure
- Modular design with internal packages
- Separation of backend and frontend concerns
- Scalable architecture

✅ **API Design**
- RESTful endpoint design
- WebSocket protocol implementation
- JSON data structures
- Error handling and status codes

✅ **Real-Time Systems**
- Concurrent programming patterns
- State synchronization between client and server
- Message queuing and delivery
- Handling race conditions

### **DevOps & Tools**
✅ **Docker**
- Container creation and configuration
- Multi-stage builds
- Environment setup
- Deployment automation

✅ **Version Control**
- Git workflow and best practices
- Branch management
- Collaborative development
- Code review process

✅ **Dependency Management**
- Go modules (go.mod, go.sum)
- Package versioning
- Dependency updates and compatibility

✅ **Database Migrations**
- Schema versioning
- Automated database setup
- Seed data management

### **Soft Skills**
✅ **Problem Solving**
- Debugging complex real-time systems
- Performance optimization
- Memory leak prevention
- Race condition resolution

✅ **Full-Stack Development**
- End-to-end feature implementation
- Understanding of complete application flow
- Integration between frontend and backend
- Testing across the stack

✅ **Code Quality**
- Writing clean, maintainable code
- Code documentation and comments
- Following language conventions
- Refactoring and optimization

✅ **Project Management**
- Task breakdown and prioritization
- Time management
- Feature planning
- Incremental development

---

## 🔧 Key Technical Achievements

1. **Real-Time Communication System**
   - Implemented WebSocket protocol for instant messaging
   - Managed multiple concurrent connections with goroutines
   - Created efficient message broadcasting system

2. **Secure Authentication**
   - UUID-based session management
   - Bcrypt password encryption
   - Secure cookie handling
   - Protected endpoints and routes

3. **Database Architecture**
   - Normalized schema design
   - Efficient query optimization
   - Migration system for version control
   - Proper indexing for performance

4. **Single Page Application**
   - Zero-reload user experience
   - Dynamic content loading
   - Custom Web Components
   - State management

5. **Containerization**
   - Docker configuration with Alpine Linux
   - Optimized image size
   - Easy deployment workflow

6. **Scalable Code Structure**
   - Modular architecture
   - Reusable components
   - Clean separation of concerns
   - Easy to extend and maintain

---

## 👥 Authors & Contributors

- **[mamadbah](https://learn.zone01dakar.sn/git/mamadbah)** - Full-stack development
- **[belhadjs](https://learn.zone01dakar.sn/git/belhadjs)** - Full-stack development

---

## 📝 License

This project is open source and available for educational purposes.

---

## 🤝 Contributing

This project was developed as part of the **Zone01 Dakar** curriculum. Feel free to fork and build upon it for learning purposes!

---

**Built with ❤️ at Zone01 Dakar**
