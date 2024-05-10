package main

import "github.com/gorilla/websocket"

type Client struct {
	idClient int
	Conn     *websocket.Conn
}

var Clients []Client

// INITIALISATION
var Upgradero = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}
