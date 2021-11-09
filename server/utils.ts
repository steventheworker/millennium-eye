type StrNumObj = String | Number | User;
export type IDObj = StrNumObj & {
	id?: ID;
	userid?: ID;
	roomid?: ID;
};
export function toID<T extends Partial<IDObj>>(text: T): ID {
	let str = "";
	if (typeof text === "number") str = text + "";
	if (typeof text === "string") str = text;
	if (text && text.id) {
		str = text.id;
	} else if (text && text.userid) {
		str = text.userid;
	} else if (text && text.roomid) {
		str = text.roomid;
	}
	if (typeof text !== "string" && typeof text !== "number") return "";
	return str.toLowerCase().replace(/[^a-z0-9]+/g, "") as ID;
}

//ps-code
export function splitFirst(str: string, delimiter: string): [string, string];
export function splitFirst(
	str: string,
	delimiter: string,
	limit: 2
): [string, string, string];
export function splitFirst(
	str: string,
	delimiter: string,
	limit: 3
): [string, string, string, string];
export function splitFirst(
	str: string,
	delimiter: string,
	limit: number
): string[];
/**
 * Like string.split(delimiter), but only recognizes the first `limit`
 * delimiters (default 1).
 *
 * `"1 2 3 4".split(" ", 2) => ["1", "2"]`
 *
 * `Utils.splitFirst("1 2 3 4", " ", 1) => ["1", "2 3 4"]`
 *
 * Returns an array of length exactly limit + 1.
 *
 */
export function splitFirst(str: string, delimiter: string, limit = 1) {
	const splitStr: string[] = [];
	while (splitStr.length < limit) {
		const delimiterIndex = str.indexOf(delimiter);
		if (delimiterIndex >= 0) {
			splitStr.push(str.slice(0, delimiterIndex));
			str = str.slice(delimiterIndex + delimiter.length);
		} else {
			splitStr.push(str);
			str = "";
		}
	}
	splitStr.push(str);
	return splitStr;
}
/**
 * Visualizes eval output in a slightly more readable form
 */
export function visualize(value: any, depth = 0): string {
	if (value === undefined) return `undefined`;
	if (value === null) return `null`;
	if (typeof value === "number" || typeof value === "boolean") {
		return `${value}`;
	}
	if (typeof value === "string") {
		return `"${value}"`; // NOT ESCAPED
	}
	if (typeof value === "symbol") {
		return value.toString();
	}
	if (Array.isArray(value)) {
		if (depth > 10) return `[array]`;
		return (
			`[` +
			value.map((elem) => visualize(elem, depth + 1)).join(`, `) +
			`]`
		);
	}
	if (
		value instanceof RegExp ||
		value instanceof Date ||
		value instanceof Function
	) {
		if (depth && value instanceof Function) return `Function`;
		return `${value}`;
	}
	let constructor = "";
	if (
		value.constructor &&
		value.constructor.name &&
		typeof value.constructor.name === "string"
	) {
		constructor = value.constructor.name;
		if (constructor === "Object") constructor = "";
	} else {
		constructor = "null";
	}
	// If it has a toString, try to grab the base class from there
	// (This is for Map/Set subclasses like user.auth)
	const baseClass =
		(value?.toString && /\[object (.*)\]/.exec(value.toString())?.[1]) ||
		constructor;

	switch (baseClass) {
		case "Map":
			if (depth > 2) return `Map`;
			const mapped = [...value.entries()].map(
				(val) =>
					`${visualize(val[0], depth + 1)} => ${visualize(
						val[1],
						depth + 1
					)}`
			);
			return `${constructor} (${value.size}) { ${mapped.join(", ")} }`;
		case "Set":
			if (depth > 2) return `Set`;
			return `${constructor} (${value.size}) { ${[...value]
				.map((v) => visualize(v), depth + 1)
				.join(", ")} }`;
	}

	if (value.toString) {
		try {
			const stringValue = value.toString();
			if (
				typeof stringValue === "string" &&
				stringValue !== "[object Object]" &&
				stringValue !== `[object ${constructor}]`
			) {
				return `${constructor}(${stringValue})`;
			}
		} catch (e) {}
	}
	let buf = "";
	for (const key in value) {
		if (!Object.prototype.hasOwnProperty.call(value, key)) continue;
		if (depth > 2 || (depth && constructor)) {
			buf = "...";
			break;
		}
		if (buf) buf += `, `;
		let displayedKey = key;
		if (!/^[A-Za-z0-9_$]+$/.test(key)) displayedKey = JSON.stringify(key);
		buf += `${displayedKey}: ` + visualize(value[key], depth + 1);
	}
	if (constructor && !buf && constructor !== "null") return constructor;
	return `${constructor}{${buf}}`;
}

export function escapeHTML(str: string) {
	if (!str) return "";
	return ("" + str)
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&apos;")
		.replace(/\//g, "&#x2f;")
		.replace(/\n/g, "<br />");
}
