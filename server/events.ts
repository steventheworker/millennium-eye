import { PythonShell } from "python-shell";
import * as fs from "fs";
import { Chat } from "./chat/chat";

let lastRefreshT = 0;

type EventFunction = (user: User, connection: Sesh, data: string[]) => void;
export const events: { [i: string]: EventFunction | string } = {
  chat: "c",
  c: (user, connection, data) => {
    data.pop();
    Chat.parse(data.join("|"), user, connection);
  },
  events: "es",
  es: (user, connection, data) => {
    const movementData = data[0];
    const t = Date.now();
    const shouldRefresh = t - lastRefreshT > 3000;
    if (shouldRefresh) lastRefreshT = t;
    PythonShell.run("../py/es.py", { args: [movementData, shouldRefresh ? 'y' : 'n'] }, (err, res) => {
      if (err) fs.writeFileSync("err.txt", err + "\npy err:" + res);
      if (shouldRefresh) Users.users.forEach((user) => user.send("r|" + res));
    });
  },
};

export const getLastRefreshT = () => lastRefreshT;