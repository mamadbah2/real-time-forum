package main

import "github.com/gorilla/websocket"

var Clients map[int]*websocket.Conn

// INITIALISATION
var Upgradero = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}
