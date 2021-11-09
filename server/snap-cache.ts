import { snap as _snap, Callback } from "./snap-image";

export type SnapCache = string[];
export const snapCache: SnapCache = [];
function cacheSnap(data: string) {
	clearCache(); //todo: limit no. snapCache rather than having 1 only
	snapCache.push(data);
}
function clearCache() {
	snapCache.splice(0, snapCache.length);
}
export function snap(callback?: Callback) {
	_snap((data) => {
		cacheSnap(data);
		if (callback) callback(data);
	});
}
