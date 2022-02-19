import * as Utils from "../utils";
import * as child_process from "child_process";
import { PythonShell } from "python-shell";
const SCRIPTS_PATH = "~/Desktop/important";
import * as OS from "os";
const os = OS.platform();
export const commands: Chat.ChatCommands = {
	nightcat: "cat",
	catnight: "cat",
	cat() { //args: "night"
		//open cat video.mp4
		//open path2.mp4?????
	},
	//  browser tab   shortcuts
	loc: "adressbar", //todo: args: url ( type & enter )
	addressbar() {
		//meta+l (Mac), control+l (linux + windows)
		this.parse(
			`/es ${
				os === "darwin"
					? "0~d~MetaLeft~false, 0~d~Keyl~false, 0~u~Keyl~false, 0~u~MetaLeft~false"
					: "0~d~ControlLeft~false, 0~d~Keyl~false, 0~u~Keyl~false, 0~u~ControlLeft~false"
			}`
		);

	},
	reopen: "reopenlasttab",
	reopenlasttab() {
		//shift+meta+t (Mac), shift+control+t (linux + windows)
		this.parse(
			`/es ${
				os === "darwin"
					? "0~d~MetaLeft~false, 0~d~Keyt~false, 0~u~Keyt~false, 0~u~MetaLeft~false"
					: "0~d~ControlLeft~false, 0~d~Keyt~false, 0~u~Keyt~false, 0~u~ControlLeft~false"
			}`
		);
	},
	newtab: "tab", //todo: args: url
	tab(target) {
		//meta+t (Mac), control+t (linux + windows)
		this.parse(
			`/es ${
				os === "darwin"
					? "0~d~MetaLeft~false, 0~d~Keyt~false, 0~u~Keyt~false, 0~u~MetaLeft~false"
					: "0~d~ControlLeft~false, 0~d~Keyt~false, 0~u~Keyt~false, 0~u~ControlLeft~false"
			}
			${!target ? "" : ", 0~t~" + target}`
		);
	},
	next: "nexttab",
	prev: "nexttab",
	prevtab: "nexttab", //todo: holding shift
	nexttab() {
		//control+tab (macOS + linux + windows)
		this.parse(
			`/es ${"0~d~ControlLeft~false, 0~d~Keyt~false, 0~u~Keyt~false, 0~u~ControlLeft~false"}`
		);
	},

	//  window  &  tab  shortcuts
	closeall: "closewindow", //todo: holding shift
	close: "closewindow",
	closetab: "closewindow",
	closewindow() { 
		//meta+w (Mac), control+w (linux + windows)
		this.parse(
			`/es ${
				os === "darwin"
					? "0~d~MetaLeft~false, 0~d~Keyw~false, 0~u~Keyw~false, 0~u~MetaLeft~false"
					: "0~d~ControlLeft~false, 0~d~Keyw~false, 0~u~Keyw~false, 0~u~ControlLeft~false"
			}`
		);
	},

	//  window    shortcuts
	last: "lastwindow",
	switch: "lastwindow",
	lastwindow() {
		//alt+tab (linux, win), meta+tab (Mac)
		this.parse(
			`/es ${
				os === "darwin"
					? "0~d~MetaLeft~false, 0~d~Tab~false, 0~u~Tab~false, 0~u~MetaLeft~false"
					: "0~d~AltLeft~false, 0~d~Tab~false, 0~u~Tab~false, 0~u~AltLeft~false"
			}`
		);
	},

	//OS shortcuts
	browser() { //todo: args: url
		//DEFAULT else windows (Edge), macOS (Safari), linux (Firefox)
		this.parse('open https://google.com'); //todo: launch browser / make active
	},
	restart() {
		this.parse(`/bash ${os === "win32" ? "shutdown /r" : "reboot /r"}`);
	},
	quit() {
		//alt+f4 (linux, win), cmd+Q(darwin)
		this.parse(
			`/es ${
				os !== "darwin"
					? "0~d~AltLeft~false,0~d~F4~false,0~u~F4~false,0~u~AltLeft~false"
					: "0~d~MetaLeft~false, 0~d~Keyq~false, 0~u~Keyq~false, 0~u~MetaLeft~false"
			}`
		);
	},
	desk() {
		this.parse(
			`/es ${
				os === "darwin"
					? "0~d~F11~false,0~u~F11~false"
					: "0~d~MetaLeft~false,0~d~Keyd~false,0~u~Keyd~false,0~u~MetaLeft~false"
			}`
		);
	},
	//shell scripts
	release(target, user, connection) {
		this.parse(`/bash ${SCRIPTS_PATH}/controller-release.sh`);
	},
	airpods: function () {
		this.parse(`/bash ${SCRIPTS_PATH}/toggle-airpods.sh`);
	},
	// core commands
	es(target, user, connection) {
		PythonShell.run("../py/es.py", { args: [target, "n"] }, (err, res) => {
			if (err) console.log("chat-commands.ts line 20 error!!!");
		});
	},
	copy(target, user, connection) {
		const mode = target.trim() ? "copyto" : "copy";
		PythonShell.run(
			"../py/copy-paste.py", //mode = target ?    setClipboard ("copyto" server)   :    retrieve clipboard & setClipboard ("copy" onto client's clipboard)
			{
				args: [target, mode],
			} /*       /copy                         //"copy" onto client
      or:        /copy [new clipboardContent] //"copyto" server*/,
			(err, res) => {
				if (err) console.log("err", err, "\n\n", res);
				if (res) user.send("cp|" + res);
			}
		);
	},
	paste(target, user, connection) {
		PythonShell.run(
			"../py/copy-paste.py", // triggers ctrl+V
			{ args: [target, "paste"] },
			(err, res) => (err ? console.log("err", err, "\n\n", res) : 0)
		);
	},
	//chat core commands
	api: 'cmds',
	cmds(target, user, connection) {
		connection.send(Object.keys(commands).map((el, i) => el).join(","));
	},
	kickall: function () {
		Users.users.forEach((user) => user.send("dc|"));
	},
	kill: function (data, user, connection) {
		Users.users.forEach((user) => user.send("someone killed the server"));
		if (isDev) this.parse("/bash cd ../bin && runjob.bat"); //start an independent process (a child-process wouldn't auto restart)
		setTimeout(process.exit, 500);
	},
	bash(target, user, connection) {
		this.canUseConsole();
		if (!target) return this.parse(" help bash");
		connection.send(`$ ${target}`);
		child_process.exec(target, (error, stdout, stderr) => {
			connection.send(`${stdout}${stderr}`);
		});
	},
	async eval(target, user, connection) {
		this.canUseConsole();
		if (!this.runBroadcast(true)) return;
		connection.send(`>> ${target}`);
		try {
			let result = eval(target);
			if (result?.then) {
				this.update();
			} else {
				result = Utils.visualize(result);
				connection.send("<< " + result);
			}
			connection.send(`<< ${result}`);
		} catch (e) {
			const message = ("" + e.stack).replace(
				/\n *at CommandContext\.eval [\s\S]*/m,
				""
			);
			connection.send(`<< ${message}`);
		}
	},
};
