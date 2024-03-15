/**
 * @param {import('types').Block} root
 * @param {import('types').Block[]} children
 * @param {import('types').AlignOptions} options
 * @returns {import('types').AlignResult}
 */
export default function align(
	root,
	children,
	options = {}
) {
	const sides = createSides(root, options);

	const count = (
		(sides.left.length ? 1 : 0) +
		(sides.right.length ? 1 : 0) +
		(sides.top.length ? 1 : 0) +
		(sides.bottom.length ? 1 : 0)
	);

	if (count === 0) return noSpace();

	if (count === 1) return alignOneSide(children, sides);

	if (sides.bottom.tryAdd(children)) {
		return toResult(sides);
	}

	if (alignLeftRight(children, sides) === children.length) {
		return toResult(sides);
	}

	let index = 0;
	const len = children.length;

	while (index < len) {
		sides.left.reset();
		sides.right.reset();
		sides.bottom.reset();

		if (!sides.top.tryAdd(children[index++])) {
			return noSpace();
		}

		if (index === len) break;

		const next = alignLeftRight(children, sides, index);

		if (next === len) break;
	}

	return toResult(sides);
}

/**
 * @typedef {{left: Side, right: Side, top: Side, bottom: Side}} Sides
 */

/**
 * @param {import('types').Block} root
 * @param {import('types').AlignOptions} options
 * @returns {Sides}
 */
function createSides(root, options) {
	const sides = {};
	const {padding = 20} = options;
	const names = [
		['bottom', 'width'],
		['left', 'height'],
		['right', 'height'],
		['top', 'width'],
	];

	for (const [name, prop] of names) {
		const value = options[name];
		const length = root[prop] + padding * 2;

		const side = new Side(prop, length);

		if (value === false) {
			side.length = 0;
		}
		else if (typeof value === 'number') {
			side.length = value;
		}

		sides[name] = side;
	}

	return sides;
}

/**
 * @param {import('types').Block[]} children
 * @param {Sides} sides
 * @returns {import('types').AlignResult}
 */
function alignOneSide(children, sides) {
	const side = (
		(sides.left.length && sides.left) ||
		(sides.right.length && sides.right) ||
		(sides.top.length && sides.top) ||
		sides.bottom
	);

	return (
		side.tryAdd(children) ?
			toResult(sides) :
			noSpace()
	);
}

/**
 * @param {import('types').Block[]} children
 * @param {Sides} sides
 * @param {number} index
 * @returns {number}
 */
function alignLeftRight(children, sides, index = 0) {
	const {left, right, bottom} = sides;
	const len = children.length;

	while (index < len) {
		const item = children[index];

		const side = left.itemsLength <= right.itemsLength ? left : right;

		if (side.tryAdd(item)) {
			index++;
			continue;
		}

		const other = side === left ? right : left;

		if (other.tryAdd(item)) {
			index++;
			continue;
		}

		break;
	}

	if (index < len && bottom.tryAdd(children.slice(index))) {
		index = len;
	}

	return index;
}

/**
 * @param {Sides} sides
 * @returns {import('types').BlocksBySides}
 */
function toResult(sides) {
	return {
		left: sides.left.items,
		right: sides.right.items,
		top: sides.top.items,
		bottom: sides.bottom.items,
	};
}

/**
 * @returns {import('types').AlignError}
 */
function noSpace() {
	return {
		error: true,
		type: 'no_space',
	};
}

const isArray = Array.isArray;

class Side {
	/**
	 * @param {"width" | "height"} itemProp
	 * @param {number} length
	 */
	constructor(itemProp, length) {
		this.itemProp = itemProp;
		this.items = [];
		this.length = length;
		this.itemsLength = 0;
	}

	getItemLength(items) {
		if (!isArray(items)) {
			return items[this.itemProp];
		}

		let length = 0;

		for (const item of items) {
			length += item[this.itemProp];
		}

		return length;
	}

	canAdd(items) {
		return this.itemsLength + this.getItemLength(items) <= this.length;
	}

	overflow() {
		return this.itemsLength > this.length;
	}

	add(item) {
		if (isArray(item)) {
			for (const it of item) {
				this.add(it);
			}
			return;
		}

		if (this.items.includes(item)) return;

		this.items.push(item);
		this.itemsLength += this.getItemLength(item);
	}

	tryAdd(items) {
		if (!this.canAdd(items)) return false;

		this.add(items);

		return true;
	}

	remove(item) {
		let index;

		if (typeof item === 'number') {
			index = item;
			item = this.items[index];

			if (!item) return;
		}
		else {
			index = this.items.indexOf(item);
		}

		if (index === -1) return;

		if (index === 0) {
			this.items.shift();
		}
		else if (index + 1 === this.items.length) {
			this.items.pop();
		}
		else {
			this.items.splice(index, 1);
		}

		this.itemsLength -= this.getItemLength(item);

		return item;
	}

	removeFirst() {
		return this.remove(0);
	}

	removeLast() {
		return this.remove(this.items.length - 1);
	}

	has(item) {
		return this.items.includes(item);
	}

	reset() {
		if (this.itemsLength === 0) return;

		this.items = [];
		this.itemsLength = 0;
	}
}