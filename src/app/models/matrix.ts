export interface Matrix {
	columns: Column[];
	pattern: PredictType[];
	size: number;
}

export interface Column {
	index: number;
	chars: Char[];
	used: boolean;
	hidden: boolean;
}

export type Char = 0 | 1 | 2;

export const MappedChar = ['1', 'x', '2'];

export type PredictType = 1 | 2 | 3;