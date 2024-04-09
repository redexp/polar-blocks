/**
 * @param {Block} center
 * @param {Sides} sides
 * @param {AlignOptions} options
 * @returns {Rect}
 */
export default function getFirstLayerRect(center, sides, options) {
	const {centerMargin: p, childrenMargin: m} = options;

	const rect = {
		x: -p,
		y: -m,
		width: Math.max(sides.top.width, sides.bottom.width, center.width),
		height: m + center.height + m,
	};

	rect.x = (center.width - rect.width) / 2 - m;
	rect.width += m * 2;

	return rect;
}