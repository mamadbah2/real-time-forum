package main

import "github.com/gorilla/websocket"

var Clients map[*websocket.Conn]bool

// INITIALISATION
var Upgradero = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}
