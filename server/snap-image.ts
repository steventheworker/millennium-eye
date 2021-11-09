import { PythonShell } from "python-shell";

export function snap(callback?: Callback) {
  const t: number = new Date().getTime();
  queue.push([t, callback!]);
  processQueue();
}

//queue stuff
export type Callback = { (imgData?: string): void };
type CallbackArray = [time: number, callback: Callback];
const queue: CallbackArray[] = [];
const LAPSE_MS = 333;
let isProcessing = false;
function emptyQueue() {
  queue.splice(0, queue.length); //reset array(queue = []) but maintain as const!!! ugh
}
function processQueue() {
  if (isProcessing) return;
  const t = new Date().getTime();
  const t0 = queue[0] ? queue[0][0] : 0;
  if (t - t0 < LAPSE_MS) {
    isProcessing = true;
    return setTimeout(() => {
      isProcessing = false;
      processQueue();
    }, LAPSE_MS - (t - t0));
  }
  if (!Users.online) return emptyQueue();
  //create the picture
  PythonShell.run("../py/screeny.py", {}, function (err, imgData) {
    if (err) throw err;
    queue.forEach((el) => (el[1] ? el[1](imgData[0] as string) : 0)); //perform callbacks
    emptyQueue();
    logTimeDiff();
  });
}

//debug / helpers
const firstT = new Date().getTime();
let lastT = firstT;
function logTimeDiff() {
  const t = new Date().getTime();
  console.log((t - lastT) / 1000 + "s\t-\tsince last pic");
  console.log("-------------------------------------");
  lastT = new Date().getTime();
}
