import { ComponentChildren } from 'preact';
import EditableCell, { Cell } from '../EditableCell';
import { GridSize } from '../GridSizeInput';
import style from './style.module.css';

export interface Grid {
	size: GridSize;
	cells: Array<Cell>;
}

export interface EditableGridProps {
	grid: Grid;
	onClick: (position: { x: number; y: number }, cell: Cell) => void;
	children?: ComponentChildren;
}

export default function EditableGrid({ grid, onClick, children = null }: EditableGridProps) {
	const renderCells = (row: number) => {
		const cells = [];

		for (let i = 0; i < grid.size.width; i++) {
			cells.push(<EditableCell row={row} col={i} grid={grid} onClick={onClick} />);
		}

		return cells;
	};

	const renderRows = () => {
		const rows = [];

		for (let i = 0; i < grid.size.height; i++) {
			rows.push(<div class={style.row}>{renderCells(i)}</div>);
		}

		return rows;
	};

	return (
		<div class={style.EditableGrid}>
			<div class={style.gridWrapper}>
				<div class={style.grid}>
					{children}
					{renderRows()}
				</div>
			</div>
		</div>
	);
}
