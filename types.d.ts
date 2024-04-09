export function align(root: Block, children: Block[], options?: AlignOptions): AlignResult;

export type InputTree = {
	children?: InputTree[],

	[prop: string]: any,
};

export type NodeTree = Node[];

export type Block = {
	width: number,
	height: number,

	[prop: string]: any,
};

export type XY = {
	x: number,
	y: number,
};

export type Rect = Block & XY;

export type Child = Block & {
	children?: Child[],
};

export type AlignOptions = {
	minCenterMargin?: number,
	maxCenterMargin?: number,
	centerMargin?: number,
	childrenMargin?: number,
	left?: boolean | number,
	right?: boolean | number,
	top?: boolean | number,
	bottom?: boolean | number,
};

export type AlignError = {
	error: true,
	type: 'no_space' | 'max_center_margin',
};

export type AlignResult = Sides | AlignError;

export class Side {
	blocks: Block[];
	length: number;
	blocksLength: number;
	lengthProp: "width" | "height";
	width: number;
	height: number;
	blockMargin: number;

	getLengthOf(blocks: Block | Block[]): number
	getNextLengthWith(blocks: Block | Block[]): number
	canAdd(blocks: Block | Block[]): boolean
	add(blocks: Block | Block[]): void
	tryAdd(blocks: Block | Block[]): boolean
	remove(block: Block | number): Block
	reset(): void
}

export type SidesOf<T> = {
	left: T,
	right: T,
	top: T,
	bottom: T,
};

export type Sides = SidesOf<Side>;
export type SidesXY = SidesOf<XY>;