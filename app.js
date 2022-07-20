
require('dotenv').config();// trae los del archivo .env

const Server = require('./models/server'); // class Server

const server = new Server();

server.listen();