declare function polarTree(tree: InputTree | InputTree[], options?: Options): OutputTree;

export default polarTree;

export function alignChildren(root: Block, children: Block[], options?: AlignChildrenOptions): BlocksBySides | AlignChildrenError;

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

export type AlignChildrenOptions = {
	padding?: number,
	childrenMargin?: number,
	left?: boolean | number,
	right?: boolean | number,
	top?: boolean | number,
	bottom?: boolean | number,
};

export type BlocksBySides = {
	left: Block[],
	right: Block[],
	top: Block[],
	bottom: Block[],
};

export type AlignChildrenError = {
	error: true,
	type: 'no_space',
};