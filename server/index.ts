import * as path from "path";
import * as sockjs from "sockjs";
import * as http from "http";
import * as node_static from "node-static";

let isDev = true;
process.argv.forEach((val) => (val === "--production" ? (isDev = false) : 0));
console.log("starting " + (isDev ? "development" : "production") + " server");
global.isDev = isDev;
import { toID } from "./utils";
global.toID = toID;
import { snapCache } from "./snap-cache";
global.snapCache = snapCache;
import { Users } from "./users";
global.Users = Users;
import * as Chat from "./chat/chat";
global.Chat = Chat;

//set up sockets, todo: make global & set up in ./sockets.ts
let socketCounter = 0;
const sockjs_echo = sockjs.createServer({ sockjs_url: "./sockjs.min.js" });
sockjs_echo.on("connection", (socket) => {
	console.log("connected..........");
	if (!socket) return;
	if (!socket.remoteAddress) {
		/* SockJS sometimes fails to be able to cache the IP, port, and address from connection request headers. */
		try {
			socket.destroy();
		} catch (e) {}
		return;
	}
	const socketid = ("" + ++socketCounter) as ID,
		ip = socket.remoteAddress;
	Users.socketConnect(socketid, socket, ip);
	socket.on("data", (message) => {
		if (!message) return;
		if (message.length > 100 * 1024) {
			console.log(
				`Dropping client message ${message.length / 1024} KB...`
			);
			console.log(message.slice(0, 160));
			return;
		}
		const pipeIndex = message.indexOf("|");
		if (pipeIndex < 0 /* || pipeIndex === message.length - 1 */) return;
		Users.socketProcessReceivedData(socketid, message);
	});
	socket.once("close", () => {
		console.log("... exit ...");
		Users.socketDisconnect(socketid);
	});
});

const static_directory = new node_static.Server(
	path.join(__dirname, "../../client/web-build")
);
const server = http.createServer();
server.addListener("request", function (req, res) {
	static_directory.serve(req, res);
});
server.addListener("upgrade", function (req, res) {
	res.end();
});
sockjs_echo.installHandlers(server, { prefix: "/sockets" });
console.log(" [*] Listening on 0.0.0.0:8000");
server.listen(8000, "0.0.0.0");
