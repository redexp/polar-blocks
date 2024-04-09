/**
 * @param {Sides} sides
 * @param {SidesXY} pos
 * @returns {Rect}
 */
export default function getViewBox(sides, pos) {
	return {
		x: pos.left.x,
		y: pos.top.y,
		width: pos.right.x + sides.right.width - pos.left.x,
		height: pos.bottom.y + sides.bottom.height - pos.top.y,
	};
}