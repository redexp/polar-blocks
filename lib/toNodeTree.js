/**
 * @param {import('types').InputTree[]} tree
 * @returns {import('types').NodeTree}
 */
export default function toNodeTree(tree) {
	const rect = {
		start_deg: 0,
		end_deg: 0,
		deg: 0,
		radius: 0,
		height: 0,
		level: 0,
	};

	return tree.map((node) => {
		const children = node.children && toNodeTree(node.children) || [];

		return {
			rect: {...rect},

			children,

			levels: [{
				...rect,

				children: children.slice(0),
			}],
		};
	});
}