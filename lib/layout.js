import sortChildren from './sortChildren.js';

/**
 * @param {import('types').NodeTree} tree
 * @param {import('types').Options} options
 */
export default function layout(tree, options) {
	const defHeight = options.defaultNodeHeight || 100;
	const sort = (
		typeof options.sortChildren === 'function' ?
			options.sortChildren :
		options.sortChildren === false ?
			noop :
			sortChildren
	);

	sort(tree, null);

	let startDeg = 0;
	const deg = 1 / tree.length;

	for (const node of tree) {
		const {rect} = node;
		rect.start_deg = startDeg;
		rect.end_deg = startDeg + deg;
		rect.deg = deg;
		rect.height = defHeight;

		startDeg = node.rect.end_deg;
	}

	let lv = 0;
	/** @type {import('types').Level[]} */
	const level = tree.map(node => node.levels[lv]);

	
}

function noop() {}