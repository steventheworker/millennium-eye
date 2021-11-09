import { PythonShell } from "python-shell";
import * as fs from "fs";
import { Chat } from "./chat/chat";

type EventFunction = (user: User, connection: Sesh, data: string[]) => void;
const events: { [i: string]: EventFunction | string } = {
  chat: "c",
  c: (user, connection, data) => {
    data.pop();
    Chat.parse(data.join("|"), user, connection);
  },
  events: "es",
  es: (user, connection, data) => {
    const movementData = data[0];
    PythonShell.run("../py/es.py", { args: [movementData] }, (err, res) => {
      if (err) fs.writeFileSync("err.txt", err + "\npy err:" + res);
    });
  },
};

export default events;
