import events from "./events";
import { snap } from "./snap-cache";
import { Chat } from "./chat/chat";

export class Sesh {
	user: User;
	ip: string;
	socketid: string;
	connection: Connection;
	connected: boolean;
	constructor(
		socketid: string,
		socket: Connection,
		ip: string | null,
		user?: User
	) {
		this.socketid = socketid;
		this.connection = socket;
		this.connected = true;
		this.ip = ip || "";
		this.user = user!;
	}
	send(msg: string) {
		this.connection.write(msg);
	}
}
export class User {
	user: User;
	name: string;
	id: ID;
	connected: boolean;
	ips: string[];
	connections: Sesh[] = [];
	lastPM: string;
	constructor(connection: Sesh) {
		this.user = this;
		this.connected = true;
		Users.online++;
		if (connection.user) connection.user = this;
		this.connections = [connection];
		this.ips = [connection.ip];
		this.name = `Guest ${connection.socketid}`;
		this.id = toID(this.name);
		this.lastPM = "";
		users.set(this.id, this);
	}
	send(msg: string) {
		this.connections.forEach((connection) => {
			connection.send(msg);
		});
	}
	onDisconnect(connection: Sesh) {
		for (const [i, connected] of this.connections.entries()) {
			if (connected === connection) {
				this.connections.splice(i, 1);
				// for (const roomid of connection.rooms) this.leave(Rooms.get(roomid)!, connection);
				break;
			}
		}
		if (!this.connections.length) this.destroy();
	}
	destroy() {
		users.delete(this.id);
		Users.online--;
	}
	getIdentity() {
		return this.name;
	}
	can(permission: {}, target: User | null, cmd?: string): boolean;
	can(permission: {}, target?: User | null): boolean;
	can(permission: {}, target: User | null, cmd?: string): boolean;
	can(permission: string, target: User | null = null, cmd?: string): boolean {
		return true; //todo:
	}
}

//sockets
function socketProcessReceivedData(socketid: ID, msg: string) {
	const connection = connections.get(socketid);
	if (!connection) return;
	const user = connection.user;
	if (!user) return;
	msg.split("\\n").forEach((message) => {
		const data = message.substr(1).split("|");
		let event = data.splice(0, 1)[0];
		if (!events[event]) {
			data.splice(0, 0, event);
			event = "c";
		}
		data.push(event);
		let fn = events[event];
		if (typeof fn === "string") fn = events[fn];
		try {
			(fn as Function).apply(null, [user, connection, data]);
		} catch (e) {
			const err = "|" + ("" + e.stack).replace(/\n/g, "\n|");
			user.send("|<< error: " + e.message + "\n" + err);
		}
		console.log("<< " + message);
	});
}
function socketConnect(socketid: ID, socket: Connection, ip: string) {
	const connection = new Sesh(socketid, socket, ip);
	connections.set(socketid, connection);
	const user = new User(connection);
	connection.user = user;
	connection.send("r|" + snapCache[snapCache.length - 1]);
	startServeLoop();
}
function socketDisconnect(socketid: ID) {
	const connection = connections.get(socketid)!;
	if (connection.user) connection.user.onDisconnect(connection);
	connection.user = null!;
	connections.delete(socketid);
	//handle end serve screen loop
	if (Users.online === 0) return endLoop();
}
//definitions
const users = new Map<ID, User>();
const connections = new Map<ID, Sesh>();
const prevUsers = new Map<ID, ID>();
function getUser(name: string | User | null, exactName = false) {
	if (!name || name === "!") return null;
	if ((name as User).id) return name as User;
	let userid = toID(name);
	let i = 0;
	if (!exactName) {
		while (userid && !users.has(userid) && i < 1000) {
			userid = prevUsers.get(userid)!;
			i++;
		}
	}
	return users.get(userid) || null;
}

export const Users = {
	online: 0,
	users,
	User,
	connections,
	socketConnect,
	socketDisconnect,
	socketProcessReceivedData,
	get: getUser,
};

//serve loop
const targetTime = isDev ? 22222 : 1332;
let running = false;
let firstRun = true;
let undidFirstRun = false;
let snapTimeout: NodeJS.Timeout | void;
function endLoop() {
	running = false;
	if (!snapTimeout)
		return console.log("loop could not be stopped, as it is not running");
	snapTimeout = clearTimeout(+snapTimeout);
	console.log("endloop", Users.online);
}
function startServeLoop() {
	console.log("new connection; running: " + running);
	if (running) return;
	running = true;
	runLoop();
}
function handleFirstRun(ogT: number) {
	if (firstRun) {
		Users.online++;
		firstRun = false;
	} else if (!undidFirstRun) {
		Users.online--;
		undidFirstRun = true;
	}
	return firstRun ? 0 : ogT;
}
function runLoop() {
	let t = targetTime - 600; //todo: stop hardcode,   .6s ~= milliseconds to take screenshot t430
	t = handleFirstRun(t);
	if (Users.online === 0 || running === false) return endLoop();
	snap((data) => {
		if (t < 0) t = 0;
		Users.users.forEach((user) => user.send("r|" + data));
		snapTimeout = setTimeout(() => {
			if (running) runLoop();
			else endLoop();
		}, t);
	});
}
