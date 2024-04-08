/**
 * split outer number to chunks for optimize inner position
 *
 * @param {number} outer - must be greater or equal to inner
 * @param {number} inner - could be 0
 * @returns {Array<number>}
 */
export default function getOuterMask(outer, inner) {
	if (inner > outer) {
		throw new Error(`outer (${JSON.stringify(outer)}) must be greater or equal to inner (${JSON.stringify(inner)})`);
	}

	const mask = [];

	if (outer === inner) {
		for (let i = 0; i < outer; i++) {
			mask.push(1);
		}

		mask.push(0);

		return mask;
	}

	const dr = outer % (inner + 1);
	const df = Math.floor(outer / (inner + 1));

	for (let i = 0; i <= inner; i++) {
		mask.push(df);
	}

	if (dr === 0) return mask;

	const start = Math.ceil(mask.length / 2) - 1; // middle index

	for (let i = 0, n = start, dir = -1; i < dr; i++, dir *= -1) {
		n = n + dir * i;
		mask[n]++;
	}

	return mask;
}