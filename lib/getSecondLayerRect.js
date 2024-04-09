/**
 * @param {Rect} rect
 * @param {SidesXY} pos
 * @param {Sides} inner
 * @param {Sides} outer
 * @param {AlignOptions} options
 * @returns {Rect}
 */
export default function getSecondLayerRect(rect, pos, inner, outer, options) {
	const {childrenMargin: m} = options;
	const marg = (v) => v ? v + m : 0;

	const rect2 = {
		x: rect.x - marg(inner.left.width),
		y: Math.min(
			pos.left.y,
			pos.right.y,
			pos.top.y
		) - m,
		width: marg(inner.left.width) + rect.width + marg(inner.right.width),
		height: 0,
	};

	if (outer.top.width < rect.width) {
		rect2.y = Math.min(
			pos.left.y + (inner.left.blocks[0]?.height || 0),
			pos.right.y + (inner.right.blocks[0]?.height || 0),
			pos.top.y
		) - m;
	}

	let bottomY = Math.max(
		pos.left.y + inner.left.height + m,
		pos.right.y + inner.right.height + m,
		inner.bottom.blocks.length > 0 ?
			pos.bottom.y + inner.bottom.height + m :
			rect.y + rect.height
	);

	rect2.height = bottomY - rect2.y;

	return rect2;
}