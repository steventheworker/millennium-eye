import * as Utils from "../utils";
import * as child_process from "child_process";
import { PythonShell } from "python-shell";
const SCRIPTS_PATH = "~/Desktop/important";
import * as OS from "os";
const os = OS.platform();

export const commands: Chat.ChatCommands = {
	/*
		"plugins"
		shell scripts
	*/
	vlc: "cat",
	nightcat: "cat", catnight: "cat", spookycat: "cat", spookykitty: "cat", scaredycat: "cat", scareycat: "cat", catblack: "cat", blackcat: "cat", 
	cat(target, user, connection, cmd) {
		const catDict = ["night", "nightcat", "catnight",
			"dark", "darkcat", "black", "blackcat", "catblack", 
			"spookycat", "spookykitty", "scaredycat", "scareycat", "scare", "scaredy", "spooky"];
		const isNight = (target.trim() && catDict.indexOf(target.trim()) !== -1) || catDict.indexOf(cmd) !== -1;
		this.parse(`/bash ${SCRIPTS_PATH}/catvid${isNight ? '-inverted' : ''}.sh`);
	},
	airpods: function () {
		this.parse(`/bash ${SCRIPTS_PATH}/toggle-airpods.sh`);
	},
	
	
	/*
		browser tab   shortcuts
	*/
	new: 'browser',
	window: 'browser',
	chrome: 'browser',
	browser(target) {
		this.parse(`/es 0~d~MetaLeft~true, 0~d~Keym~true, 0~u~Keym~true, 0~u~MetaLeft~true`);
		if (target.trim()) setTimeout(() => this.parse(`/es 0~t~${ target}, 0~d~Enter~false"`), 5000);
	},
	loc: "addressbar", //todo: args: url ( type & enter )
	addressbar(target) {
		//meta+l (Mac), control+l (linux + windows)
		this.parse(
			`/es ${
				os === "darwin"
					? "0~d~MetaLeft~false, 0~d~Keyl~false, 0~u~Keyl~false, 0~u~MetaLeft~false"
					: "0~d~ControlLeft~false, 0~d~Keyl~false, 0~u~Keyl~false, 0~u~ControlLeft~false"
			}
			${!target.trim() ? "" : ", 1000~t~" + target + ", 0~d~Enter~false"}`
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
			${!target.trim() ? "" : ", 0~t~" + target + ", 0~d~Enter~false"}`
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


	/*
		window  &  tab  shortcuts
	*/
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


	/*
			window    shortcuts
	*/
	last: "lastwindow",
	switch: "lastwindow",
	lastwindow() {
		//alt+tab (linux, win), meta+tab (Mac)
		this.parse(
			`/es ${
				os === "darwin"
					? "0~d~MetaLeft~false, 0~d~Tab~false, 0~u~Tab~false, 120~u~MetaLeft~false" //120ms delay
					: "0~d~AltLeft~false, 0~d~Tab~false, 0~u~Tab~false, 120~u~AltLeft~false"
			}`
		);
	},


	/*
		OS shortcuts
	*/
	release() { //in the case things aren't working, fully release mouse & keyboard modifier keys
		//todo: completed for macOS (only) keyboard modifier keys as of rn
		//todo: release mouse
		const es = ["0~d~ControlLeft~false, 0~u~ControlLeft~false", /* No ControlRight on macOS */
						"0~d~AltLeft~false, 0~u~AltLeft~false", "0~d~AltRight~false, 0~u~AltRight~false",
						"0~d~MetaLeft~false, 0~u~MetaLeft~false", "0~d~MetaRight~false, 0~u~MetaRight~false"]
		this.parse(`/es ` + es.join(', '));
	},
	up: "arrow",
	down: "arrow",
	left: "arrow",
	right: "arrow",
	arrow(target, user, connection, cmd) {
		const arrow = target.trim() ? target.trim() : cmd;
		const Arrow = "Arrow" + arrow[0].toUpperCase() + arrow.slice(1);
		this.parse(`/es 0~d~${Arrow}~false, 0~u~${Arrow}~false`);
	},
	0: "digit",
	1: "digit",
	2: "digit",
	3: "digit",
	4: "digit",
	5: "digit",
	6: "digit",
	7: "digit",
	8: "digit",
	9: "digit",
	digit(target, user, connection, cmd) {
		let x = Number(target.trim());
		if (cmd === "digit" && !x) return connection.send('missing digit no.');
		if (cmd !== "digit") x = Number(cmd);
		this.parse(`/es 0~d~Digit${x}~false, 0~u~Digit${x}~false`);
	},
	unmute() {
		//todo: 
	},
	mute() {
		//todo: 
	},
	t(target) { //parse as:   /tab    or    /type
		function validURL(str: string) {
			const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
			'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
			'((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
			'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
			'(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
			'(\\#[-a-z\\d_]*)?$','i'); // fragment locator
			return !!pattern.test(str);
		}
		if (validURL(target) || !target.trim()) return this.parse('/tab ' + target);
		this.parse('/type ' + target);
	},
	type(target) {
		if (!target.trim()) return;
		this.parse(`/es 0~t~${target}`);
	},
	esc: "escape",
	escape() {
		this.parse(`/es 0~d~Escape~false, 0~u~Escape~false`);
	},
	delete: "backspace",
	del: "backspace",
	back: "backspace",
	backspace() {
		this.parse(`/es 0~d~Backspace~false, 0~u~Backspace~false`);
	},
	ktab: "tabkey",
	tabkey() {
		this.parse(`/es 0~d~Tab~false, 0~u~Tab~false`);
	},
	enter() {
		this.parse(`/es 0~d~Enter~false, 0~u~Enter~false`);
	},
	pause: "space",
	play: "space",
	space() {
		this.parse(`/es 0~d~Space~false, 0~u~Space~false`);
	},
	restart() {
		this.parse(`/bash ${os === "win32" ? "shutdown /r" : "reboot /r"}`);
	},
	apps() {
		this.parse(
			`/es ${os === "darwin" ? "0~d~ControlLeft~false, 0~d~ArrowUp~false, 0~u~ArrowUp~false, 0~u~ControlLeft~false" :
				(os === "win32" ? "0~d~MetaLeft~false, 0~d~Tab~false, 0~u~Tab~false, 0~u~MetaLeft~false" :
				/*ubuntu*/ "0~d~MetaLeft~false, 0~u~MetaLeft~false")}`
		);
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
	d1: 'desktop',
	d2: 'desktop',
	d3: 'desktop',
	d4: 'desktop',
	d5: 'desktop',
	d6: 'desktop',
	d7: 'desktop',
	d8: 'desktop',
	d9: 'desktop',
	d: 'desktop',
	desktop(target, user, connection, cmd) {
		const dSomething = cmd.length === 2; //d[1-9] = switch to desktop #
		if (!target && !dSomething) return this.parse('/desk'); //mean to show the desktop
		const tar = dSomething ? cmd[1] : target.trim();
		this.parse(
			`/es 0~d~MetaLeft~false, 0~d~Digit${tar}~false, 0~u~Digit${tar}~false, 0~u~MetaLeft~false`
		);
	},
	desk(target) {
		if (target) return this.parse('/desktop ' + target); //meant to go to desktop #x
		this.parse(
			`/es ${
				os === "darwin"
					? "0~d~F11~false,0~u~F11~false"
					: "0~d~MetaLeft~false,0~d~Keyd~false,0~u~Keyd~false,0~u~MetaLeft~false"
			}`
		);
	},


	/* 
		RAT core commands
	*/
	es(target, user, connection) {
		PythonShell.run("../py/es.py", { args: [target, "n"] }, (err, res) => {
			if (err) console.log("chat-commands.ts line core error (es)!!!");
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


	/*
		chat-api core commands
	*/
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
		if (!target) return user.send("empty bash command");
		user.send(`$ ${target}`);
		child_process.exec(target, (error, stdout, stderr) => {
			user.send(`${stdout}${stderr}`);
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

// function bash(command: string, context: Chat.CommandContext, cwd ?: string): Promise<[number, string, string]> {
// 	return new Promise(resolve => {
// 		child_process.exec(command, {
// 			cwd: cwd || `${__dirname}/../..`,
// 		}, (error, stdout, stderr) => {
// 			let log = `[o] ${stdout}[e] ${stderr}`;
// 			if (error) log = `[c] ${error.code}\n${log}`;
// 			resolve([error?.code || 0, stdout, stderr]);
// 		});
// 	});
// }