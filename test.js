import alignWithBranchesOnSecondLayer from './lib/alignWithBranchesOnSecondLayer.js';
import alignSidesInSpace from './lib/alignSidesInSpace.js';
import getFirstLayerRect from './lib/getFirstLayerRect.js';
import getSecondLayerRect from './lib/getSecondLayerRect.js';
import getViewBox from './lib/getViewBox.js';
import express from 'express';

const app = express();

app.get('/', function (req, res) {
	res.type('svg');
	run(res);
});

app.listen(3000, () => console.log('http://localhost:3000'));

function run(res) {
	const center = randomBlock();
	const children = randomBlocks();
	/** @type {AlignOptions} */
	const options = {minCenterMargin: 10, childrenMargin: 100};

	const sides = alignWithBranchesOnSecondLayer(center, children, options);

	if (sides.error) {
		res.type('json');
		res.json(sides);
		return;
	}

	render(center, sides, res, options);
}

/**
 * @returns {Rect}
 */
function randomBlock(data = {}) {
	return {
		width: Math.round(100 + Math.random() * 900),
		height: Math.round(100 + Math.random() * 900),
		x: 0,
		y: 0,
		...data,
	};
}

/**
 * @returns {Array<Rect>}
 */
function randomBlocks() {
	const list = [];
	const len = Math.ceil(5 + Math.random() * 20);

	for (let i = 0; i < len; i++) {
		list.push(randomBlock({title: i + 1, children: Math.round(Math.random()) ? [{}] : null}));
	}

	return list;
}

/**
 * @param {Rect} center
 * @param {[Sides, Sides | null]} levels
 * @param {Writable} stream
 * @param {import('types').AlignOptions} options
 */
function render(center, levels, stream, options) {
	const [inner, outer] = levels;

	const rect = getFirstLayerRect(center, inner, options);
	const pos = alignSidesInSpace(rect, center, inner);

	const rect2 = outer && getSecondLayerRect(rect, pos, inner, outer, options)
	const pos2 = rect2 && alignSidesInSpace(rect2, center, outer);

	const view = getViewBox(outer || inner, pos2 || pos);

	stream.write(`<?xml version="1.0" encoding="UTF-8"?>
<svg version="1.1"
     baseProfile="full"
     xmlns="http://www.w3.org/2000/svg" 
     xmlns:xlink="http://www.w3.org/1999/xlink"
     viewBox="${view.x} ${view.y} ${view.width} ${view.height}"
     height="100%"  
     width="100%">
`);

	stream.write(toRect(center));

	renderSides(stream, inner, pos, options);

	if (outer) {
		renderSides(stream, outer, pos2, options);
	}

	stream.write(`</svg>`);

	stream.end();
}

/**
 * @param {Writable} stream
 * @param {Sides} sides
 * @param {SidesXY} pos
 * @param {AlignOptions} options
 */
function renderSides(stream, sides, pos, options) {
	const {left, right, top, bottom} = sides;
	const {childrenMargin: m} = options;

	stream.write(toG(pos.left));
	let y = 0;
	for (const block of left.blocks) {
		stream.write(toRect({...block, y, x: left.width - block.width}));
		y += block.height + m;
	}
	stream.write(`</g>\n`);

	stream.write(toG(pos.right));
	y = 0;
	for (const block of right.blocks) {
		stream.write(toRect({...block, y}));
		y += block.height + m;
	}
	stream.write(`</g>\n`);
	
	stream.write(toG(pos.top));
	let x = 0;
	for (const block of top.blocks) {
		stream.write(toRect({...block, x, y: top.height - block.height}));
		x += block.width + m;
	}
	stream.write(`</g>\n`);

	stream.write(toG(pos.bottom));
	x = 0;
	for (const block of bottom.blocks) {
		stream.write(toRect({...block, x}));
		x += block.width + m;
	}
	stream.write(`</g>\n`);
}

function toRect({width, height, x = 0, y = 0, title = '', children = false}) {
	const style = `fill="${children ? '#fcfbab' : '#fff'}" stroke="#000" stroke-width="2"`;

	return (
		`\t<rect width="${width}" height="${height}" x="${x}" y="${y}" ${style}/>\n` +
		`\t<text x="${x + 10}" y="${y + 10}" style="font-size:${Math.min(width, height)}px;alignment-baseline: hanging;">${title}</text>\n`
	);
}

function toG(g) {
	return `<g transform="translate(${g.x}, ${g.y})">\n`;
}