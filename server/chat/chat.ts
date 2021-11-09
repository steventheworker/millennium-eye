import * as Utils from "../utils";
const MAX_PARSE_RECURSION = 10;
const VALID_COMMAND_TOKENS = "/!";
const BROADCAST_TOKEN = "!";
const MAX_MESSAGE_LENGTH = 500;
interface AnyObject {
	[k: string]: any;
}
export interface ChatCommands {
	[k: string]: ChatHandler | string | string[] | ChatCommands;
}
export abstract class MessageContext {
	readonly user: User;
	recursionDepth: number;
	constructor(user: User) {
		this.user = user;
		this.recursionDepth = 0;
	}
	splitOne(target: string) {
		const commaIndex = target.indexOf(",");
		if (commaIndex < 0) {
			return [target.trim(), ""];
		}
		return [
			target.slice(0, commaIndex).trim(),
			target.slice(commaIndex + 1).trim(),
		];
	}
	meansYes(text: string) {
		switch (text.toLowerCase().trim()) {
			case "on":
			case "enable":
			case "yes":
			case "true":
			case "allow":
			case "1":
				return true;
		}
		return false;
	}
	meansNo(text: string) {
		switch (text.toLowerCase().trim()) {
			case "off":
			case "disable":
			case "no":
			case "false":
			case "disallow":
			case "0":
				return true;
		}
		return false;
	}
	splitUser(target: string, { exactName }: { exactName?: boolean } = {}) {
		const [inputUsername, rest] = this.splitOne(target).map((str) =>
			str.trim()
		);
		const targetUser = Users.get(inputUsername, exactName);
		return {
			targetUser,
			inputUsername,
			targetUsername: targetUser ? targetUser.name : inputUsername,
			rest,
		};
	}
	getUserOrSelf(target: string, { exactName }: { exactName?: boolean } = {}) {
		if (!target.trim()) return this.user;
		return Users.get(target, exactName);
	}
}

export type ChatHandler = (
	this: CommandContext,
	target: string,
	user: User,
	connection: Sesh,
	cmd: string,
	message: string
) => void;
export type AnnotatedChatHandler = ChatHandler & {
	hasRoomPermissions: boolean;
	broadcastable: boolean;
	cmd: string;
	fullCmd: string;
	isPrivate: boolean;
	disabled: boolean;
	aliases: string[];
};

type parseArgs = string | void | boolean | Promise<string | void | boolean>;
class CommandContext extends MessageContext {
	message: string;
	pmTarget: User | null;
	connection: Sesh;
	cmd: string;
	cmdToken: string;
	target: string;
	fullCmd: string;
	handler: AnnotatedChatHandler | null;
	isQuiet: boolean;
	broadcasting: boolean;
	broadcastToRoom: boolean;
	broadcastMessage: string;
	constructor(
		options: { message: string; user: User; connection: Sesh } & Partial<{
			pmTarget: User | null;
			cmd: string;
			cmdToken: string;
			target: string;
			fullCmd: string;
		}>
	) {
		super(options.user);
		this.message = options.message || ``;
		this.pmTarget = options.pmTarget || null;
		this.connection = options.connection;
		this.cmd = options.cmd || "";
		this.cmdToken = options.cmdToken || "";
		this.target = options.target || ``;
		this.fullCmd = options.fullCmd || "";
		this.handler = null;
		this.isQuiet = false;
	}
	update() {} //placeholder for when taking code from PS
	canUseConsole() {
		//todo: consoleips or something
		return true;
	}
	runBroadcast(
		ignoreCooldown = false,
		suppressMessage: string | null = null
	) {
		if (this.broadcasting || !this.shouldBroadcast()) return true;
		if (!this.broadcastMessage)
			this.checkBroadcast(ignoreCooldown, suppressMessage);
		this.broadcasting = true;
		if (this.pmTarget) {
			this.sendReply("|c~|" + (suppressMessage || this.message));
		} else {
			this.sendReply(
				"|c|" +
					this.user.getIdentity() +
					"|" +
					(suppressMessage || this.message)
			);
		}
		return true;
	}
	checkBroadcast(ignoreCooldown?: boolean, suppressMessage?: string | null) {
		if (this.broadcasting || !this.shouldBroadcast()) return true;
		if (!this.pmTarget) {
			this.errorReply(
				`Broadcasting a command with "!" in a PM or chatroom will show it that user or room.`
			);
			throw new Chat.ErrorMessage(
				`To see it for yourself, use: /${this.message.slice(1)}`
			);
		}
		const broadcastMessage = (suppressMessage || this.message)
			.toLowerCase()
			.replace(/[^a-z0-9\s!,]/g, "");
		if (!ignoreCooldown && !this.user.can("bypassall"))
			throw new Chat.ErrorMessage(
				"You can't broadcast this because it was just broadcasted."
			);
		const message = this.checkChat(suppressMessage || this.message);
		if (!message)
			throw new Chat.ErrorMessage(
				`To see it for yourself, use: /${this.message.slice(1)}`
			);
		this.message = message + "";
		this.broadcastMessage = broadcastMessage;
		return true;
	}
	parse(msg?: string, quiet?: boolean): parseArgs {
		if (typeof msg === "string") {
			const subcontext = new CommandContext(this);
			if (quiet) subcontext.isQuiet = true;
			subcontext.recursionDepth++;
			if (subcontext.recursionDepth > MAX_PARSE_RECURSION)
				throw new Error("Too much command recursion");
			subcontext.message = msg;
			subcontext.cmd = "";
			subcontext.fullCmd = "";
			subcontext.cmdToken = "";
			subcontext.target = "";
			return subcontext.parse();
		}
		let message: parseArgs = this.message;
		const parsedCommand = Chat.parseCommand(message);
		if (parsedCommand) {
			this.cmd = parsedCommand.cmd;
			this.fullCmd = parsedCommand.fullCmd;
			this.cmdToken = parsedCommand.cmdToken;
			this.target = parsedCommand.target;
			this.handler = parsedCommand.handler;
		}
		try {
			if (this.handler) {
				if (this.handler.disabled) {
					throw new Chat.ErrorMessage(
						`The command /${this.cmd} is temporarily unavailable due to technical difficulties. Please try again in a few hours.`
					);
				}
				message = this.run(this.handler);
			} else {
				if (this.cmdToken) {
					if (
						!(
							this.shouldBroadcast() &&
							!/[a-z0-9]/.test(this.cmd.charAt(0))
						)
					)
						this.commandDoesNotExist();
				} else if (
					!VALID_COMMAND_TOKENS.includes(message.charAt(0)) &&
					VALID_COMMAND_TOKENS.includes(message.trim().charAt(0))
				) {
					message = message.trim();
					if (!message.startsWith(BROADCAST_TOKEN))
						message = message.charAt(0) + message;
				}
				message = this.checkChat(message);
			}
		} catch (err) {
			if (err.name?.endsWith("ErrorMessage")) {
				this.errorReply(err.message);
				return false;
			}
			if (err.name.endsWith("Interruption")) {
				return;
			}
			console.log(err, "A chat command", {
				user: this.user.name,
				pmTarget: this.pmTarget?.name,
				message: this.message,
			});
			this.sendReply(
				`|html|<div class="broadcast-red"><b>Pokemon Showdown crashed!</b><br />Don't worry, we're working on fixing it.</div>`
			);
			return;
		}
		// Output the message
		if (
			message &&
			typeof (message as Promise<parseArgs>).then === "function"
		) {
			return (message as Promise<string | boolean | void>)
				.then((resolvedMessage) => {
					if (resolvedMessage && resolvedMessage !== true) {
						this.sendChatMessage(resolvedMessage);
					}
					if (resolvedMessage === false) return false;
				})
				.catch((err) => {
					if (err.name?.endsWith("ErrorMessage")) {
						this.errorReply(err.message);
						return false;
					}
					if (err.name.endsWith("Interruption")) {
						return;
					}
					console.log(err, "An async chat command", {
						user: this.user.name,
						pmTarget: this.pmTarget?.name,
						message: this.message,
					});
					this.sendReply(
						`|html|<div class="broadcast-red"><b>Pokemon Showdown crashed!</b><br />Don't worry, we're working on fixing it.</div>`
					);
					return false;
				});
		} else if (message && message !== true) {
			this.sendChatMessage(message as string);
			message = true;
		}
		return message;
	}
	run(handler: string | AnnotatedChatHandler) {
		if (typeof handler === "string")
			handler = Chat.commands[handler] as AnnotatedChatHandler;
		if (!handler.broadcastable && this.cmdToken === "!") {
			this.errorReply(
				`The command "${this.fullCmd}" can't be broadcast.`
			);
			this.errorReply(`Use /${this.fullCmd} instead.`);
			return false;
		}
		let result = handler.call(
			this,
			this.target,
			this.user,
			this.connection,
			this.cmd,
			this.message
		);
		if (result === undefined) result = false;
		return result;
	}
	shouldBroadcast() {
		return this.cmdToken === BROADCAST_TOKEN;
	}
	errorReply(message: string) {
		this.sendReply(`|error|` + message.replace(/\n/g, `\n|error|`));
	}
	sendReply(data: string) {
		if (this.isQuiet) return;
		if (this.broadcasting && this.broadcastToRoom) {
			// broadcasting
			this.add(data);
		} else {
			// not broadcasting
			if (this.pmTarget) {
				data = this.pmTransform(data);
				this.connection.send(data);
			} else {
				console.log("broadcasting this message NOW! ::: " + data);
			}
		}
	}
	sendChatMessage(message: string) {
		if (this.pmTarget) {
			Chat.sendPM(message, this.user, this.pmTarget);
		} else {
			console.log("broadcasting2 this message NOW! ::: " + message);
		}
	}
	commandDoesNotExist(): never {
		if (this.cmdToken === "!") {
			throw new Chat.ErrorMessage(
				`The command "${this.cmdToken}${this.fullCmd}" does not exist.`
			);
		}
		throw new Chat.ErrorMessage(
			`The command "${this.cmdToken}${this.fullCmd}" does not exist. To send a message starting with "${this.cmdToken}${this.fullCmd}", type "${this.cmdToken}${this.cmdToken}${this.fullCmd}".`
		);
	}
	pmTransform(originalMessage: string) {
		const targetIdentity = this.pmTarget
			? this.pmTarget.getIdentity()
			: "~";
		const prefix = `|pm|${this.user.getIdentity()}|${targetIdentity}|`;
		return originalMessage
			.split("\n")
			.map((message) => {
				if (message.startsWith("||")) {
					return prefix + `/text ` + message.slice(2);
				} else if (message.startsWith(`|html|`)) {
					return prefix + `/raw ` + message.slice(6);
				} else if (message.startsWith(`|modaction|`)) {
					return prefix + `/log ` + message.slice(11);
				} else if (message.startsWith(`|raw|`)) {
					return prefix + `/raw ` + message.slice(5);
				} else if (message.startsWith(`|error|`)) {
					return prefix + `/error ` + message.slice(7);
				} else if (message.startsWith(`|c~|`)) {
					return prefix + message.slice(4);
				} else if (message.startsWith(`|c|~|/`)) {
					return prefix + message.slice(5);
				} else if (message.startsWith(`|c|~|`)) {
					return prefix + `/text ` + message.slice(5);
				}
				return prefix + `/text ` + message;
			})
			.join(`\n`);
	}
	send(content: string) {
		this.connection.send(content);
	}
	add(data: string) {
		this.send(data);
	}
	checkChat(
		message: string | null = null,
		targetUser: User | null = null
	): string | void | boolean {
		if (!targetUser && this.pmTarget) {
			targetUser = this.pmTarget;
		}
		if (typeof message !== "string") return true;
		let length = message.length;
		length += 10 * message.replace(/[^\ufdfd]*/g, "").length;
		if (length > MAX_MESSAGE_LENGTH)
			throw new Chat.ErrorMessage(`Your message is too long: ` + message);
		// remove zalgo
		message = message.replace(
			/[\u0300-\u036f\u0483-\u0489\u0610-\u0615\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06ED\u0E31\u0E34-\u0E3A\u0E47-\u0E4E]{3,}/g,
			""
		);
		if (/[\u115f\u1160\u239b-\u23b9]/.test(message))
			throw new Chat.ErrorMessage(
				`Your message contains banned characters.`
			);
	}
}

export class ErrorMessage extends Error {
	constructor(message: string) {
		super(message);
		this.name = "ErrorMessage";
		Error.captureStackTrace(this, ErrorMessage);
	}
}
export class Interruption extends Error {
	constructor() {
		super("");
		this.name = "Interruption";
		Error.captureStackTrace(this, ErrorMessage);
	}
}
export interface AnnotatedChatCommands {
	[k: string]:
		| AnnotatedChatHandler
		| string
		| string[]
		| AnnotatedChatCommands;
}
export type CRQHandler = (
	this: CommandContext,
	target: string,
	user: User,
	trustable?: boolean
) => any; //todo: remove?
class PatternTester {
	readonly elements: string[];
	readonly fastElements: Set<string>;
	regexp: RegExp | null;
	constructor() {
		this.elements = [];
		this.fastElements = new Set();
		this.regexp = null;
	}
	fastNormalize(elem: string) {
		return elem.slice(0, -1);
	}
	update() {
		const slowElements = this.elements.filter(
			(elem) => !this.fastElements.has(this.fastNormalize(elem))
		);
		if (slowElements.length) {
			this.regexp = new RegExp(
				"^(" +
					slowElements.map((elem) => "(?:" + elem + ")").join("|") +
					")",
				"i"
			);
		}
	}
	register(...elems: string[]) {
		for (const elem of elems) {
			this.elements.push(elem);
			if (/^[^ ^$?|()[\]]+ $/.test(elem)) {
				this.fastElements.add(this.fastNormalize(elem));
			}
		}
		this.update();
	}
	testCommand(text: string) {
		const spaceIndex = text.indexOf(" ");
		if (
			this.fastElements.has(
				spaceIndex >= 0 ? text.slice(0, spaceIndex) : text
			)
		) {
			return true;
		}
		if (!this.regexp) return false;
		return this.regexp.test(text);
	}
	test(text: string) {
		if (!text.includes("\n")) return null;
		if (this.testCommand(text)) return text;
		// The PM matching is a huge mess, and really needs to be replaced with
		// the new multiline command system soon.
		const pmMatches = /^(\/(?:pm|w|whisper|msg) [^,]*, ?)(.*)/i.exec(text);
		if (pmMatches && this.testCommand(pmMatches[2])) {
			if (
				text.split("\n").every((line) => line.startsWith(pmMatches[1]))
			) {
				return text.replace(/\n\/(?:pm|w|whisper|msg) [^,]*, ?/g, "\n");
			}
			return text;
		}
		return null;
	}
}
export const Chat = new (class {
	readonly MessageContext = MessageContext;
	readonly CommandContext = CommandContext;
	readonly ErrorMessage = ErrorMessage;
	readonly Interruption = Interruption;
	readonly MAX_TIMEOUT_DURATION = 2147483647;
	readonly multiLinePattern = new PatternTester();
	baseCommands!: AnnotatedChatCommands;
	commands!: AnnotatedChatCommands;
	readonly destroyHandlers: (() => void)[] = [];
	readonly crqHandlers: { [k: string]: CRQHandler } = {};
	sendPM(
		message: string,
		user: User,
		pmTarget: User,
		onlyRecipient: User | null = null
	) {
		const buf = `|pm|${user.getIdentity()}|${pmTarget.getIdentity()}|${message}`;
		if (onlyRecipient) return onlyRecipient.send(buf);
		user.send(buf);
		if (pmTarget !== user) pmTarget.send(buf);
		pmTarget.lastPM = user.id;
		user.lastPM = pmTarget.id;
	}
	parseCommand(
		message: string,
		recursing = false
	): {
		cmd: string;
		fullCmd: string;
		cmdToken: string;
		target: string;
		handler: AnnotatedChatHandler | null;
	} | null {
		if (!message.trim()) return null;
		if (message.startsWith(`>> `)) message = `/eval ${message.slice(3)}`;
		const cmdToken = message.charAt(0);
		if (!VALID_COMMAND_TOKENS.includes(cmdToken)) return null;
		if (cmdToken === message.charAt(1)) return null;
		if (
			cmdToken === BROADCAST_TOKEN &&
			/[^A-Za-z0-9]/.test(message.charAt(1))
		)
			return null;
		let [cmd, target] = Utils.splitFirst(message.slice(1), " ");
		cmd = cmd.toLowerCase();
		if (cmd.endsWith(",")) cmd = cmd.slice(0, -1);
		let curCommands: AnnotatedChatCommands = Chat.commands;
		let commandHandler;
		let fullCmd = cmd;
		do {
			if (cmd in curCommands) commandHandler = curCommands[cmd];
			else commandHandler = undefined;
			if (typeof commandHandler === "string") {
				commandHandler = curCommands[commandHandler];
			} else if (Array.isArray(commandHandler) && !recursing) {
				return this.parseCommand(
					cmdToken + "help " + fullCmd.slice(0, -4),
					true
				);
			}
			if (commandHandler && typeof commandHandler === "object") {
				[cmd, target] = Utils.splitFirst(target, " ");
				cmd = cmd.toLowerCase();
				fullCmd += " " + cmd;
				curCommands = commandHandler as AnnotatedChatCommands;
			}
		} while (commandHandler && typeof commandHandler === "object");
		if (!commandHandler && curCommands.default) {
			commandHandler = curCommands.default;
			if (typeof commandHandler === "string")
				commandHandler = curCommands[commandHandler];
		}
		return {
			cmd: cmd,
			cmdToken: cmdToken,
			target: target,
			fullCmd: fullCmd,
			handler: commandHandler as AnnotatedChatHandler | null,
		};
	}
	parse(message: string, user: User, connection: Sesh) {
		this.loadPlugins();
		const context = new CommandContext({ message, user, connection });
		const result = context.parse();
		return result;
	}
	loadPlugins() {
		if (Chat.commands) return;
		Chat.commands = Object.create(null);
		this.loadPlugin("chat-commands");
		Chat.baseCommands = Chat.commands;
		Chat.commands = Object.assign(Object.create(null), Chat.baseCommands);
	}
	loadPlugin(file: string) {
		let plugin;
		if (file.endsWith(".ts")) {
			plugin = require(`./${file.slice(0, -3)}`);
		} else if (file.endsWith(".js")) {
			plugin = require(`./${file}`);
		} else {
			if (isDev) plugin = require("./" + file);
			else plugin = require("./" + file);
		}
		this.loadPluginData(
			plugin,
			file.split("/").pop()?.slice(0, -3) || file
		);
	}
	loadPluginData(plugin: AnyObject, name: string) {
		if (plugin.commands)
			Object.assign(
				Chat.commands,
				this.annotateCommands(plugin.commands)
			);
		if (plugin.destroy) Chat.destroyHandlers.push(plugin.destroy);
	}
	annotateCommands(
		commandTable: AnyObject,
		namespace = ""
	): AnnotatedChatCommands {
		for (const cmd in commandTable) {
			const entry = commandTable[cmd];
			if (typeof entry === "object") {
				this.annotateCommands(entry, `${namespace}${cmd} `);
			}
			if (typeof entry === "string") {
				const base = commandTable[entry];
				if (!base) continue;
				if (!base.aliases) base.aliases = [];
				if (!base.aliases.includes(cmd)) base.aliases.push(cmd);
				continue;
			}
			if (typeof entry !== "function") continue;
			const handlerCode = entry.toString();
			entry.broadcastable =
				cmd.endsWith("help") ||
				/\bthis\.(?:(check|can|run)Broadcast)\(/.test(handlerCode);
			entry.isPrivate =
				/\bthis\.(?:privately(Check)?Can|commandDoesNotExist)\(/.test(
					handlerCode
				);
			if (!entry.aliases) entry.aliases = [];
			const runsCommand = /this.run\((?:'|"|`)(.*?)(?:'|"|`)\)/.exec(
				handlerCode
			);
			if (runsCommand) {
				const [, baseCommand] = runsCommand;
				const baseEntry = commandTable[baseCommand];
				if (baseEntry) {
					if (baseEntry.requiresRoom)
						entry.requiresRoom = baseEntry.requiresRoom;
					if (baseEntry.hasRoomPermissions)
						entry.hasRoomPermissions = baseEntry.hasRoomPermissions;
					if (baseEntry.broadcastable)
						entry.broadcastable = baseEntry.broadcastable;
					if (baseEntry.isPrivate)
						entry.isPrivate = baseEntry.isPrivate;
				}
			}
			entry.cmd = cmd;
			entry.fullCmd = `${namespace}${cmd}`;
		}
		return commandTable;
	}
})();
