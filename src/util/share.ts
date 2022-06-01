import { Cell, CellType } from '../components/EditableCell';
import { Grid } from '../components/EditableGrid';

const base = `${location.protocol}//${location.host}`;

export enum AbbreviatedCellMapping {
	Empty = 'e',
	Box = 'b',
	Wall = 'w',
	Hole = 'h',
	Goal = 'g',
	Player = 'p'
}

const CellMapping: Record<CellType, AbbreviatedCellMapping> = {
	[CellType.Empty]: AbbreviatedCellMapping.Empty,
	[CellType.Box]: AbbreviatedCellMapping.Box,
	[CellType.Wall]: AbbreviatedCellMapping.Wall,
	[CellType.Hole]: AbbreviatedCellMapping.Hole,
	[CellType.Goal]: AbbreviatedCellMapping.Goal,
	[CellType.Player]: AbbreviatedCellMapping.Player
};

const ReverseCellMapping: Record<AbbreviatedCellMapping, CellType> = {
	[AbbreviatedCellMapping.Empty]: CellType.Empty,
	[AbbreviatedCellMapping.Box]: CellType.Box,
	[AbbreviatedCellMapping.Wall]: CellType.Wall,
	[AbbreviatedCellMapping.Hole]: CellType.Hole,
	[AbbreviatedCellMapping.Goal]: CellType.Goal,
	[AbbreviatedCellMapping.Player]: CellType.Player
};

export const serialize = (grid: Grid, moves: number) => {
	let serialized = '';

	for (const cell of grid.cells) {
		serialized += CellMapping[cell.type];
	}

	return `${base}/play?moves=${moves}&width=${grid.size.width}&height=${grid.size.height}&cells=${serialized}`;
};

export const deserialize = (url: string) => {
	const cells: Array<Cell> = [];

	const parsedURL = new URL(url);

	const moves = Number(parsedURL.searchParams.get('moves')) ?? 0;
	const width = Number(parsedURL.searchParams.get('width')) ?? 3;
	const height = Number(parsedURL.searchParams.get('height')) ?? 3;
	const serializedCells =
		parsedURL.searchParams.get('cells') ?? Array.from({ length: width * height }, () => 'e').join('');

	for (const char of serializedCells.split('')) {
		cells.push({
			type: ReverseCellMapping[char] ?? CellType.Empty
		});
	}

	const grid: Grid = {
		size: { width, height },
		cells
	};

	return { grid, moves };
};
