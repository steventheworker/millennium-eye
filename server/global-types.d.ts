type ID = "" | (string & { __isID: true });
type Connection = import("sockjs").Connection;
type User = import("./users").User;
type Sesh = import("./users").Sesh;
namespace Chat {
	type ChatCommands = import("./chat/chat").ChatCommands;
}
