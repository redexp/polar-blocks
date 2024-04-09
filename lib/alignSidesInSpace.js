/**
 * @param {Rect} rect
 * @param {Rect} center
 * @param {Sides} sides
 * @returns {SidesXY}
 */
export default function alignSidesInSpace(rect, center, sides) {
	const {left, right, top, bottom} = sides;

	const cx = center.x + center.width / 2;
	const cy = center.y + center.height / 2;

	const leftG = {
		x: rect.x - left.width,
		y: center.y,
	};

	if (leftG.y + left.height > rect.y + rect.height) {
		leftG.y = cy - left.height / 2;
	}

	const rightG = {
		x: rect.x + rect.width,
		y: center.y,
	};

	if (rightG.y + right.height > rect.y + rect.height) {
		rightG.y = cy - right.height / 2;
	}

	const topG = {
		x: cx - top.width / 2,
		y: Math.min(
			leftG.y + (left.blocks[0]?.height || 0),
			rightG.y + (right.blocks[0]?.height || 0),
			rect.y
		) - top.height,
	};

	if (topG.x < rect.x) {
		topG.x = rect.x;
	}
	else if (topG.x + top.width > rect.x + rect.width) {
		topG.x = (rect.x + rect.width) - top.width;
	}

	const bottomG = {
		x: cx - bottom.width / 2,
		y: Math.max(
			leftG.y + left.height - (left.blocks.at(-1)?.height || 0),
			rightG.y + right.height - (right.blocks.at(-1)?.height || 0),
			rect.y + rect.height
		),
	};

	if (bottom.blocks.length === 0) {
		bottomG.y = rect.y + rect.height;
	}

	if (bottomG.x < rect.x) {
		bottomG.x = rect.x;
	}
	else if (bottomG.x + bottom.width > rect.x + rect.width) {
		bottomG.x = (rect.x + rect.width) - bottom.width;
	}

	return {
		left: leftG,
		right: rightG,
		top: topG,
		bottom: bottomG,
	};
}