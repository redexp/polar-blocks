/**
 * @param {Block} root
 * @param {Block[]} children
 * @param {AlignOptions} options
 * @returns {AlignResult}
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
		return sides;
	}

	if (alignLeftRight(children, sides) === children.length) {
		return sides;
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

		if (index === len) return sides;

		const next = alignLeftRight(children, sides, index);

		if (next === len) break;
	}

	return sides;
}

/**
 * @param {Block} root
 * @param {AlignOptions} options
 * @returns {Sides}
 */
function createSides(root, options) {
	const sides = {};
	const {centerMargin = 0, childrenMargin = 0} = options;
	const names = [
		['bottom', 'width'],
		['left', 'height'],
		['right', 'height'],
		['top', 'width'],
	];

	for (const [name, prop] of names) {
		const value = options[name];
		const length = root[prop] + centerMargin * 2;

		const side = new Side(prop, length, childrenMargin);

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
 * @param {Block[]} children
 * @param {Sides} sides
 * @returns {AlignResult}
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
			sides :
			noSpace()
	);
}

/**
 * @param {Block[]} children
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
 * @returns {AlignError}
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
	 * @param {"width" | "height"} lengthProp
	 * @param {number} length
	 * @param {number} blockMargin
	 */
	constructor(lengthProp, length, blockMargin = 0) {
		this.lengthProp = lengthProp;
		this.otherProp = lengthProp === 'width' ? 'height' : 'width';
		this.blocks = [];
		this.length = length;
		this.blocksLength = 0;
		this.width = 0;
		this.height = 0;
		this.blockMargin = blockMargin;
	}

	getLengthOf(blocks) {
		if (!isArray(blocks)) {
			return blocks[this.lengthProp];
		}

		if (blocks.length === 0) return 0;

		let length = 0;

		for (const block of blocks) {
			length += block[this.lengthProp];
		}

		return length + this.blockMargin * blocks.length - 1;
	}

	getNextLengthWith(blocks) {
		let curLen = this.blocksLength;

		if (curLen) {
			curLen += this.blockMargin;
		}

		return curLen + this.getLengthOf(blocks);
	}

	canAdd(blocks) {
		return this.getNextLengthWith(blocks) <= this.length;
	}

	/**
	 * @param {Block} block
	 */
	add(block) {
		if (isArray(block)) {
			for (const it of block) {
				this.add(it);
			}
			return;
		}

		if (this.blocks.includes(block)) return;

		this.blocks.push(block);
		this.blocksLength = this.getNextLengthWith(block);
		this[this.lengthProp] = this.blocksLength;

		if (this[this.otherProp] < block[this.otherProp]) {
			this[this.otherProp] = block[this.otherProp];
		}
	}

	tryAdd(blocks) {
		if (!this.canAdd(blocks)) return false;

		this.add(blocks);

		return true;
	}

	/**
	 * @param {Block} block
	 * @returns {Block}
	 */
	remove(block) {
		let index;

		if (typeof block === 'number') {
			index = block;
			block = this.blocks[index];

			if (!block) return;
		}
		else {
			index = this.blocks.indexOf(block);
		}

		if (index === -1) return;

		if (index === 0) {
			this.blocks.shift();
		}
		else if (index + 1 === this.blocks.length) {
			this.blocks.pop();
		}
		else {
			this.blocks.splice(index, 1);
		}

		this.blocksLength = this.getLengthOf(this.blocks);
		this[this.lengthProp] = this.blocksLength;
		const op = this.otherProp;
		this[op] = this.blocks.reduce((max, block) => max < block[op] ? block[op] : max, 0);

		return block;
	}

	reset() {
		if (this.blocksLength === 0) return;

		this.blocks = [];
		this.blocksLength = 0;
		this.width = 0;
		this.height = 0;
	}
}