import * as UsersType from "./users";
import { IDObj } from "./utils";
import { SnapCache } from "./snap-cache";
declare global {
	namespace NodeJS {
		interface Global {
			toID<T extends Partial<IDObj>>(text: T): ID;
			Users: typeof UsersType.Users;
			Chat: typeof import("./chat/chat");
			snapCache: SnapCache;
			isDev: boolean;
		}
	}
	var toID: <T extends Partial<IDObj>>(text: T) => ID;
	var Users: typeof UsersType.Users;
	var Chat: typeof import("./chat/chat");
	var snapCache: SnapCache;
	var isDev: boolean;
}
