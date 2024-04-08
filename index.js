import toNodeTree from './lib/toNodeTree.js';
import layout from './lib/layout.js';

/**
 * @param {import('types').InputTree} input_tree
 * @param {import('types').Options} [options]
 * @returns {import('types').OutputTree}
 */
export default function polarTree(input_tree, options = {}) {
	if (!Array.isArray(input_tree)) {
		input_tree = [input_tree];
	}

	const tree = toNodeTree(input_tree);

	layout(tree, options);

}

