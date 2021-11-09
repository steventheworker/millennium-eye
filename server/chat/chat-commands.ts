import * as Utils from "../utils";
import * as child_process from "child_process";
import { PythonShell } from "python-shell";

/*
>> if (Object.keys(keysHeld).length) releaseKeys();
>> if (Object.keys(mouseHeld).length) releaseMouse();
*/
function releaseKeys() {
	//
}
function releaseMouse() {
	//
}

export const commands: Chat.ChatCommands = {
	release(target, user, connection) {
		if (target === "keys") {
			releaseKeys();
		} else if (target === "mouse") {
			releaseMouse();
		} else {
			releaseMouse();
			releaseKeys();
		}
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
	// core commands
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
