declare function polarTree(tree: InputTree | InputTree[], options?: Options): OutputTree;

export default polarTree;

export function align(root: Block, children: Block[], options?: AlignOptions): AlignResult;

export type InputTree = {
	children?: InputTree[],

	[prop: string]: any,
};

export type OutputTree = InputTree & {
	rect: Rect,
};

export type Rect = {
	start_deg: number,
	end_deg: number,
	deg: number,
	radius: number,
	height: number,
	level: number,
};

export type Options = {
	nodeSize?: (node: Node) => Size,
	defaultNodeHeight?: number,
	sortChildren?: boolean | ((children: Node[], parent: Node | null) => void),
};

export type NodeTree = Node[];

export type Node = {
	rect: Rect,

	// all children in one row
	children: Node[],

	// children by levels
	levels: Level[],
};

export type Level = Rect & {
	parent: Node,

	children: Node[],
};

export type Size = {
	deg: number,
	height: number,
};

export type Block = {
	width: number,
	height: number,

	[prop: string]: any,
};

export type AlignOptions = {
	centerMargin?: number,
	childrenMargin?: number,
	left?: boolean | number,
	right?: boolean | number,
	top?: boolean | number,
	bottom?: boolean | number,
};

export type AlignError = {
	error: true,
	type: 'no_space',
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