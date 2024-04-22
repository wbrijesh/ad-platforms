package server

type ServerConfigType struct {
	Version string
	Port    int
}

type ResponseType struct {
	Result interface{}
	Error  string
}
