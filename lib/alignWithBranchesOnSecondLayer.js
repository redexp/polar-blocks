import alignChildrenBySides from "./alignChildrenBySides.js";

/**
 * @param {Block} center
 * @param {Child[]} children
 * @param {AlignOptions} options
 * @return {[Sides, Sides | null] | AlignError}
 */
export default function alignWithBranchesOnSecondLayer(center, children, options) {
	const {minCenterMargin = 0, maxCenterMargin = 10_000} = options;
	const start = options.hasOwnProperty('centerMargin') ? options.centerMargin : minCenterMargin;
	const end   = options.hasOwnProperty('centerMargin') ? options.centerMargin : maxCenterMargin;

	const branches = children.filter(item => item.children?.length > 0);

	/** @type {Array<[Child[], Child[]]>} */
	const slices = [
		[children, []]
	];

	for (let i = 1; i <= branches.length; i++) {
		const list = branches.slice(0, i);

		slices.push([
			children.filter(item => !list.includes(item)),
			list,
		]);
	}

	const rectSides = ['left', 'top', 'right', 'bottom'];

	for (let centerMargin = start; centerMargin <= end; centerMargin += 10) {
		options.centerMargin = centerMargin;

		for (const [list, rest] of slices) {
			const layer1 = alignChildrenBySides(center, list, options);

			if (layer1.error) continue;

			if (rest.length === 0) return [layer1, null];

			const ops = {...options};

			for (const side of rectSides) {
				const {length, blocks} = layer1[side];
				ops[side] = length > 0 && blocks.every(b => !b.children);
			}

			const layer2 = alignChildrenBySides(center, rest, ops);

			if (!layer2.error) {
				return [layer1, layer2];
			}
		}
	}

	return {
		error: true,
		type: 'max_center_margin',
	};
}